// Task 29 — Account email+password (Supabase Auth) con profilo nickname.
// Alla creazione: bonus 1000 monete virtuali; merge al max col saldo anonimo.
window.EgittoAuth = (() => {
  let client = null;
  let session = null;
  let profile = null; // { nickname, balance }
  let pushTimer = 0;

  async function getClient() {
    if (client) return client;
    const rc = await fetch('api/config');
    if (!rc.ok) return null;
    const { supabaseUrl, supabaseKey } = await rc.json();
    if (!supabaseUrl || !supabaseKey) return null;
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) return null;
    client = window.supabase.createClient(supabaseUrl, supabaseKey);
    return client;
  }

  async function loadProfile(userId, anonBalance) {
    const { data, error } = await client
      .from('AAA2_profiles').select('nickname,balance').eq('user_id', userId).maybeSingle();
    if (error) return { ok: false };
    if (!data) {
      // Profilo mancante (es. utente creato prima del task): crealo col merge
      const balance = Math.max(1000, Number(anonBalance) || 0);
      const ins = await client.from('AAA2_profiles')
        .insert({ user_id: userId, nickname: 'Giocatore', balance }).select().maybeSingle();
      if (ins.error) return { ok: false };
      profile = { nickname: ins.data.nickname, balance: ins.data.balance };
      return { ok: true, created: true };
    }
    profile = { nickname: data.nickname, balance: Number(data.balance) || 0 };
    return { ok: true, created: false };
  }

  async function init(anonBalance) {
    try {
      const c = await getClient();
      if (!c) return { ok: false };
      const { data } = await c.auth.getSession();
      session = (data && data.session) || null;
      if (!session) return { ok: false, reason: 'no-session' };
      const r = await loadProfile(session.user.id, anonBalance);
      if (!r.ok) return { ok: false, reason: 'no-profile' };
      // Merge al max col saldo anonimo locale
      const best = Math.max(Number(anonBalance) || 0, profile.balance);
      if (best !== profile.balance) {
        profile.balance = best;
        await c.from('AAA2_profiles').update({ balance: best, updated_at: new Date().toISOString() }).eq('user_id', session.user.id);
      }
      return { ok: true, nickname: profile.nickname, balance: profile.balance };
    } catch (e) { return { ok: false, reason: 'offline' }; }
  }

  async function register(email, password, nickname, anonBalance) {
    const c = await getClient();
    if (!c) return { ok: false, error: 'Servizio non disponibile (offline?).' };
    const { data, error } = await c.auth.signUp({ email, password });
    if (error) return { ok: false, error: error.message };
    if (!data.session) {
      return { ok: false, needConfirm: true }; // conferma email richiesta
    }
    session = data.session;
    const clean = String(nickname || 'Giocatore').slice(0, 24) || 'Giocatore';
    const balance = Math.max(1000, Number(anonBalance) || 0); // bonus 1000 + merge
    const ins = await c.from('AAA2_profiles')
      .insert({ user_id: session.user.id, nickname: clean, balance });
    if (ins.error) return { ok: false, error: ins.error.message };
    profile = { nickname: clean, balance };
    return { ok: true, nickname: clean, balance };
  }

  async function login(email, password, anonBalance) {
    const c = await getClient();
    if (!c) return { ok: false, error: 'Servizio non disponibile (offline?).' };
    const { data, error } = await c.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    session = data.session;
    const r = await loadProfile(session.user.id, anonBalance);
    if (!r.ok) return { ok: false, error: 'Profilo non leggibile.' };
    const best = Math.max(Number(anonBalance) || 0, profile.balance);
    if (best !== profile.balance) {
      profile.balance = best;
      await c.from('AAA2_profiles').update({ balance: best, updated_at: new Date().toISOString() }).eq('user_id', session.user.id);
    }
    return { ok: true, nickname: profile.nickname, balance: profile.balance };
  }

  async function logout() {
    try { if (client) await client.auth.signOut(); } catch (e) {}
    session = null;
    profile = null;
  }

  function push(balance) {
    if (!client || !session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      try {
        await client.from('AAA2_profiles')
          .update({ balance, updated_at: new Date().toISOString() }).eq('user_id', session.user.id);
      } catch (e) {}
    }, 1500);
  }

  function isLogged() { return !!(session && profile); }
  function getNickname() { return profile ? profile.nickname : null; }

  return { init, register, login, logout, push, isLogged, getNickname };
})();
