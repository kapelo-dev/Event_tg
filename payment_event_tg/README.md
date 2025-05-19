# Payment Event TG - Intégration Paydunya

Cette application permet d'intégrer Paydunya pour le traitement des paiements d'événements.

## Installation

1. Clonez le repository
2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
PAYDUNYA_MASTER_KEY=votre_master_key
PAYDUNYA_PUBLIC_KEY=votre_public_key
PAYDUNYA_PRIVATE_KEY=votre_private_key
PAYDUNYA_TOKEN=votre_token
PAYDUNYA_MODE=test
PORT=3000
```

## Utilisation

1. Démarrez le serveur :

```bash
npm start
```

2. Pour le développement, utilisez :

```bash
npm run dev
```

## Endpoints

### Initialiser un paiement

- POST `/api/payment/initiate`
- Corps de la requête :

```json
{
  "amount": 1000,
  "description": "Paiement pour événement X"
}
```

### Webhook

- POST `/api/webhook`
- Endpoint qui reçoit les notifications de Paydunya

## Sécurité

- Ne jamais commiter le fichier `.env`
- Toujours utiliser HTTPS en production
- Valider les données entrantes
