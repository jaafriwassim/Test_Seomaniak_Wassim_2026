export interface Demande {
  id: number;
  nom: string;
  besoin: string;
  statut: 'En attente' | 'En cours' | 'Terminée';
  createdAt: string;
}

export interface NouvelleDemande {
  nom: string;
  besoin: string;
}