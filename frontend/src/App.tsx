
import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Clock,
  LoaderCircle,
  CheckCircle,
  X,
  Save,
} from 'lucide-react';

import Header from './components/Header';
import StatsCard from './components/StatsCard';
import DemandeForm from './components/DemandeForm';
import DemandeTable from './components/DemandeTable';

import {
  getDemandes,
  createDemande,
  updateStatut,
  editDemande,
} from './services/demandeService';

import type { Demande, NouvelleDemande } from './types/demande';

function App() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [demandeEnEdition, setDemandeEnEdition] = useState<Demande | null>(null);
  const [saving, setSaving] = useState(false);

  const chargerDemandes = async () => {
    try {
      setError('');
      const data = await getDemandes();
      setDemandes(data);
    } catch {
      setError('Impossible de récupérer les demandes. Vérifiez que Symfony est démarré.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDemandes();
  }, []);

  const handleCreate = async (nouvelleDemande: NouvelleDemande) => {
    try {
      setError('');
      const demande = await createDemande(nouvelleDemande);
      setDemandes((previous) => [demande, ...previous]);
    } catch {
      setError("Une erreur est survenue lors de l'ajout de la demande.");
      throw new Error('Échec de création');
    }
  };

  const handleUpdateStatut = async (
    id: number,
    statut: Demande['statut']
  ) => {
    try {
      setError('');
      await updateStatut(id, statut);

      setDemandes((previous) =>
        previous.map((demande) =>
          demande.id === id ? { ...demande, statut } : demande
        )
      );
    } catch {
      setError('Impossible de modifier le statut.');
      await chargerDemandes();
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!demandeEnEdition) return;

    try {
      setSaving(true);
      setError('');

      const demandeModifiee = await editDemande(
        demandeEnEdition.id,
        {
          nom: demandeEnEdition.nom,
          besoin: demandeEnEdition.besoin,
        }
      );

      setDemandes((previous) =>
        previous.map((demande) =>
          demande.id === demandeModifiee.id
            ? demandeModifiee
            : demande
        )
      );

      setDemandeEnEdition(null);
    } catch {
      setError('Impossible de modifier la demande. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  const total = demandes.length;
  const enAttente = demandes.filter((d) => d.statut === 'En attente').length;
  const enCours = demandes.filter((d) => d.statut === 'En cours').length;
  const terminees = demandes.filter((d) => d.statut === 'Terminée').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <main className="flex-1 min-w-0">
        <Header />

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          <section>
            <h1 className="text-2xl font-bold text-slate-900">
              Bienvenue dans votre espace
            </h1>
            <p className="text-slate-500 mt-1">
              Voici un aperçu de l'activité de vos demandes.
            </p>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatsCard title="Total des demandes" value={total} icon={ClipboardList} color="bg-indigo-100 text-indigo-600" />
            <StatsCard title="En attente" value={enAttente} icon={Clock} color="bg-amber-100 text-amber-600" />
            <StatsCard title="En cours" value={enCours} icon={LoaderCircle} color="bg-blue-100 text-blue-600" />
            <StatsCard title="Terminées" value={terminees} icon={CheckCircle} color="bg-emerald-100 text-emerald-600" />
          </section>

          <DemandeForm onSubmit={handleCreate} />

          <section>
            {loading ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
                Chargement des demandes...
              </div>
            ) : (
              <DemandeTable
                demandes={demandes}
                onUpdateStatut={handleUpdateStatut}
                onEdit={(demande) => setDemandeEnEdition({ ...demande })}
              />
            )}
          </section>
        </div>
      </main>

      {demandeEnEdition && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Modifier la demande
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Demande #{demandeEnEdition.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDemandeEnEdition(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom du client
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={demandeEnEdition.nom}
                  onChange={(e) =>
                    setDemandeEnEdition({
                      ...demandeEnEdition,
                      nom: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Besoin
                </label>
                <textarea
                  required
                  rows={4}
                  value={demandeEnEdition.besoin}
                  onChange={(e) =>
                    setDemandeEnEdition({
                      ...demandeEnEdition,
                      besoin: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDemandeEnEdition(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={17} />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center">
  <p className="text-sm text-slate-500">
    Test_Seomaniak_Wassim_2026
  </p>
</footer>
    </div>
  );
}

export default App;
