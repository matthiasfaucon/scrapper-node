# LogiScrap

LogiScrap est un outil permettant de trouver des biens qui correspondent à vos besoins.

## Installation et Utilisation

1. Cloner le dépôt : `git clone https://github.com/matthiasfaucon/scrapper-node.git`
2. Installer les dépendances du front-end :
```
cd front-end
pnpm install
pnpm dev 
```

3. Installer les dépendances du back-end :
```
cd back-end
pnpm install
pnpm start
```

## Configuration

1. Configurer le back-end :

Dans le dossier `back-end`, renommer le fichier `.env.example` en `.env` et rajouter le token pour utiliser Resend.

Pour obtenir le token, veuillez consulter la documentation de Resend [ici](https://resend.com/docs/introduction).

## Structure du Projet

- `front-end/`: Contient le code du front-end développé en Vue.js.
- `back-end/`: Contient le code du back-end développé en Node.js.
