# 6mLab

## Paiement Stripe (mode test)

1. Sur dashboard.stripe.com, en **mode test** : Développeurs > Clés API, copie la clé secrète `sk_test_...`.
2. Développeurs > Webhooks > Ajouter un endpoint : `https://<ton-site>/api/stripe/webhook`, événement `checkout.session.completed`. Copie le secret de signature `whsec_...`.
3. Sur Vercel > Settings > Environment Variables : ajoute `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET`, puis redéploie.
4. Teste un achat avec la carte `4242 4242 4242 4242`, une date future et n'importe quel code.

Les commandes payées apparaissent dans Stripe (Paiements) et dans les logs Vercel (`[order]`),
avec le programme, les objectifs et l'option course choisis. L'envoi du programme se fait à la main pour l'instant.

Les clés live (`sk_live_...`) sont refusées tant que `STRIPE_ALLOW_LIVE=1` n'est pas défini.

## Avant de passer en production

Complète `lib/legal.ts` (nom, SIRET, adresse, médiateur de la consommation) : les champs manquants
apparaissent surlignés en jaune sur les pages légales.
