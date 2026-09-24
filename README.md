# 6mLab

## Paiement Stripe (mode test)

1. Sur dashboard.stripe.com, en **mode test** : Développeurs > Clés API, copie la clé secrète `sk_test_...`.
2. Développeurs > Webhooks > Ajouter un endpoint : `https://<ton-site>/api/stripe/webhook`, événement `checkout.session.completed`. Copie le secret de signature `whsec_...`.
3. Sur Vercel > Settings > Environment Variables : ajoute `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET`, puis redéploie.
4. Teste un achat avec la carte `4242 4242 4242 4242`, une date future et n'importe quel code.

Les commandes payées apparaissent dans Stripe (Paiements) et dans les logs Vercel (`[order]`),
avec le programme, les objectifs, l'option course et le profil (prénom, âge, genre). L'envoi du programme se fait à la main pour l'instant.

Les clés live (`sk_live_...`) sont refusées tant que `STRIPE_ALLOW_LIVE=1` n'est pas défini.

## Emails automatiques (iCloud Mail)

Après chaque paiement, le webhook Stripe envoie :
- au client, la confirmation de commande (récapitulatif, CGV, renonciation au droit de rétractation) ;
- à 6M Lab, un résumé de la commande (prénom, âge, genre, objectifs, option course).

Les PDF déposés dans `programmes/` (voir `programmes/LISEZMOI.md`) sont joints automatiquement
dès que tous les fichiers d'une commande existent ; sinon l'email annonce un envoi sous 48 heures.

1. Sur appleid.apple.com : Connexion et sécurité > Mots de passe pour app > créer « 6M Lab ».
2. Vercel : ajoute `MAIL_USER` (ton adresse iCloud) et `MAIL_PASSWORD` (le mot de passe pour app), puis redéploie.
3. Stripe : le webhook (`STRIPE_WEBHOOK_SECRET`) doit être configuré, voir plus haut.

## Avant de passer en production

Complète `lib/legal.ts` (nom, SIRET, adresse, médiateur de la consommation) : les champs manquants
apparaissent surlignés en jaune sur les pages légales.
