# supabase-mds

Application React + TypeScript + Vite avec Supabase comme backend.

## Prérequis

- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Mise en place du projet Supabase

1. Créer un compte sur [supabase.com](https://supabase.com) et créer un nouveau projet
2. Une fois le projet créé, récupérer les informations dans **Settings > API** :
   - **Project URL** (ex: `https://xxxx.supabase.co`)
   - **Publishable key** (dans la section "Publishable key")

## Installation

```bash
npm install
```

Copier le fichier d'exemple et renseigner les variables :

```bash
cp .env.example .env
```

Puis éditer `.env` avec les valeurs de ton projet Supabase.

## Base de données

Connecter la CLI au projet :

```bash
supabase link --project-ref <project-ref>
```

Le `project-ref` est l'identifiant dans l'URL de ton projet Supabase (ex: `odmocrwirvmrwkwedrmg`).

Appliquer les migrations :

```bash
supabase db push
```

## Lancer l'application

```bash
npm run dev
```
