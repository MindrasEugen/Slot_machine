// Task 21 — Sync saldi anonimi con Supabase (tabella AAA2_balances sul
// progetto cinema-vicino-app). Strategia: client_id UUID in localStorage,
// reconcile al max tra locale e remoto (non si perdono mai crediti),
// push in upsert con debounce. Senza rete/config resta tutto locale.
window.EgittoCloud = (() => {
  const CLIENT_KEY = 'egitto_client_id';
  let client = null;
  let pushTimer = 0;

  function getClientId() {
    try {
      let id = localStorage.getItem(CLIENT_KEY);
      if (!id) {
        id = (crypto.randomUUID && crypto.randomUUID()) ||
          `c-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
        localStorage.setItem(CLIENT_KEY, id);
      }
      return id;
    } catch (e) { return null; }
  }

  async function init(localBalance) {
    try {
      const rc = await fetch('api/config');
      if (!rc.ok) return { ok: false, reason: 'no-config' };
      const { supabaseUrl, supabaseKey } = await rc.json();
      if (!supabaseUrl || !supabaseKey) return { ok: false, reason: 'no-config' };
      if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        return { ok: false, reason: 'no-lib' };
      }
      const id = getClientId();
      if (!id) return { ok: false, reason: 'no-id' };
      client = window.supabase.createClient(supabaseUrl, supabaseKey);

      const { data, error } = await client
        .from('AAA2_balances').select('balance').eq('client_id', id).maybeSingle();
      if (error) return { ok: false, reason: 'read-fail' };
      if (!data) {
        await client.from('AAA2_balances').insert({ client_id: id, balance: localBalance });
        return { ok: true, balance: localBalance, fresh: true };
      }
      const remote = Number(data.balance) || 0;
      const best = Math.max(Number(localBalance) || 0, remote);
      if (best !== remote) {
        await client.from('AAA2_balances')
          .upsert({ client_id: id, balance: best, updated_at: new Date().toISOString() });
      }
      return { ok: true, balance: best, fresh: false };
    } catch (e) {
      return { ok: false, reason: 'offline' };
    }
  }

  function push(balance) {
    if (!client) return;
    const id = getClientId();
    if (!id) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      try {
        await client.from('AAA2_balances')
          .upsert({ client_id: id, balance, updated_at: new Date().toISOString() });
      } catch (e) {}
    }, 1500);
  }

  return { init, push };
})();
