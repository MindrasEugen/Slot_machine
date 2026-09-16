// Task 20 — Audio reale con Howler.js (file in assets/sounds/, sintetizzati
// proceduralmente: nessuna dipendenza esterna né problemi di licenza).
// API: spin(), reelStop(), win(big), click(), toggleMute(), isMuted().
window.EgittoAudio = (() => {
  const MUTE_KEY = 'egitto_muted';
  let muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}

  const sounds = {};
  function load() {
    if (typeof Howler === 'undefined' || typeof Howl === 'undefined') return false;
    const mk = (name, volume) => new Howl({ src: [`assets/sounds/${name}.wav`], volume, preload: true });
    sounds.spin = mk('spin', 0.7);
    sounds.stop = mk('stop', 0.8);
    sounds.win = mk('win', 0.8);
    sounds.bigwin = mk('bigwin', 0.9);
    sounds.click = mk('click', 0.5);
    Howler.mute(muted);
    return true;
  }

  let ready = load();
  function play(name) {
    if (!ready) ready = load();
    if (!ready || muted) return;
    try {
      const s = sounds[name];
      if (s) s.play();
    } catch (e) {}
  }

  function toggleMute() {
    muted = !muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
      if (ready && typeof Howler !== 'undefined') Howler.mute(muted);
    } catch (e) {}
    return muted;
  }

  return {
    spin() { play('spin'); },
    reelStop() { play('stop'); },
    win(big) { play(big ? 'bigwin' : 'win'); },
    click() { play('click'); },
    toggleMute,
    get muted() { return muted; }
  };
})();
