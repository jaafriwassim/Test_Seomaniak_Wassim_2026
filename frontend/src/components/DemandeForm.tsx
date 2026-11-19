import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { NouvelleDemande } from '../types/demande';

interface DemandeFormProps {
  onSubmit: (demande: NouvelleDemande) => Promise<void>;
}

export default function DemandeForm({ onSubmit }: DemandeFormProps) {
  const [nom, setNom] = useState('');
  const [besoin, setBesoin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nom.trim() || !besoin.trim()) return;

    setLoading(true);

        try {
      await onSubmit({ nom: nom.trim(), besoin: besoin.trim() });
      setNom('');
      setBesoin('');
    } catch {
      // Le message d'erreur est affiché dans App.tsx
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-5">
        Ajouter une demande
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nom du client
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            maxLength={100}
            placeholder="Ex : Ahmed"
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Besoin
          </label>
          <input
            type="text"
            value={besoin}
            onChange={(e) => setBesoin(e.target.value)}
            placeholder="Ex : Réparation ordinateur"
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
      >
        <Plus size={19} />
        {loading ? 'Ajout en cours...' : 'Ajouter la demande'}
      </button>
    </form>
  );
}