# Programmes envoyés par email

Chaque commande reçoit :

| Fichier | Contenu |
|---|---|
| `guide-<formule>.pdf` | Le guide : fonctionnement, planning, progression, règles |
| `seances-<formule>-<objectif1>-<objectif2>.pdf` | Toutes les séances écrites en entier, dans l'ordre, et la fiche illustrée de chaque exercice |
| `option-course.pdf` | Si l'option course a été prise |

Formules : `pre-saison`, `maintien-saison`. Objectifs, dans l'ordre des noms de fichiers :
`explosivite`, `puissance`, `muscle`, `condition`, `prevention` (10 paires par formule).
La réathlétisation (`seances-<formule>-reathletisation.pdf`) sera ajoutée plus tard.

L'email de confirmation joint ces fichiers si l'envoi automatique est activé (variable
`PROGRAMMES_ENVOI_AUTO=1` sur Vercel) et que tous les fichiers de la commande existent. Sinon, il
annonce un envoi sous 48 heures et tu envoies le programme à la main.

## Modifier le contenu

Tout est dans `programmes/source/` :

- `exercices.mjs` : la description de chaque exercice ;
- `objectifs.mjs` : les 5 objectifs et leurs séances ;
- `communs.mjs` : échauffement, gainage, retour au calme et contenu des guides ;
- `figures.mjs` : les illustrations des exercices ;
- `option-course.mjs` : l'option course.

Après une modification, regénère les PDF :

```bash
npm run programmes                                          # tous
npm run programmes -- seances-pre-saison-explosivite-muscle  # un seul
```

La première fois sur un nouvel ordinateur : `npx playwright install chromium`.
