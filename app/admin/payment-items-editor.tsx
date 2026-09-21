"use client";

import type { RentalBenefit } from "../lib/cms-store";

export function PaymentItemsEditor<T extends RentalBenefit>({ title, items, onChange, newItem, onRestore }: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: T;
  onRestore: () => void;
}) {
  const priced = "price" in newItem;
  const update = (index: number, changes: Partial<T>) => onChange(items.map((item, i) => i === index ? { ...item, ...changes } : item));
  return <fieldset className="admin-payment-items">
    <legend>{title}</legend>
    <p>✓ Inclus · × Neinclus. Pe site, bifele apar primele. {priced ? "Doar serviciile bifate se adaugă la chiria lunară. Prețurile nu apar în lista publică." : "Această listă nu modifică prețul."}</p>
    {items.length === 0 && <p>Lista este goală. Adaugă primul element; secțiunea apare pe site după salvare.</p>}
    <div className="admin-payment-items-list">
      {items.map((item, index) => <div className="admin-payment-item" key={index}>
        <label className="admin-payment-item-name">Denumire
          <input aria-label={`${title}: denumire ${index + 1}`} value={item.name} maxLength={200} required placeholder="Scrie denumirea afișată clientului" onChange={(event) => update(index, { name: event.target.value } as Partial<T>)} />
        </label>
        {priced && "price" in item && <label>Preț (€ / lună)
          <input aria-label={`${title}: preț ${index + 1}`} type="number" min="0" max="100000" step="0.01" required value={Number.isNaN(item.price) ? "" : Number(item.price)} onChange={(event) => update(index, { price: event.target.value === "" ? Number.NaN : Number(event.target.value) } as unknown as Partial<T>)} />
        </label>}
        <label className={`admin-payment-item-status ${item.included ? "is-included" : "is-excluded"}`}>
          <input type="checkbox" aria-label={`${title}: inclus ${index + 1}`} checked={item.included} onChange={(event) => update(index, { included: event.target.checked } as Partial<T>)} />
          {item.included ? "✓ Inclus" : "× Neinclus"}
        </label>
        <button type="button" className="admin-secondary admin-danger" aria-label={`${title}: șterge ${index + 1}`} onClick={() => onChange(items.filter((_, i) => i !== index))}>Șterge</button>
      </div>)}
    </div>
    <div className="admin-payment-items-actions">
      <button type="button" className="admin-secondary" onClick={() => onChange([...items, { ...newItem }])}>+ Adaugă {title.toLowerCase().startsWith("servicii") ? "serviciu" : "beneficiu"}</button>
      <button type="button" className="admin-secondary" onClick={onRestore}>Restabilește lista salvată</button>
    </div>
  </fieldset>;
}
