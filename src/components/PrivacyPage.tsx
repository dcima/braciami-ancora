import React from 'react';
import { STORE_INFO } from '../data/mockData';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 bg-stone-50 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            Trasparenza & Sicurezza Alimentare
          </span>
          <h1 className="font-display text-4xl font-bold text-stone-950 tracking-tight">
            Informativa sulla Privacy & Termini di Vendita
          </h1>
          <p className="text-xs text-stone-500">
            Conforme al Regolamento UE 2016/679 (GDPR) e al Codice del Consumo
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 space-y-8 text-xs text-stone-700 leading-relaxed shadow-xs">
          
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>1. Titolare del Trattamento dei Dati</span>
            </h2>
            <p>
              Il titolare del trattamento dei dati è la bottega alimentare <strong>&ldquo;{STORE_INFO.name}&rdquo;</strong> di Manuel e Samanta, con sede a Cento (FE) in {STORE_INFO.address}. Recapito email per la protezione dei dati: <a href={`mailto:${STORE_INFO.email}`} className="text-amber-800 underline font-medium">{STORE_INFO.email}</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>2. Finalità della Raccolta Dati & Verifica Rapida OTP</span>
            </h2>
            <p>
              I dati personali forniti (nome, recapito telefonico, indirizzo email ed eventuale indirizzo di consegna per Cento e frazioni) sono raccolti esclusivamente per:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>L elaborazione, preparazione alla brace ed evasione degli ordini alimentari;</li>
              <li>La verifica rapida tramite codice monouso (SMS OTP o Email OTP) senza obbligo di creazione di password o account permanente;</li>
              <li>L attribuzione dei punti fedeltà del Club del Braciere;</li>
              <li>L invio di comunicazioni sullo stato dell ordine (es. carne pronta per il ritiro saltafila).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>3. Prodotti Alimentari & Diritto di Recesso</span>
            </h2>
            <p>
              Ai sensi dell art. 59, comma 1, lett. d) ed e) del D.Lgs. 206/2005 (Codice del Consumo), il diritto di recesso è escluso per la fornitura di beni che rischiano di deteriorarsi o scadere rapidamente (carni fresche selezionate, preparati cotti su brace espressa e gastronomia deperibile). In caso di qualsiasi anomalia o difformità qualitativa, Manuel e Samanta garantiscono la sostituzione immediata o il rimborso in bottega previa segnalazione entro 2 ore dalla consegna o ritiro.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>4. Cookie Policy & Conservazione dei Dati</span>
            </h2>
            <p>
              Questo sito web utilizza unicamente cookie e storage locale tecnico necessario al funzionamento del carrello della spesa, alla gestione della sessione di checkout e al salvataggio temporaneo del codice OTP. Non viene effettuata profilazione invasiva verso terze parti né cessione di database a soggetti esterni.
            </p>
          </section>

          <div className="pt-4 border-t border-stone-100 text-stone-500 text-[11px]">
            Ultimo aggiornamento documento: Ottobre 2026 · Bottega &ldquo;Braciami ancora&rdquo;, Cento (Ferrara).
          </div>

        </div>

      </div>
    </div>
  );
};
