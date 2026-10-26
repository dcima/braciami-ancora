# Messaggi istantanei amministratore

## Implementato

Il profilo amministratore consente di cambiare la foto e configurare gli avvisi prima della dashboard. Il catalogo degli eventi è in `src/data/adminNotificationEvents.ts`; gli ID sono stabili e indipendenti dalle etichette italiane.

Le preferenze sono personali, in `users/{uid}.adminNotificationPreferences`:

```json
{
  "schemaVersion": 1,
  "updatedAt": "ISO-8601 UTC",
  "events": { "user_registered": true, "cart_product_added": false }
}
```

Il salvataggio è esplicito. Solo una scrittura Firestore riuscita aggiorna il profilo locale e mostra il successo. I nuovi eventi adottano il valore consigliato; un Off già salvato viene rispettato. Le preferenze non costituiscono un'autorizzazione a leggere dati, né disabilitano controlli, conservazione o adempimenti.

La foto usa la validazione JPEG/WEBP fino a 1 MB, sanitizzazione e Storage già presenti. Il profilo admin non considera riuscito un upload se il servizio ha restituito soltanto il fallback locale. Il nuovo URL viene salvato nel profilo e utilizzato anche nell'avatar del menu.

## Analisi operativa

- **Clienti e privacy:** registrazione, cancellazione, esportazione, rettifica, limitazione, consensi, scadenze e blocchi. La cancellazione dell'account e la richiesta di cancellazione dei dati sono eventi distinti: conservazione fiscale e gestione dei diritti richiedono decisioni specifiche.
- **Vendite e assistenza:** carrelli, ordini nuovi o modificati, presa in carico in ritardo, indisponibilità, margini e sconti, reclami, resi e rimborsi. Le eccezioni ai diritti di recesso vanno valutate per prodotto e giurisdizione; un flag non decide l'ammissibilità di un reso.
- **Pagamenti e banche:** conferme, rifiuti, anomalie di importo o valuta, doppio addebito, frode, chargeback, accrediti, riconciliazione, chiusure cassa e liquidità. Una conferma del browser non prova l'avvenuto pagamento: servirà un webhook verificato del gestore.
- **Newsletter:** iscrizione, disiscrizione, mancata consegna, consenso mancante e segnalazioni spam. Le disiscrizioni devono essere eseguite anche quando l'avviso all'admin è Off.
- **Magazzino e produzione:** scorte, esaurimenti, inventario, sincronizzazione POS/ecommerce, scadenza lotti, preparazioni, sprechi e guasti.
- **Sicurezza alimentare:** temperature, richiami e ritiri, allergeni, tracciabilità, contaminazioni, controlli HACCP, etichette e certificazioni. Le allerte pubbliche non sostituiscono le verifiche sui propri lotti.
- **Fornitori:** anagrafica e stato, acquisti, ritardi, difformità, prezzi, documenti, fatture, scadenze e cambi di IBAN. Cambi bancari da verificare con un canale indipendente.
- **Corrieri:** affidamento, ritiri saltati, ritardi, danni, smarrimenti, indirizzi errati, prova di consegna, resi e supplementi.
- **Estero:** disponibilità per Paese e prodotto, restrizioni sanitarie, dogana, origine, HS/TARIC, certificati, permessi, DDP/DAP, dazi, cambio e resi internazionali. Vendere world-wide non significa che ogni alimento sia esportabile ovunque: l'abilitazione richiede una matrice prodotto/Paese aggiornata con consulenti e corrieri.
- **Fisco e commercialista:** fatture, scarti, note di credito, corrispettivi, IVA, OSS/IOSS ove applicabili, scadenze, documenti e conservazione. Separare il fatturato documentato dagli incassi e dagli ordini non pagati.
- **Giuridico:** PEC, diffide, autorità, scadenze, assicurazioni, licenze, contratti, condizioni, controversie e accessibilità.
- **Sicurezza e continuità:** accessi e ruoli, incidenti sui dati, indisponibilità, webhook, backup, mancato recapito degli allarmi, budget e credenziali in scadenza.

## Collegamenti futuri: progetto, non ancora attivato

1. Produttori autorevoli lato server: transazioni Firestore, webhook verificati di pagamenti/corrieri/POS, sonde temperatura, gestionali fiscali, PEC e comunicazioni del commercialista. Non accettare eventi amministrativi affidabili dal solo browser.
2. Eventi persistenti in `admin_events/{eventId}`, creati dal backend. Busta proposta: `eventId`, `type`, `schemaVersion`, `occurredAt`, `receivedAt`, `source`, `entityType`, `entityId`, `severity`, `countryCode`, `correlationId`, `deduplicationKey`, `status`, `assignedTo`, `dueAt`, `acknowledgedAt`, `resolvedAt`. Importi in unità minori con codice valuta; nessuna credenziale, OTP o dato di carta nei payload.
3. Matching per amministratore sulle preferenze, con coda di consegna per canale. Definire in seguito destinatari e canali (pannello, push, email, eventuale SMS); qui non si inviano messaggi a terzi.
4. Idempotenza e deduplicazione dei webhook, retry con backoff, dead-letter queue e allarme sui mancati invii. Non duplicare un pagamento né un movimento di magazzino durante un retry.
5. Responsabile e sostituto per area, presa in carico esplicita, cronologia delle azioni e collegamento al record interessato. Separare letto, preso in carico, risolto e falso positivo.
6. Soglie e tempi configurabili per area, fuso Europe/Rome per la bottega e timestamp UTC. Le scadenze normative non possono essere sostituite da un unico SLA commerciale. Calendario e regole devono considerare Paese, contratto, prodotto e consulenza professionale.
7. Rumore e costi: eventi frequenti aggregati, riepiloghi per gli informativi, limiti di invio, soglie di spesa, evitare listener per ogni singola riga, query indicizzate e retention per categoria. Gli eventi critici richiedono una politica di escalation e una decisione esplicita sui destinatari obbligatori: non è implementato alcun bypass nascosto dei flag Off.
8. Sicurezza: regole Firestore per sola lettura delle preferenze del titolare e accesso ai soli amministratori autorizzati per gli eventi; modifica ruoli solo dal backend; firma dei webhook, minimizzazione dei dati, audit, conservazione motivata e test con emulatori prima dell'attivazione. Rivedere le attuali regole e l'autenticazione effettiva prima del rilascio delle integrazioni.

## Riferimenti per la fase di configurazione

- Commissione europea, diritti privacy e incidenti: https://europa.eu/youreurope/business/governance-and-sustainability/digital-and-data-compliance/data-protection-gdpr/index_en.htm . Le richieste hanno normalmente un termine di un mese, con condizioni di proroga; la notifica di una violazione all'autorità entro 72 ore dipende dal rischio. Serve una valutazione dell'incidente.
- Commissione europea, tracciabilità alimentare: https://food.ec.europa.eu/food-safety/campaign-2026/traceability_en . Collegare lotti, fornitori e destinatari per consentire ritiri mirati.
- Commissione europea, RASFF: https://food.ec.europa.eu/food-safety/rasff_en . L'accesso operativo è riservato alle autorità; le informazioni pubbliche possono supportare il controllo degli avvisi.
- Your Europe, OSS: https://europa.eu/youreurope/business/finance-and-tax/vat/one-stop-shop/index_en.htm . Schemi e applicabilità dipendono dalle operazioni; non configurare automaticamente IVA o IOSS per ogni vendita internazionale.

Questo catalogo è un piano di monitoraggio operativo, non una certificazione di conformità globale. Le regole applicabili e le integrazioni effettive devono essere validate per mercati e categorie vendute.
