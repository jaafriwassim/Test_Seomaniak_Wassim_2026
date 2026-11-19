
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { Demande } from '../types/demande';

interface DemandeTableProps {
  demandes: Demande[];
  onUpdateStatut: (id: number, statut: Demande['statut']) => Promise<void>;
  onEdit: (demande: Demande) => void;
}

export default function DemandeTable({
  demandes,
  onUpdateStatut,
  onEdit,
}: DemandeTableProps) {
  const [filtreStatut, setFiltreStatut] = useState('Toutes');

  const getStatusStyle = (statut: Demande['statut']) => {
    switch (statut) {
      case 'En attente':
        return 'bg-amber-100 text-amber-700';
      case 'En cours':
        return 'bg-blue-100 text-blue-700';
      case 'Terminée':
        return 'bg-emerald-100 text-emerald-700';
    }
  };

  const demandesFiltrees = demandes.filter(
    (demande) =>
      filtreStatut === 'Toutes' || demande.statut === filtreStatut
  );

  return (
    <div
      id="demandes"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* En-tête et filtre */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Liste des demandes
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Consultez et mettez à jour les demandes enregistrées.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="filtreStatut"
              className="text-sm font-medium text-slate-600"
            >
              Filtrer par statut
            </label>

            <select
              id="filtreStatut"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toutes">Toutes les demandes</option>
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Terminée">Terminées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Nombre de résultats */}
      <div className="px-6 py-3 bg-slate-50 text-sm text-slate-500">
        {demandesFiltrees.length} demande(s) affichée(s) sur {demandes.length}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Besoin</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {demandesFiltrees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-slate-500"
                >
                  Aucune demande ne correspond à ce filtre.
                </td>
              </tr>
            ) : (
              demandesFiltrees.map((demande) => (
                <tr key={demande.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500">
                    #{demande.id}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {demande.nom}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {demande.besoin}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {demande.createdAt
                      ? new Date(
                          demande.createdAt.replace(' ', 'T')
                        ).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>

                  {/* Modification du statut */}
                  <td className="px-6 py-4">
                    <select
                      value={demande.statut}
                      onChange={(e) =>
                        onUpdateStatut(
                          demande.id,
                          e.target.value as Demande['statut']
                        )
                      }
                      className={`text-xs font-semibold px-3 py-2 rounded-lg border-0 outline-none cursor-pointer ${getStatusStyle(demande.statut)}`}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminée">Terminée</option>
                    </select>
                  </td>

                  {/* Bouton Modifier */}
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onEdit(demande)}
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
                    >
                      <Pencil size={16} />
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
