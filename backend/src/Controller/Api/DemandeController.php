<?php

namespace App\Controller\Api;

use App\Entity\Demande;
use App\Repository\DemandeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class DemandeController extends AbstractController
{
    // Récupérer toutes les demandes
    #[Route('/api/demandes', name: 'app_api_demandes', methods: ['GET'])]
    public function index(DemandeRepository $demandeRepository): JsonResponse
    {
        $demandes = $demandeRepository->findAll();

        $data = [];

        foreach ($demandes as $demande) {
            $data[] = [
                'id' => $demande->getId(),
                'nom' => $demande->getNom(),
                'besoin' => $demande->getBesoin(),
                'statut' => $demande->getStatut(),
                'createdAt' => $demande->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }

    // Ajouter une demande
    #[Route('/api/demandes', name: 'app_api_demandes_create', methods: ['POST'])]
    public function store(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérifier que le JSON est valide
        if (!is_array($data)) {
            return $this->json([
                'message' => 'Le JSON envoyé est invalide.',
            ], 400);
        }

        // Récupérer et valider les champs
        $nom = trim($data['nom'] ?? '');
        $besoin = trim($data['besoin'] ?? '');

        if ($nom === '' || $besoin === '') {
            return $this->json([
                'message' => 'Le nom et le besoin sont obligatoires.',
            ], 400);
        }

        if (mb_strlen($nom) > 100) {
            return $this->json([
                'message' => 'Le nom ne doit pas dépasser 100 caractères.',
            ], 400);
        }

        // Créer la demande
        $demande = new Demande();
        $demande->setNom($nom);
        $demande->setBesoin($besoin);
        $demande->setStatut('En attente');
        $demande->setCreatedAt(new \DateTimeImmutable());

        // Enregistrer dans MySQL
        $entityManager->persist($demande);
        $entityManager->flush();

        return $this->json([
            'message' => 'Demande créée avec succès.',
            'demande' => [
                'id' => $demande->getId(),
                'nom' => $demande->getNom(),
                'besoin' => $demande->getBesoin(),
                'statut' => $demande->getStatut(),
                'createdAt' => $demande->getCreatedAt()->format('Y-m-d H:i:s'),
            ],
        ], 201);
    }
        // Modifier le statut d'une demande
    #[Route(
        '/api/demandes/{id}/statut',
        name: 'app_api_demandes_update_status',
        requirements: ['id' => '\d+'],
        methods: ['PATCH']
    )]
    public function updateStatus(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Rechercher la demande par son ID
        $demande = $entityManager->find(Demande::class, $id);

        if (!$demande) {
            return $this->json([
                'message' => 'Demande introuvable.',
            ], 404);
        }

        // Récupérer le JSON envoyé
        $data = json_decode($request->getContent(), true);

        if (!is_array($data) || !isset($data['statut']) || !is_string($data['statut'])) {
            return $this->json([
                'message' => 'Le statut est obligatoire.',
            ], 400);
        }

        $statut = trim($data['statut']);

        // Vérifier que le statut est autorisé
        $statutsAutorises = ['En attente', 'En cours', 'Terminée'];

        if (!in_array($statut, $statutsAutorises, true)) {
            return $this->json([
                'message' => 'Statut invalide.',
            ], 400);
        }

        // Mettre à jour le statut
        $demande->setStatut($statut);
        $entityManager->flush();

        return $this->json([
            'message' => 'Statut modifié avec succès.',
            'demande' => [
                'id' => $demande->getId(),
                'nom' => $demande->getNom(),
                'besoin' => $demande->getBesoin(),
                'statut' => $demande->getStatut(),
            ],
        ]);
    }

    // Modifier les informations d'une demande
    #[Route(
        '/api/demandes/{id}',
        name: 'app_api_demandes_update',
        requirements: ['id' => '\d+'],
        methods: ['PUT']
    )]
    public function update(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Rechercher la demande
        $demande = $entityManager->find(Demande::class, $id);

        if (!$demande) {
            return $this->json([
                'message' => 'Demande introuvable.',
            ], 404);
        }

        // Récupérer les données envoyées
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json([
                'message' => 'Le JSON envoyé est invalide.',
            ], 400);
        }

        // Vérifier les champs
        $nom = trim($data['nom'] ?? '');
        $besoin = trim($data['besoin'] ?? '');

        if ($nom === '' || $besoin === '') {
            return $this->json([
                'message' => 'Le nom et le besoin sont obligatoires.',
            ], 400);
        }

        if (mb_strlen($nom) > 100) {
            return $this->json([
                'message' => 'Le nom ne doit pas dépasser 100 caractères.',
            ], 400);
        }

        // Mettre à jour les informations
        $demande->setNom($nom);
        $demande->setBesoin($besoin);

        $entityManager->flush();

        return $this->json([
            'message' => 'Demande modifiée avec succès.',
            'demande' => [
                'id' => $demande->getId(),
                'nom' => $demande->getNom(),
                'besoin' => $demande->getBesoin(),
                'statut' => $demande->getStatut(),
                'createdAt' => $demande->getCreatedAt()?->format('Y-m-d H:i:s'),
            ],
        ]);
    }
}
