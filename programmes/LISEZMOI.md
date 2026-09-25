# Programmes envoyés par email

Chaque commande reçoit :

| Fichier | Contenu |
|---|---|
| `guide-<formule>.pdf` | Le guide : fonctionnement, planning, progression, règles |
| `seances-<formule>-<objectif1>-<objectif2>.pdf` | Toutes les séances écrites en entier, dans l'ordre, et la fiche illustrée de chaque exercice |
| `option-course.pdf` | Si l'option course a été prise |

Les séances existent en 3 versions de silhouettes pour les animations, selon le genre indiqué à
l'achat : `seances-….pdf` (neutre, « je préfère ne pas le dire »), `seances-…-femme.pdf` et
`seances-…-homme.pdf`. Le client reçoit toujours le fichier sous le nom sans suffixe, et l'œil
de chaque exercice ouvre l'animation avec la même silhouette (`/fr/exercices/<id>/femme`).

Avec le pack Saison complète (Pré-saison + Maintien), le client reçoit le guide et les séances des
deux formules, avec les mêmes objectifs.

`seance-decouverte.pdf` est la séance gratuite de 15 min envoyée depuis la page d'accueil, en
échange d'une adresse email (suivie de 3 emails de conseils, voir `lib/email.ts`).

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

## Animations

Chaque exercice qui a une illustration porte un œil dans les PDF. Il ouvre la page
`/fr/exercices/<exercice>` du site : l'animation dans une grande carte blanche, fermée par la
croix en haut à droite. L'adresse du site est prise dans `PROGRAMMES_SITE_URL` (sinon
`NEXT_PUBLIC_SITE_URL`, sinon https://6m-lab-seven.vercel.app) : **régénère les PDF
(`npm run programmes`) quand le nom de domaine change.**
