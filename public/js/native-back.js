// Tasto "indietro" di Android nell'app nativa (Capacitor + @capacitor/app).
// Senza questo gestore il tasto chiude l'app anche da Paytable/Monete/Privacy.
// Ordine: chiudi un overlay aperto → torna alla pagina precedente → esci.
// Sul web non fa nulla.
(() => {
  const cap = window.Capacitor;
  if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return;
  const App = cap.Plugins && cap.Plugins.App;
  if (!App) return;

  // Overlay chiudibili con "indietro" (la verifica età e il bonus no: vanno completati)
  const CLOSABLE = ['account-overlay'];

  App.addListener('backButton', ({ canGoBack }) => {
    for (const id of CLOSABLE) {
      const el = document.getElementById(id);
      if (el && !el.classList.contains('hidden')) {
        el.classList.add('hidden');
        return;
      }
    }
    if (canGoBack) window.history.back();
    else App.exitApp();
  });
})();
