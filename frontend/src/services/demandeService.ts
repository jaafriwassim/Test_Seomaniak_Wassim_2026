import axios from 'axios';
import type { Demande, NouvelleDemande } from '../types/demande';

const API_URL = 'http://127.0.0.1:8000/api/demandes';

export const getDemandes = async (): Promise<Demande[]> => {
  const response = await axios.get<Demande[]>(API_URL);
  return response.data;
};

export const createDemande = async (
  nouvelleDemande: NouvelleDemande
): Promise<Demande> => {
  const response = await axios.post(API_URL, nouvelleDemande);
  return response.data.demande;
};

export const updateStatut = async (
  id: number,
  statut: Demande['statut']
): Promise<void> => {
  await axios.patch(`${API_URL}/${id}/statut`, { statut });
};

export const editDemande = async (
  id: number,
  donnees: NouvelleDemande
): Promise<Demande> => {
  const response = await axios.put(`${API_URL}/${id}`, donnees);
  return response.data.demande;
};
