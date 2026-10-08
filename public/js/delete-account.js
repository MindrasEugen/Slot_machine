// Pagina pubblica di eliminazione account (requisito Google Play: link web).
// Accesso con email+password, poi la stessa funzione SQL usata in app.
(() => {
  const form = document.getElementById('del-form');
  const msg = document.getElementById('del-msg');
  const btn = document.getElementById('del-submit');
  const say = (t) => { msg.textContent = t || ''; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('del-email').value.trim();
    const pass = document.getElementById('del-pass').value;
    if (!email || !pass) { say('Inserisci email e password.'); return; }
    if (!document.getElementById('del-confirm').checked) {
      say("Conferma di aver capito che l'eliminazione è definitiva.");
      return;
    }
    btn.disabled = true;
    say('Verifica in corso…');
    try {
      const client = window.EgittoSupabase && await window.EgittoSupabase.getClient();
      if (!client) { say('Servizio non disponibile, riprova più tardi.'); return; }
      const { error: loginError } = await client.auth.signInWithPassword({ email, password: pass });
      if (loginError) { say('Email o password non corrette.'); return; }
      const { data, error } = await client.rpc('aaa2_delete_my_account');
      try { await client.auth.signOut({ scope: 'local' }); } catch (err) {}
      if (error) { say('Eliminazione non riuscita, riprova.'); return; }
      form.reset();
      say(data === 'no_slot_profile'
        ? 'Nessun account di gioco associato a questa email: non ci sono dati da eliminare.'
        : 'Account eliminato. I tuoi dati di gioco sono stati cancellati.');
    } catch (err) {
      say('Errore di rete, riprova.');
    } finally {
      btn.disabled = false;
    }
  });
})();
