export type AdminEventSeverity = 'info' | 'warning' | 'critical';
export interface AdminEventDefinition {
  id: string;
  label: string;
  severity: AdminEventSeverity;
  defaultEnabled: boolean;
}
export interface AdminEventCategory {
  id: string;
  label: string;
  events: AdminEventDefinition[];
}

// Stable event IDs are the contract for future trusted Firestore/backend producers.
export const ADMIN_EVENT_CATEGORIES: AdminEventCategory[] = [
  {
    "id": "customers",
    "label": "Clienti, account e privacy",
    "events": [
      {
        "id": "user_registered",
        "label": "Un utente si registra con l’email",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "user_deleted",
        "label": "Un utente cancella la sua registrazione",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "data_export_requested",
        "label": "Un utente richiede il download dei suoi dati",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "data_erasure_requested",
        "label": "Richiesta di cancellazione dei dati personali",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "data_rectification_requested",
        "label": "Richiesta di rettifica o limitazione dei dati",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "privacy_request_due",
        "label": "Richiesta privacy prossima alla scadenza",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "consent_changed",
        "label": "Consensi marketing o profilazione modificati",
        "severity": "info",
        "defaultEnabled": false
      },
      {
        "id": "contact_changed",
        "label": "Email, recapiti o indirizzo di consegna modificati",
        "severity": "info",
        "defaultEnabled": false
      },
      {
        "id": "account_blocked",
        "label": "Account bloccato o sospetto abuso",
        "severity": "warning",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "sales",
    "label": "Carrelli, ordini e assistenza",
    "events": [
      {
        "id": "cart_product_added",
        "label": "Un utente inserisce un prodotto nel carrello",
        "severity": "info",
        "defaultEnabled": false
      },
      {
        "id": "cart_abandoned",
        "label": "Carrello abbandonato",
        "severity": "info",
        "defaultEnabled": false
      },
      {
        "id": "order_received",
        "label": "Nuovo ordine ricevuto",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "order_changed",
        "label": "Ordine modificato dal cliente",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "order_cancelled",
        "label": "Ordine annullato",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "order_overdue",
        "label": "Ordine non preso in carico entro il tempo previsto",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "order_stock_conflict",
        "label": "Ordine con prodotti non disponibili o quantità incoerenti",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "order_margin_low",
        "label": "Prezzo, sconto o margine sotto la soglia configurata",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "customer_message",
        "label": "Nuovo messaggio o richiesta di assistenza",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "complaint_received",
        "label": "Reclamo, contestazione o recensione negativa",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "return_requested",
        "label": "Richiesta di reso, recesso o rimborso da valutare",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "refund_overdue",
        "label": "Rimborso o risposta al cliente in ritardo",
        "severity": "critical",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "payments",
    "label": "Pagamenti, banche e liquidità",
    "events": [
      {
        "id": "payment_confirmed",
        "label": "Un utente conferma il pagamento",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "payment_failed",
        "label": "Pagamento fallito, scaduto o rifiutato",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "payment_mismatch",
        "label": "Importo, valuta o transazione non riconciliati",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "payment_duplicate",
        "label": "Possibile doppio addebito",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "fraud_suspected",
        "label": "Segnalazione di frode o pagamento sospetto",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "chargeback_opened",
        "label": "Chargeback o disputa aperta dalla banca",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "refund_completed",
        "label": "Rimborso eseguito",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "refund_failed",
        "label": "Rimborso fallito",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "bank_payout_delayed",
        "label": "Accredito del gestore pagamenti in ritardo",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "bank_reconciliation_failed",
        "label": "Movimento bancario non riconciliato",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "cash_variance",
        "label": "Differenza nella chiusura di cassa fisica o online",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "liquidity_low",
        "label": "Liquidità sotto la soglia configurata",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "bank_details_changed",
        "label": "IBAN o coordinate di accredito modificati",
        "severity": "critical",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "newsletter",
    "label": "Newsletter e comunicazioni",
    "events": [
      {
        "id": "newsletter_subscribed",
        "label": "Un utente si iscrive alla Newsletter",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "newsletter_unsubscribed",
        "label": "Un utente si disiscrive dalla Newsletter",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "message_delivery_failed",
        "label": "Email, SMS o notifica non consegnati",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "marketing_consent_missing",
        "label": "Campagna o invio con consenso mancante",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "spam_complaint",
        "label": "Segnalazione spam o reputazione del mittente compromessa",
        "severity": "warning",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "inventory",
    "label": "Magazzino, produzione e negozio fisico",
    "events": [
      {
        "id": "stock_low",
        "label": "Scorta sotto il livello di riordino",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "stock_out",
        "label": "Prodotto esaurito",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "stock_discrepancy",
        "label": "Giacenza negativa o differenza inventariale",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "stock_sync_failed",
        "label": "Disallineamento tra cassa, negozio online e magazzino",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "batch_expiring",
        "label": "Lotto vicino alla scadenza",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "batch_expired",
        "label": "Lotto scaduto ancora disponibile alla vendita",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "production_delayed",
        "label": "Preparazione o produzione in ritardo",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "waste_abnormal",
        "label": "Scarti o deperimenti oltre soglia",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "equipment_failure",
        "label": "Guasto a frigorifero, cella o attrezzatura essenziale",
        "severity": "critical",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "food_safety",
    "label": "Sicurezza alimentare, lotti e allergeni",
    "events": [
      {
        "id": "cold_chain_broken",
        "label": "Temperatura fuori soglia o catena del freddo interrotta",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "food_recall",
        "label": "Richiamo, ritiro o allerta su prodotto o lotto",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "allergen_mismatch",
        "label": "Allergeni mancanti o incoerenti",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "traceability_missing",
        "label": "Tracciabilità, origine o documento del lotto mancanti",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "food_safety_complaint",
        "label": "Segnalazione sanitaria o sospetta contaminazione",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "haccp_check_due",
        "label": "Controllo HACCP o registrazione obbligatoria in scadenza",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "label_noncompliant",
        "label": "Etichetta o informazioni alimentari da verificare",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "food_certificate_expiring",
        "label": "Certificato sanitario o autorizzazione in scadenza",
        "severity": "warning",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "suppliers",
    "label": "Fornitori e acquisti",
    "events": [
      {
        "id": "supplier_created",
        "label": "Nuovo fornitore o cambio di stato",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "supplier_order_confirmed",
        "label": "Ordine di acquisto confermato dal fornitore",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "supplier_delivery_delayed",
        "label": "Fornitura in ritardo o non confermata",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "supplier_delivery_mismatch",
        "label": "Quantità, qualità, lotto o prezzo di fornitura difformi",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "supplier_price_changed",
        "label": "Aumento del listino o peggioramento del margine",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "supplier_invoice_mismatch",
        "label": "Fattura fornitore non coerente con ordine o consegna",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "supplier_payment_due",
        "label": "Pagamento fornitore prossimo alla scadenza",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "supplier_documents_missing",
        "label": "Documentazione o qualifica fornitore mancante",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "supplier_bank_changed",
        "label": "Coordinate bancarie del fornitore modificate",
        "severity": "critical",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "shipping",
    "label": "Corrieri, consegne e resi",
    "events": [
      {
        "id": "shipment_handed_over",
        "label": "Spedizione affidata al corriere",
        "severity": "info",
        "defaultEnabled": false
      },
      {
        "id": "shipment_delayed",
        "label": "Ritiro saltato o consegna in ritardo",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "shipment_exception",
        "label": "Spedizione bloccata, persa, danneggiata o rifiutata",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "shipment_address_invalid",
        "label": "Indirizzo o recapiti insufficienti alla consegna",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "shipment_delivered",
        "label": "Consegna completata",
        "severity": "info",
        "defaultEnabled": false
      },
      {
        "id": "delivery_proof_missing",
        "label": "Prova di consegna mancante o contestata",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "return_received",
        "label": "Reso rientrato da controllare",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "carrier_invoice_mismatch",
        "label": "Addebiti del corriere o supplementi inattesi",
        "severity": "warning",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "international",
    "label": "Vendite internazionali e dogana",
    "events": [
      {
        "id": "destination_restricted",
        "label": "Prodotto non ammesso o Paese di destinazione non servito",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "customs_documents_missing",
        "label": "Documenti doganali, origine o codice HS/TARIC mancanti",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "customs_hold",
        "label": "Fermo doganale o richiesta di documenti",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "export_health_certificate_missing",
        "label": "Certificato sanitario o permesso di esportazione mancante",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "import_duties_disputed",
        "label": "Dazi, imposte di importazione o condizioni DDP/DAP contestati",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "fx_margin_changed",
        "label": "Cambio valuta o commissioni oltre la soglia di margine",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "international_return_blocked",
        "label": "Reso internazionale bloccato o non reimportabile",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "destination_rules_changed",
        "label": "Requisiti fiscali, sanitari o commerciali del Paese da riesaminare",
        "severity": "warning",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "accounting",
    "label": "Contabilità, fisco e commercialista",
    "events": [
      {
        "id": "invoice_issue_failed",
        "label": "Emissione di fattura o documento commerciale fallita",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "invoice_rejected",
        "label": "Fattura scartata, rifiutata o non consegnata da verificare",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "credit_note_pending",
        "label": "Nota di credito da emettere o riconciliare",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "daily_receipts_failed",
        "label": "Chiusura o trasmissione dei corrispettivi fallita",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "vat_data_inconsistent",
        "label": "Aliquota IVA, esenzione o dati fiscali incoerenti",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "vat_oss_due",
        "label": "Rendicontazione IVA/OSS/IOSS da verificare o in scadenza",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "tax_deadline_due",
        "label": "Adempimento, tributo o pagamento fiscale in scadenza",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "accountant_message",
        "label": "Richiesta o documento dal commercialista",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "accounting_export_failed",
        "label": "Esportazione contabile o riconciliazione fallita",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "document_retention_failed",
        "label": "Conservazione o archiviazione documentale non riuscita",
        "severity": "critical",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "legal",
    "label": "Aspetti giuridici e amministrativi",
    "events": [
      {
        "id": "legal_notice_received",
        "label": "PEC, diffida, reclamo formale o comunicazione da autorità",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "legal_deadline_due",
        "label": "Termine di risposta o scadenza legale imminente",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "insurance_expiring",
        "label": "Assicurazione, licenza o contratto in scadenza",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "terms_changed",
        "label": "Condizioni di vendita o informative aggiornate",
        "severity": "info",
        "defaultEnabled": true
      },
      {
        "id": "consumer_dispute",
        "label": "Controversia consumatore o richiesta di conciliazione",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "accessibility_report",
        "label": "Segnalazione di accessibilità o acquisto non fruibile",
        "severity": "warning",
        "defaultEnabled": true
      }
    ]
  },
  {
    "id": "security",
    "label": "Sicurezza, accessi e continuità del servizio",
    "events": [
      {
        "id": "admin_signin",
        "label": "Nuovo accesso amministratore",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "admin_role_changed",
        "label": "Ruoli o autorizzazioni amministrative modificati",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "suspicious_signin",
        "label": "Accesso sospetto o tentativi ripetuti falliti",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "personal_data_incident",
        "label": "Possibile violazione di dati personali",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "service_unavailable",
        "label": "Negozio, checkout o servizio essenziale non disponibile",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "integration_failed",
        "label": "Integrazione, webhook o evento non elaborato",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "backup_failed",
        "label": "Backup, ripristino o controllo di integrità fallito",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "notification_delivery_failed",
        "label": "Allarme non consegnato al responsabile",
        "severity": "critical",
        "defaultEnabled": true
      },
      {
        "id": "cost_threshold_exceeded",
        "label": "Costi cloud, invii o servizi oltre il budget",
        "severity": "warning",
        "defaultEnabled": true
      },
      {
        "id": "credentials_expiring",
        "label": "Certificato, dominio o credenziale di integrazione in scadenza",
        "severity": "warning",
        "defaultEnabled": true
      }
    ]
  }
];

export function resolveAdminEventPreferences(saved: Record<string, boolean> = {}): Record<string, boolean> {
  return Object.fromEntries(ADMIN_EVENT_CATEGORIES.flatMap((category) => category.events.map((event) => [event.id, typeof saved[event.id] === 'boolean' ? saved[event.id] : event.defaultEnabled])));
}
