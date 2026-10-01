# Programmes envoyés par email

Chaque commande reçoit :

| Fichier | Contenu |
|---|---|
| `guide-<formule>-<lieu>.pdf` | Le guide : fonctionnement, planning, progression, règles, matériel |
| `seances-<formule>-<objectif1>-<objectif2>-<lieu>.pdf` | Toutes les séances écrites en entier, dans l'ordre, et la fiche illustrée de chaque exercice |
| `option-course-<lieu>.pdf` | Si l'option course a été prise |

`<lieu>` : `maison` ou `salle`, choisi à l'achat. Les exercices, leurs dessins, les dosages et les
consignes suivent le tableau des correspondances validé (`source/lieux.mjs`) : poids du corps,
objets du quotidien et variante élastique à la maison ; haltères, barre, poulies et tapis de course
incurvé (ou une alternative) en salle.

Les séances existent aussi en 3 silhouettes pour les animations, selon le genre indiqué à l'achat :
`seances-…-<lieu>.pdf` (neutre, « je préfère ne pas le dire »), `seances-…-<lieu>-femme.pdf` et
`seances-…-<lieu>-homme.pdf`. Le client reçoit toujours les fichiers sous leur nom sans lieu ni
suffixe, et l'œil de chaque exercice ouvre l'animation dans le même lieu et la même silhouette
(`/fr/exercices/<id>/maison-femme`).

Avec la Saison complète, le client reçoit le guide et les séances de la partie en cours ; les parties
suivantes partent par email 7 jours avant leur début (voir `app/api/cron/feedback`).

`seance-decouverte.pdf` est la séance gratuite de 15 min envoyée depuis la page d'accueil, en
échange d'une adresse email (suivie de 3 emails de conseils, voir `lib/email.ts`).

Formules : `pre-saison`, `premiere-partie` (1re partie de saison, 18 semaines : 4 blocs et la trêve de Noël, dans `source/premiere-partie.mjs`). La `deuxieme-partie` viendra ensuite. Objectifs, dans l'ordre des noms de fichiers :
`explosivite`, `puissance`, `muscle`, `condition`, `prevention` (10 paires par formule).
La réathlétisation (`seances-<formule>-reathletisation.pdf`) sera ajoutée plus tard.

L'email de confirmation joint ces fichiers si l'envoi automatique est activé (variable
`PROGRAMMES_ENVOI_AUTO=1` sur Vercel) et que tous les fichiers de la commande existent. Sinon, il
annonce un envoi sous 48 heures et tu envoies le programme à la main.

## Version anglaise

Les mêmes fichiers existent en anglais dans `programmes/en/`. Le client choisit la langue de son
programme à l'achat (celle de la page par défaut) ; l'email joint les PDF du bon dossier, et les
yeux des PDF anglais ouvrent les animations sur `/en/exercices/…`.

Les textes anglais sont dans `source/en.mjs` : chaque texte français des sources, avec sa
traduction. Si tu modifies un texte en français, `npm run programmes` s'arrête et liste les textes
à traduire dans `en.mjs` avant de fabriquer le moindre PDF.

Attention au poids : les PDF sont embarqués dans la fonction d'envoi de Vercel (limite 250 Mo). Avec
le français et l'anglais, elle pèse environ 203 Mo : une troisième langue ne tiendrait pas sans
changer de méthode.

## Modifier le contenu

Tout est dans `programmes/source/` :

- `exercices.mjs` : la description de chaque exercice ;
- `objectifs.mjs` : les 5 objectifs et leurs séances de Pré-saison ;
- `premiere-partie.mjs` : les séances de la 1re partie, bloc par bloc, celles de la trêve et la routine épaules ;
- `communs.mjs` : échauffement, gainage, retour au calme et contenu des guides ;
- `figures.mjs` : les illustrations des exercices ;
- `option-course.mjs` : l'option course.

Après une modification, regénère les PDF :

```bash
npm run programmes                                          # tous, français et anglais
npm run programmes -- --fr                                  # français seulement
npm run programmes -- --en seance-decouverte                # un seul, en anglais
npm run programmes -- seances-pre-saison-explosivite-muscle-maison  # un seul
```

La première fois sur un nouvel ordinateur : `npx playwright install chromium`.

## Animations

Chaque exercice qui a une illustration porte un œil dans les PDF. Il ouvre la page
`/fr/exercices/<exercice>` du site : l'animation dans une grande carte blanche, fermée par la
croix en haut à droite. L'adresse du site est prise dans `PROGRAMMES_SITE_URL` (sinon
`NEXT_PUBLIC_SITE_URL`, sinon https://6m-lab-seven.vercel.app) : **régénère les PDF
(`npm run programmes`) quand le nom de domaine change.**
