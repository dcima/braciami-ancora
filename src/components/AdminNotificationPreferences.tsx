import React, { useState } from 'react';
import { ADMIN_EVENT_CATEGORIES, resolveAdminEventPreferences } from '../data/adminNotificationEvents';
import { UserData } from '../types';

type Preferences = NonNullable<UserData['adminNotificationPreferences']>;
export const AdminNotificationPreferences: React.FC<{
  saved?: Preferences;
  onSave: (preferences: Preferences) => Promise<void>;
}> = ({ saved, onSave }) => {
  const [events, setEvents] = useState(() => resolveAdminEventPreferences(saved?.events));
  const [baseline, setBaseline] = useState(() => resolveAdminEventPreferences(saved?.events));
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const dirty = Object.keys(events).some((id) => events[id] !== baseline[id]);
  const enabledCount = Object.values(events).filter(Boolean).length;
  const visible = ADMIN_EVENT_CATEGORIES.map((category) => ({ ...category, events: category.events.filter((event) => `${category.label} ${event.label}`.toLocaleLowerCase('it').includes(search.toLocaleLowerCase('it'))) })).filter((category) => category.events.length);
  const toggle = (id: string) => { setEvents((previous) => ({ ...previous, [id]: !previous[id] })); setMessage(''); };
  const save = async () => {
    setSaving(true); setMessage(''); setFailed(false);
    try {
      await onSave({ schemaVersion: 1, events, updatedAt: new Date().toISOString() });
      setBaseline({ ...events });
      setMessage('Preferenze salvate. I collegamenti agli eventi saranno configurati successivamente.');
    } catch {
      setFailed(true); setMessage('Salvataggio non riuscito. Le modifiche restano da salvare: riprova.');
    } finally { setSaving(false); }
  };
  return <section aria-labelledby="admin-instant-messages" className="space-y-3 rounded-xl border border-stone-500/25 p-3 sm:p-4">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div><h3 id="admin-instant-messages" className="font-bold">Messaggi istantanei</h3><p className="mt-1 text-xs opacity-70">{enabledCount} su {Object.keys(events).length} avvisi abilitati</p></div>
      <span className="rounded-lg bg-amber-500/15 px-2 py-1 text-[11px] font-semibold text-amber-600">Eventi da collegare</span>
    </div>
    <p className="text-xs leading-relaxed opacity-75">Scegli gli avvisi che desideri ricevere. On verde = Sì, Off rosso = No. Queste preferenze non attivano ancora invii automatici e non modificano controlli, registrazioni o obblighi del negozio.</p>
    <input type="search" aria-label="Cerca un avviso" placeholder="Cerca un evento o un’area…" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-10 w-full rounded-lg border border-stone-500/30 bg-transparent px-3 text-sm focus:outline-2 focus:outline-amber-500" />
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={saving} onClick={() => { setEvents(resolveAdminEventPreferences()); setMessage(''); }} className="min-h-9 rounded-lg border border-stone-500/25 px-3 text-xs disabled:opacity-50">Impostazioni consigliate</button>
      <button type="button" disabled={saving} onClick={() => { setEvents(Object.fromEntries(Object.keys(events).map((id) => [id, true]))); setMessage(''); }} className="min-h-9 rounded-lg border border-stone-500/25 px-3 text-xs disabled:opacity-50">Attiva tutti</button>
    </div>
    <div className="space-y-2">
      {visible.map((category) => <details key={category.id} open={search.trim() ? true : category.id === 'customers'} className="rounded-lg border border-stone-500/20">
        <summary className="cursor-pointer px-3 py-3 text-sm font-semibold">{category.label} <span className="text-[11px] font-normal opacity-60">({category.events.filter((event) => events[event.id]).length}/{category.events.length})</span></summary>
        <div className="divide-y divide-stone-500/15 px-3">
          {category.events.map((event) => <div key={event.id} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0"><p id={`event-${event.id}`} className="text-xs leading-relaxed">{event.label}</p>{event.severity === 'critical' && <span className="text-[10px] font-bold text-red-500">Critico</span>}</div>
            <button type="button" role="switch" aria-checked={events[event.id]} aria-labelledby={`event-${event.id}`} disabled={saving} onClick={() => toggle(event.id)} className={`inline-flex min-h-9 w-[76px] shrink-0 items-center rounded-full border-2 p-1 text-[10px] font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50 ${events[event.id] ? 'border-green-700 bg-green-700' : 'border-red-700 bg-red-700'}`}>
              <span aria-hidden="true" className={`flex w-full items-center justify-between ${events[event.id] ? 'flex-row-reverse' : ''}`}><span className="h-5 w-5 rounded-full bg-white shadow-sm" /><span className="px-1">{events[event.id] ? 'Sì · On' : 'Off · No'}</span></span>
            </button>
          </div>)}
        </div>
      </details>)}
      {!visible.length && <p className="py-3 text-xs opacity-70">Nessun evento corrispondente.</p>}
    </div>
    <div className="sticky bottom-0 rounded-lg border border-stone-500/25 bg-stone-900 p-3 text-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs">{dirty ? 'Modifiche da salvare' : saved ? 'Preferenze configurate' : 'Configurazione consigliata da salvare'}</span><button type="button" disabled={saving || (!dirty && Boolean(saved))} onClick={save} className="min-h-10 rounded-lg bg-amber-500 px-3 text-xs font-bold text-stone-950 disabled:opacity-50">{saving ? 'Salvataggio…' : 'Salva preferenze'}</button></div>
      {message && <p role={failed ? 'alert' : 'status'} className={`mt-2 text-xs ${failed ? 'text-red-300' : 'text-green-300'}`}>{message}</p>}
    </div>
  </section>;
};
