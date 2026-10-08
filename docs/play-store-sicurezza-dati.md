# Google Play — risposte per "Sicurezza dei dati" e dichiarazioni

Riferimento per compilare la Play Console. Va tenuto allineato con `public/privacy.html`:
se l'app inizia a raccogliere nuovi dati (analytics, pubblicità, pagamenti), aggiornare entrambi.

## URL da inserire

| Campo Play Console | URL |
|---|---|
| Privacy Policy | https://slot-machine-g6qm.onrender.com/privacy.html |
| Link web per eliminare l'account | https://slot-machine-g6qm.onrender.com/delete-account.html |

Le pagine devono essere online (deploy su Render) prima dell'invio in revisione.

## Sicurezza dei dati — Panoramica

| Domanda | Risposta |
|---|---|
| L'app raccoglie o condivide uno dei tipi di dati utente richiesti? | **Sì** |
| Tutti i dati raccolti sono criptati in transito? | **Sì** (HTTPS/TLS verso Supabase) |
| Fornisci un modo per richiedere l'eliminazione dei dati? | **Sì** — in app (Account → Elimina account) e via link web |
| Dati condivisi con terze parti? | **No** (Supabase è un fornitore che tratta i dati per nostro conto: per Google non è "condivisione") |

## Tipi di dati raccolti

| Categoria → Tipo | Raccolto | Condiviso | Obbligatorio? | Finalità |
|---|---|---|---|---|
| Informazioni personali → **Indirizzo email** | Sì | No | Facoltativo (solo con account) | Funzionalità app, Gestione account |
| Informazioni personali → **ID utente** (ID account Supabase, nickname) | Sì | No | Facoltativo (solo con account) | Funzionalità app, Gestione account |
| Attività nelle app → **Altre azioni** (saldo monete virtuali) | Sì | No | Obbligatorio | Funzionalità app |
| ID dispositivo o altri ID → **ID dispositivo o altri ID** (identificativo casuale generato dall'app, usato per salvare il saldo senza account) | Sì | No | Obbligatorio | Funzionalità app |

Per ciascun tipo: dati **non** elaborati in modo temporaneo (vengono salvati), **non** usati per pubblicità, analisi o personalizzazione.

Da **non** dichiarare (non raccolti): posizione, contatti, foto/video, audio, file, calendario, informazioni finanziarie, salute, messaggi, cronologia web, diagnostica/crash (nessun SDK di crash report), installazioni di app.

La password non è un "tipo di dati" della lista Google: è gestita da Supabase Auth in forma cifrata.

## Altre dichiarazioni in Play Console (contenuti dell'app)

| Sezione | Risposta |
|---|---|
| Classificazione dei contenuti (IARC) | Indicare **gioco d'azzardo simulato** → risultato atteso 18+ / PEGI 18 |
| Pubblico di destinazione | **Solo 18+** (nessuna fascia d'età minorile) |
| Annunci | L'app **non** contiene annunci |
| App di giochi con soldi veri | **No** — si vincono solo monete virtuali senza valore in denaro, non riscattabili né convertibili. Resta "No" anche dopo l'attivazione degli acquisti di monete (è gioco d'azzardo *simulato*) |
| Accesso all'app | Il gioco è utilizzabile **senza** account; l'account è facoltativo. Se richiesto, fornire a Google un account di prova |

## Cosa cambia se si aggiungono gli acquisti in-app

- Google Play Billing (obbligatorio per i beni digitali) → dichiarare **Cronologia acquisti** (Informazioni finanziarie).
- Play Console → contenuti dell'app: dichiarare la presenza di **acquisti in-app** (compare nella scheda dello store).
- Privacy policy: aggiungere gli acquisti tra i dati trattati e Google Play tra i fornitori (i dati della carta li gestisce Google, non l'app).
- Shop: ripristinare le card dei pacchetti dallo storico git (commit `b85da91` le ha rimosse).

I testi in app sono già scritti in modo compatibile con gli acquisti: dicono che le monete **non hanno valore in denaro e non sono riscattabili/convertibili**, non che non si possano comprare.
