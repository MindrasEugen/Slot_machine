// Connessione Supabase unica, condivisa da auth.js, supabase-sync.js e dalle
// pagine pubbliche (es. eliminazione account). Un solo client = un solo
// GoTrueClient: niente sessioni concorrenti sulla stessa chiave di storage.
window.EgittoSupabase = (() => {
  let pending = null;

  async function create() {
    // App nativa: config incorporata (public-config.js); web: endpoint Express
    let conf = window.EgittoPublicConfig;
    if (!conf) {
      const rc = await fetch('api/config');
      if (!rc.ok) return null;
      conf = await rc.json();
    }
    const { supabaseUrl, supabaseKey } = conf || {};
    if (!supabaseUrl || !supabaseKey) return null;
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) return null;
    return window.supabase.createClient(supabaseUrl, supabaseKey);
  }

  // Ritorna sempre lo stesso client (null se offline / config mancante).
  // In caso di errore la promessa si azzera, così un nuovo tentativo è possibile.
  function getClient() {
    if (!pending) {
      pending = create().then((c) => {
        if (!c) pending = null;
        return c;
      }).catch(() => {
        pending = null;
        return null;
      });
    }
    return pending;
  }

  return { getClient };
})();
