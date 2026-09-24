# Programmes envoyés automatiquement

Les PDF des programmes, avec exactement ces noms. Après un paiement, l'email de confirmation les
joint automatiquement si l'envoi automatique est activé (variable `PROGRAMMES_ENVOI_AUTO=1` sur
Vercel) et que **tous** les fichiers de la commande existent. Sinon, il annonce un envoi sous
48 heures et tu envoies le programme à la main.

| Fichier | Contenu |
|---|---|
| `base-pre-saison.pdf` | Formule Pré-saison (planning de base) |
| `base-maintien-saison.pdf` | Formule Maintien en saison (planning de base) |
| `objectif-muscle.pdf` | Développement musculaire |
| `objectif-explosivite.pdf` | Explosivité |
| `objectif-puissance.pdf` | Puissance |
| `objectif-condition.pdf` | Condition physique |
| `objectif-prevention.pdf` | Prévention & santé |
| `objectif-reathletisation.pdf` | Réathlétisation / retour après blessure |
| `option-course.pdf` | Option course à pied |

Ce dossier n'est pas publié sur le site : les fichiers ne sont accessibles qu'en pièce jointe.

## Modifier le contenu des programmes

Le texte de chaque PDF est dans `programmes/contenu/<nom>.mjs` (titres, paragraphes, tableaux de
séances, fiches d'exercices). Après une modification, regénère les PDF :

```bash
npm run programmes                     # tous les PDF
npm run programmes -- base-pre-saison  # un seul
```

La première fois sur un nouvel ordinateur : `npx playwright install chromium`.

## Modifier le contenu des programmes

Le texte de chaque PDF est dans `programmes/contenu/<nom>.mjs` (titres, paragraphes, tableaux de
séances, fiches d'exercices). Après une modification, regénère les PDF :

```bash
npm run programmes                     # tous les PDF
npm run programmes -- base-pre-saison  # un seul
```

La première fois sur un nouvel ordinateur : `npx playwright install chromium`.
