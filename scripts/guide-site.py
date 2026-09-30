# Builds the admin's site guide (private/docs/guide-site.html): python3 scripts/guide-site.py
# Update a point's status here after each change to the site, then run the script.
import html, os, datetime
# Status: ok (fait), part (en partie), todo (à faire avec Claude), you (de ta part), later (plus tard)
S = {"ok": "Fait", "part": "En partie", "todo": "À faire", "you": "De ta part", "later": "Plus tard"}
SECTIONS = [
("offre", "Offre et positionnement", "Ce qu'on vend, à qui, et pourquoi chez toi plutôt qu'ailleurs. Tout le reste du site en découle.", [
 ("ok", "Une promesse lisible en 5 secondes", "En arrivant sur l'accueil, on comprend : préparation physique handball, pour quel joueur, pour quel résultat. Titre, sous-titre et un bouton principal."),
 ("ok", "Des cibles claires", "Joueurs et joueuses à partir de 13 ans, parents qui achètent pour leur enfant, coachs et clubs. Chaque cible a son chemin : questionnaire, programmes, page Clubs."),
 ("ok", "Une gamme simple à comprendre", "Programmes par objectif (pré-saison, saison, performance, prévention), pack Saison complète, offre Clubs sur devis. Réathlétisation affichée « en préparation »."),
 ("ok", "Des prix affichés et comparables", "Prix par programme, prix ramené à la semaine, économie du pack rappelée au paiement."),
 ("ok", "Une règle de remboursement claire", "Décidé : pas de remboursement une fois le programme envoyé, puisque le client garde les PDF (c'est dans les CGV, accepté au paiement). Seul un fichier illisible ou une animation inaccessible est corrigé ou remboursé."),
 ("you", "Ce qui te rend unique, dit en une phrase", "Ton expérience de joueur, de coach, de préparateur, tes diplômes. À écrire en une phrase réutilisée partout : accueil, À propos, réseaux, emails."),
]),
("saison", "La saison en 3 parties", "Le chantier en cours : vendre toute la saison, de juillet à mi-juin, en 3 parties qui s'enchaînent. Chaque partie a son rôle, et la continuité du travail est l'argument de vente.", [
 ("ok", "Le découpage et les prix décidés", "Prix en ,99, fixés selon le travail demandé et pas seulement la durée. Pré-saison (juillet-août, 8 semaines) : 59,99 €. 1re partie de saison (septembre à la fin des vacances de Noël, 18 semaines) : 89,99 €. 2e partie de saison (4 janvier à mi-juin, phases finales comprises, 23 semaines) : 99,99 €. Saison complète (les 3 parties à la suite à partir de celle en cours) : 199,99 € au lieu de 249,97 € (-20 %), ou 3 × 66,99 € plus tard. Achat en cours de partie : le PDF entier au prix plein, ou un PDF qui démarre à la semaine en cours, au prix des semaines restantes (arrondi à ,99). Pas de remboursement."),
 ("ok", "La nouvelle offre sur le site", "Les 3 parties et la Saison complète sur l'accueil, les pages programme, le questionnaire, la FAQ et les CGV ; le choix « à partir de la semaine en cours » au paiement ; l'accès aux animations selon les semaines achetées ; les emails ; « Et après ? » d'une partie à l'autre. Les parties suivantes du pack partent seules par email 7 jours avant leur début (ou tu reçois un rappel pour les envoyer). L'ancienne page Maintien renvoie vers la 1re partie. Tant que les PDF de la 1re et de la 2e partie (et ceux « à partir de la semaine X ») ne sont pas faits, tu reçois la commande pour l'envoyer à la main."),
 ("todo", "Le pack payable en 3 fois", "Un premier paiement à l'achat puis un par mois pendant 2 mois ; chaque partie est envoyée à sa date de début si les paiements sont à jour. Les CGV précisent l'engagement sur les 3 échéances."),
 ("todo", "Le contenu de la 1re partie (18 semaines)", "Garder ce que la pré-saison a construit avec les matchs en plus, et gérer la trêve de Noël. Base : le Maintien actuel, allongé et complété, exercices choisis et groupés d'après les études (prévention, charge en saison, maintien de la force)."),
 ("todo", "Le contenu de la 2e partie (23 semaines)", "Reprise après la trêve, fraîcheur, prévention, être au top pour les matchs décisifs de fin de saison. À finir avant décembre pour une vente en janvier."),
 ("todo", "Les clubs en 3 phases", "Devis et documents clubs découpés en pré-saison, 1re et 2e partie, avec une option pour toute la saison."),
 ("later", "Forme & bien-être en trimestres", "Pour les programmes accessibles à tous, un découpage en trimestres, au moment du lancement."),
 ("you", "Tes décisions et tes idées d'exercices", "À trancher : le Maintien devient-il la 1re partie ? Un joueur qui achète en cours de partie paie-t-il le prix plein ou au prorata ? Par quoi on commence ? Et envoie les liens ou captures des exercices Instagram qui te plaisent : ils sont vérifiés dans les études, puis ajoutés avec nos propres animations."),
]),
("structure", "Structure et navigation", "Chaque visiteur doit trouver son chemin sans réfléchir.", [
 ("ok", "Un menu court", "4 entrées : Programmes, Clubs, Conseils, Espace client, plus le bouton « Choisir mon programme ». Le logo ramène à l'accueil ; À propos, FAQ et Contact sont dans le pied de page et en bas du menu du téléphone."),
 ("ok", "Un parcours d'achat en peu de clics", "Accueil, puis questionnaire ou programme, puis paiement. Le questionnaire oriente vers le bon programme."),
 ("ok", "Un pied de page complet", "Mentions légales, CGV, confidentialité, contact, changement de langue."),
 ("ok", "Une recherche dans la bibliothèque d'exercices", "Recherche et familles d'exercices (dont Gardiens de but)."),
 ("ok", "Une page d'erreur 404 utile", "Une adresse fausse affiche une page 6M Lab (« Tir hors cadre ») qui renvoie vers le questionnaire, la séance gratuite et les programmes."),
 ("ok", "Une FAQ générale", "20 questions en 4 thèmes (choisir, commande et accès, clubs avec le code club, contact), en français et en anglais, lisibles par Google. Lien dans le pied de page."),
]),
("design", "Design et mise en page", "Le site doit paraître aussi sérieux que le contenu des programmes.", [
 ("ok", "Une identité cohérente", "Logo, couleurs, typographies et ton identiques sur le site, les PDF, les emails et l'admin."),
 ("ok", "Pensé d'abord pour le téléphone", "La plupart des joueurs arrivent depuis Instagram ou TikTok, sur mobile. Toutes les pages sont vérifiées à la largeur d'un téléphone."),
 ("ok", "Un bouton principal par écran", "Chaque section mène vers une seule action évidente : questionnaire, programme ou devis."),
 ("part", "Un site vivant et dynamique (objectif)", "Donner du mouvement sans refaire le site. Fait : blocs qui apparaissent en glissant au défilement, cartes qui se soulèvent au survol, boutons qui réagissent au toucher, bande défilante des objectifs sous l'accueil, animations d'exercices qui démarrent quand on les voit (et se mettent en pause hors écran), fondu entre les pages, bandeau du haut qui se resserre au défilement, réponses de la FAQ qui s'ouvrent en douceur. À suivre : chiffres qui s'animent (joueurs accompagnés, avis) quand il y en aura, courtes vidéos. Toujours désactivé si le téléphone demande moins d'animations."),
 ("ok", "Montrer le produit", "Vidéo de 30 s en français sur l'accueil et les pages programme : les pages du PDF, l'œil d'un exercice, les animations (lecture muette, seulement quand elle est à l'écran, bouton pause). Au format vertical, elle sert aussi pour Instagram et TikTok (public/video/demo.mp4, refaite avec npm run demo-video). En anglais : le PDF qui se feuillette. Plus les animations d'exercices et l'aperçu de la séance gratuite."),
 ("you", "De vraies photos", "Des photos de toi sur le terrain et de joueurs à l'entraînement, avec leur accord. C'est ce qui manque le plus pour que le site paraisse humain et crédible."),
 ("ok", "Accessibilité", "Audit complet (axe, normes WCAG 2.1 AA) sur 25 pages, puis sur les pages ajoutées depuis (espace client, bibliothèque clubs ouverte avec un code, Contact, FAQ, Confidentialité, vidéo, admin Réponses types et Clubs), en clair et en sombre, sur téléphone et ordinateur : zéro erreur. Navigation au clavier vérifiée, repère visible sur chaque élément, animations et vidéo coupées si le téléphone le demande. À refaire après chaque grosse modification."),
]),
("contenu", "Contenu et textes", "Des textes qui parlent de ce que le joueur gagne, avec les mots du handball.", [
 ("ok", "Des bénéfices avant les caractéristiques", "« Arriver prêt à la reprise, sans blessure » plutôt que « 12 séances de renforcement »."),
 ("ok", "Des pages programme détaillées", "Pour qui, combien de temps, quel matériel, déroulé d'une semaine, FAQ, aperçu du PDF."),
 ("ok", "Le vocabulaire du handball", "Induction, repli, montée, poste, ligne des 9 m : le lecteur doit se sentir chez lui."),
 ("ok", "Français et anglais", "Site, programmes PDF, emails et animations dans les deux langues."),
 ("ok", "Des articles de conseils réguliers", "2 articles par mois, calés sur la saison, écrits d'avance et publiés seuls à leur date (12 programmés d'octobre 2026 à mars 2027 : sommeil, Nordic, échauffement d'avant-match, récupération, trêve de Noël, genou des joueuses, reprise de janvier, charge et épaule, puissance en phase retour, vacances de février, équilibre et cheville, hanches des gardiens). Le calendrier est sur l'accueil de l'admin, qui prévient quand il reste moins de 2 articles à paraître."),
 ("you", "Une vidéo de présentation", "30 à 60 secondes : qui tu es, ce que contient un programme, pour qui. À mettre sur l'accueil et à réutiliser sur les réseaux."),
]),
("confiance", "Confiance et preuve sociale", "Avant de payer, le visiteur cherche des raisons de te croire.", [
 ("ok", "Paiement sécurisé et reconnu", "Paiement par Stripe, avec carte, Apple Pay ou Google Pay selon l'appareil."),
 ("ok", "Des avis clients vérifiés", "Le système est prêt : questionnaire de fin de programme, avis publiés, code promo en remerciement. Il ne manque que les premiers clients."),
 ("ok", "Des sources scientifiques", "Les articles citent les études et les méthodes (30-15, prévention des blessures). C'est un vrai différenciateur face aux programmes génériques."),
 ("you", "Ta page À propos complète", "Photo, parcours, diplômes, clubs, pourquoi tu as créé 6M Lab."),
 ("you", "Des témoignages avant le lancement", "Faire tester gratuitement 5 à 10 joueurs ou un club, et recueillir leurs retours (texte, photo, résultat) pour ne pas ouvrir avec zéro avis."),
 ("later", "Chiffres et références", "Nombre de joueurs accompagnés, clubs partenaires, logos. À afficher dès qu'ils existent."),
]),
("conversion", "Tunnel de vente", "Transformer un visiteur en client, puis en client fidèle.", [
 ("ok", "Questionnaire d'orientation", "Quelques questions, puis le programme recommandé."),
 ("ok", "Formulaire d'achat court", "Objectifs, lieu, silhouette, langue, option course : seulement ce qui sert au programme."),
 ("ok", "Page de remerciement et email de confirmation", "Le client sait tout de suite quoi faire : PDF joint, bouton « Mon espace client » pour activer sa bibliothèque le jour où il commence, rappel avant le début."),
 ("ok", "Relance des paniers abandonnés", "Un email à ceux qui ont commencé un paiement sans le terminer."),
 ("ok", "Vente complémentaire", "Le pack Saison complète est proposé avec l'économie réalisée."),
 ("ok", "Le bon moment de l'année", "« Quand commencer » : le visiteur voit quand démarrer selon sa date de reprise."),
 ("later", "Tester des variantes", "Une fois qu'il y a du trafic : tester deux titres ou deux boutons et garder le meilleur."),
]),
("seo", "Référencement naturel (Google)", "Être trouvé quand un joueur ou un coach cherche « préparation physique handball ».", [
 ("you", "Un nom de domaine", "C'est la première étape de la mise en ligne. Tout le reste du référencement en dépend."),
 ("todo", "Ouvrir le site aux moteurs de recherche", "Le site est volontairement fermé aux moteurs de recherche. À ouvrir le jour de la mise en ligne (réglage SITE_PUBLIC)."),
 ("todo", "Google Search Console", "Après le domaine : déclarer le site et le plan du site, puis suivre les recherches qui amènent des visiteurs."),
 ("ok", "Titres, descriptions et plan du site", "Chaque page a son titre et sa description ; plan du site et fichier robots existent."),
 ("ok", "Données structurées", "Produits (programmes, prix) et articles sont décrits pour Google. Dès le premier avis publié, chaque programme reçoit sa propre note moyenne (étoiles dans Google), la même que celle affichée dans le bloc d'avis de sa page."),
 ("ok", "Des pages pour chaque recherche importante", "4 guides complets prêts : préparation physique pré-saison, gardien de but, prévention des blessures, musculation. Chacun avec exercices animés, FAQ lisible par Google, programme conseillé et articles liés. Ils sont en haut de la page Conseils et dans le plan du site ; Google les lira dès l'ouverture du site."),
 ("todo", "Des liens depuis d'autres sites", "Clubs, comités, ligues, kinés, blogs de handball qui parlent de 6M Lab avec un lien. Ça vient avec les partenariats."),
]),
("technique", "Technique et performance", "Un site rapide, fiable, et qui envoie ses emails.", [
 ("ok", "Hébergement fiable et HTTPS", "Vercel, avec un aperçu pour chaque modification avant de la valider."),
 ("ok", "Sécurité du site", "Paiement par Stripe, codes et cookies signés, connexion par code à 6 chiffres limitée en essais. Admin : mot de passe, 10 essais par quart d'heure et par adresse, actions refusées si elles viennent d'un autre site. Protections du navigateur sur toutes les pages (HTTPS obligatoire, site impossible à afficher dans un autre site). Site sur Next.js 16 : aucune faille connue dans les composants (audit npm à zéro)."),
 ("ok", "Sauvegarde du site", "Le code et les documents sont sur GitHub. Les données (codes clubs, statistiques, journaux dans Redis, et une copie des commandes et clients Stripe) partent chaque lundi par email dans un fichier de sauvegarde, et se téléchargent à tout moment depuis l'accueil de l'admin. npm run restaurer remet Redis en place à partir de ce fichier."),
 ("part", "Vitesse", "Mesuré avec Lighthouse (l'outil de PageSpeed Insights), en simulant un téléphone : accueil passé de 74 à 83-93/100, autres pages 95 à 97/100, rien ne bouge au chargement. À refaire sur le vrai site après la mise en ligne, avec PageSpeed Insights et les données réelles des visiteurs."),
 ("part", "Emails envoyés depuis ton domaine", "Préparé : la marche à suivre est dans l'aide-mémoire de l'admin. Avec iCloud+ (déjà utilisé pour les emails du site) : domaine de messagerie personnalisé, réglages SPF, DKIM et DMARC, adresse contact@ton-domaine, puis test sur mail-tester.com. À faire dès que le nom de domaine est choisi."),
 ("ok", "Surveiller les erreurs", "Un email « ⚠ 6M Lab » part dès qu'un paiement, un envoi de programme, un formulaire ou les emails automatiques échouent, avec quoi faire. Les alertes s'affichent aussi en haut de l'accueil de l'admin (bouton de test). Et de l'extérieur : toutes les 15 minutes, GitHub vérifie que le site et sa base de données répondent (/api/sante), et envoie un email sinon. À activer avec la variable SITE_URL dans GitHub."),
]),
("legal", "Légal et conformité", "Vendre en règle, surtout à des mineurs et pour du sport.", [
 ("ok", "CGV, confidentialité, mentions légales", "Les trois pages existent, en français et en anglais."),
 ("you", "Compléter les mentions légales", "Nom, SIRET, adresse et médiateur de la consommation. Obligatoire avant de vendre pour de vrai."),
 ("ok", "Droit de rétractation", "L'acheteur accepte les CGV et renonce à la rétractation une fois le programme envoyé, au moment du paiement."),
 ("ok", "Mineurs et santé", "Accord d'un parent pour un mineur, conseil de consulter un médecin, arrêt en cas de douleur : c'est écrit dans les CGV et les programmes."),
 ("ok", "Pas de cookie publicitaire", "La mesure d'audience est anonyme et sans cookie : pas de bandeau à afficher. La page Confidentialité liste les 4 cookies de fonctionnement (connexion, code, accès, appareil), le journal des connexions et la base de données Upstash."),
 ("ok", "Mention TVA", "« TVA non applicable, article 293 B du CGI » dans les mentions et les CGV. À vérifier avec ton statut."),
]),
("marketing", "Marketing et acquisition", "Faire venir les bonnes personnes, régulièrement, sans dépendre de la publicité.", [
 ("ok", "Un cadeau d'entrée : la séance gratuite", "Elle récolte des emails de joueurs intéressés, en français et en anglais."),
 ("ok", "Des emails aux bons moments de la saison", "Reprise, trêve, fin de saison : les inscrits reçoivent le bon message au bon moment."),
 ("ok", "Savoir d'où viennent les visiteurs", "Instagram, TikTok, Google, liens de clubs : chaque visite et chaque vente est rattachée à sa source."),
 ("you", "Instagram et TikTok réguliers", "Les animations d'exercices, des conseils courts, des extraits de séances. 3 publications par semaine, chacune avec un lien suivi."),
 ("you", "Un calendrier de communication calé sur la saison", "Juin-juillet : pré-saison. Septembre : reprise. Décembre : trêve. Mai : fin de saison et coupure."),
 ("ok", "Parrainage", "Encadré sur l'accueil. Chaque acheteur a son code à partager (email de confirmation, et espace client : connexion par référence de commande et code à 6 chiffres envoyé par email, une carte par commande pour activer ou ouvrir sa bibliothèque, boutons Partager, Copier et WhatsApp ; un seul code par personne). Le coéquipier a -15 % ; le parrain gagne 50 points par coéquipier, validés 7 jours après sa commande (pas de remboursement, email et carte jamais vus), et un code de -15 % à 150 points. Points et parrainages visibles dans l'espace client et dans Commandes & avis."),
 ("you", "Partenariats", "Clubs, coachs, kinés, magasins de sport : un lien, un code promo dédié, et le suivi des ventes par partenaire."),
 ("later", "Publicité payante", "Seulement quand le site convertit bien et a des avis. Petits budgets, ciblés sur les parents et les joueurs, en période de reprise."),
]),
("fidelisation", "Après l'achat et fidélisation", "Un client content revient et en parle.", [
 ("ok", "Accès aux animations et PDF gardé à vie", "Le client garde son PDF ; les animations restent accessibles pendant la durée prévue."),
 ("ok", "Questionnaire de forme et avis", "Le client suit sa forme, laisse un avis et reçoit un code de réduction."),
 ("ok", "Proposer la suite", "À 2 semaines de la fin d'un programme, l'espace client affiche « Et après ? », repris dans l'email de fin de programme et dans celui de fin d'accès : Maintien après la Pré-saison, nouveau cycle de Maintien en cours de saison, Prévention puis Pré-saison en fin de saison. Le lien ouvre le programme avec les objectifs déjà choisis."),
 ("ok", "Répondre vite", "Réponse sous 48 h annoncée (Contact, FAQ, emails). La page Contact oriente d'abord vers l'espace client, le questionnaire et la FAQ, et propose un formulaire (email, sujet, référence de commande, message) : le message arrive dans ta boîte, tu réponds directement au client, et il reçoit tout de suite un accusé de réception avec le délai de 48 h, les liens utiles et la copie de son message. Même accusé pour les demandes de devis clubs. L'adresse email reste affichée pour ceux qui préfèrent leur messagerie. Dans l'admin, 12 réponses types à copier (FR et EN) et 3 règles pour tenir le délai."),
]),
("clubs", "Offre Clubs", "Un autre public, qui décide autrement : il faut rassurer et faciliter.", [
 ("ok", "Une page dédiée", "Bénéfices, séance type, ce qu'il faut savoir, exemple d'exercice animé."),
 ("ok", "Un devis structuré", "Catégorie, niveau, joueurs de champ et gardiens, installations, matériel ; acquis à confirmer."),
 ("ok", "Tes outils de réponse", "Méthode Clubs, exemple U18, dossier Gardiens et fiche de suivi, dans l'admin."),
 ("ok", "Code d'accès aux animations pour les clubs", "Deux bibliothèques : l'individuelle pour les acheteurs, la bibliothèque clubs (situations collectives animées, ateliers gardiens, tests, exercices des programmes clubs) ouverte par un code d'équipe créé dans Admin > Clubs (date de fin, nombre d'appareils). L'œil des documents clubs pointe vers la bonne page et reste cliquable dans le PDF."),
 ("ok", "Sortie des programmes clubs en PDF", "Les 4 documents d'un programme club sortent en PDF (npm run clubs-pdf) : document du coach, autonomie joueurs, autonomie gardiens, fiche de suivi en paysage avec une ligne par joueur. Le code de l'équipe y est écrit, l'œil de chaque exercice est un lien cliquable vers la bibliothèque clubs. À télécharger dans Admin > Clubs."),
 ("you", "Un prix indicatif", "« À partir de … € » rassure et filtre les demandes. À décider."),
 ("you", "Un premier club témoin", "Un club qui teste et accepte d'être cité : c'est la meilleure publicité auprès des autres clubs."),
]),
("pilotage", "Pilotage", "Savoir ce qui marche, décider vite, et garder ce guide à jour.", [
 ("ok", "Tableau de bord", "Visites, étapes du parcours, ventes et chiffre d'affaires, par source, dans l'admin."),
 ("you", "Des objectifs chiffrés", "Par exemple : visiteurs par mois, taux de conversion, ventes par mois, demandes de devis. On compare chaque mois."),
 ("you", "Une revue mensuelle de ce guide", "Une fois par mois : on reprend la liste, on coche ce qui est fait et on choisit les 3 prochains points."),
]),
]
NEXT = [
 ("you", "Compléter les mentions légales, puis choisir le nom de domaine", "legal"),
 ("you", "Écrire la page À propos avec ta photo et ton parcours", "confiance"),
 ("todo", "La saison en 3 parties : nouvelle offre, pack en 3 fois, contenu de la 1re puis de la 2e partie", "saison"),
 ("you", "Trancher les 3 questions de la saison en 3 parties et envoyer tes idées d'exercices", "saison"),
 ("you", "Faire tester 5 à 10 joueurs et un club pour avoir les premiers avis", "confiance"),
 ("todo", "Mise en ligne : domaine, emails du domaine, ouverture à Google, Search Console, Stripe en mode réel", "seo"),
 ("part", "Rendre le site plus dynamique, étape par étape", "design"),
 ("you", "Lancer Instagram et TikTok avec les animations d'exercices", "marketing"),
 ("you", "Tester le parcours complet en mode test Stripe (commande, code, parrainage)", "confiance"),
]
# "Fait" points that can still be improved: title -> what to do next (shown as « À améliorer »).
IMPROVE = {
 "Sortie des programmes clubs en PDF": "Les PDF sont produits avec Claude : un bouton « Générer les PDF » dans Admin > Clubs rendrait l'outil autonome.",
}
from collections import Counter
MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
_d = datetime.date.today(); DATE = f'{_d.day} {MOIS[_d.month-1]} {_d.year}'
cnt = Counter(s for _, _, _, items in SECTIONS for s, _, _ in items)
total = sum(cnt.values())
e = html.escape
def imp(h): return f'<p class="imp"><span>À améliorer</span>{e(IMPROVE[h])}</p>' if h in IMPROVE else ''
def pill(s): return f'<span class="st {s}">{S[s]}</span>'
toc = "".join(f'<a href="#{sid}"><span>{i:02d}</span>{e(t)}</a>' for i, (sid, t, _, _) in enumerate(SECTIONS, 1))
secs = []
for i, (sid, t, lead, items) in enumerate(SECTIONS, 1):
    c = Counter(s for s, _, _ in items)
    done = c["ok"]
    lis = "".join(f'<li data-s="{s}"{" data-a" if h in IMPROVE else ""}>{pill(s)}<div><b>{e(h)}</b><p>{e(p)}</p>{imp(h)}</div></li>' for s, h, p in items)
    secs.append(f'<section id="{sid}"><div class="sh"><span class="num">{i:02d}</span><div><h2>{e(t)}</h2><p class="lead">{e(lead)}</p></div><span class="prog">{done}/{len(items)} faits</span></div><ul class="items">{lis}</ul></section>')
nxt = "".join(f'<li>{pill(s)}<a href="#{sec}">{e(t)}</a></li>' for s, t, sec in NEXT)
legend = "".join(f'<button type="button" class="chip" data-f="{k}" aria-pressed="false">{pill(k)}<b>{cnt[k]}</b></button>' for k in S) + f'<button type="button" class="chip" data-f="a" aria-pressed="false"><span class="st imp">À améliorer</span><b>{len(IMPROVE)}</b></button>'
out = f'''<title>Guide du site 6M Lab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap">
<style>
:root{{color-scheme:light;
  --paper:#F8F7FB;--card:#FFFFFF;--ink:#17122B;--muted:#5C5670;--line:#E4E0EC;--accent:#5B3FB0;--accent-bg:#EFEAFB;
  --ok:#136F63;--ok-bg:#DDF3EF;--part:#9A6A12;--part-bg:#FBF0D8;--todo:#2C5BA8;--todo-bg:#E2EBFA;--you:#A83A2C;--you-bg:#FCE6E2;--later:#5C5670;--later-bg:#EEECF3;
  --display:"Anton","Impact","Arial Narrow",sans-serif;--body:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif}}
*{{box-sizing:border-box}}
body{{background:var(--paper);color:var(--ink);font:400 16px/1.6 var(--body);margin:0}}
.page{{max-width:1160px;margin:0 auto;padding-inline:20px;padding-block:0 4rem;display:grid;gap:2rem}}
@media(min-width:1000px){{.page{{grid-template-columns:240px minmax(0,1fr);align-items:start}}}}
header.top{{grid-column:1/-1;background:var(--card);border-bottom:4px solid var(--accent);margin-inline:-20px;padding:2.2rem 20px 1.8rem}}
header.top .in{{max-width:1120px;margin:0 auto;display:grid;gap:.8rem}}
.kick{{font:600 .78rem var(--body);letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}}
h1{{font:400 clamp(2.3rem,6.5vw,4rem)/1 var(--display);margin:0;text-wrap:balance}}
header.top p{{margin:0;max-width:72ch;color:var(--muted)}}
.legend{{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}}
.legend small{{color:var(--muted);font-size:.85rem}}
.chip{{display:inline-flex;align-items:center;gap:.4rem;border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:.2rem .6rem .2rem .25rem;font:inherit;font-size:.85rem;cursor:pointer;color:var(--ink);font-variant-numeric:tabular-nums}}
.chip[aria-pressed="true"]{{border-color:var(--ink)}}
.chip:focus-visible,nav.toc a:focus-visible,.next a:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
.st{{display:inline-block;font:600 .72rem var(--body);letter-spacing:.04em;text-transform:uppercase;border-radius:6px;padding:.18rem .45rem;white-space:nowrap}}
.st.ok{{color:var(--ok);background:var(--ok-bg)}}.st.part{{color:var(--part);background:var(--part-bg)}}.st.todo{{color:var(--todo);background:var(--todo-bg)}}.st.you{{color:var(--you);background:var(--you-bg)}}.st.later{{color:var(--later);background:var(--later-bg)}}
nav.toc{{display:none}}
@media(min-width:1000px){{nav.toc{{display:grid;gap:.15rem;position:sticky;top:calc(env(safe-area-inset-top,0px) + 1rem);padding-top:.5rem}}}}
nav.toc p{{font:600 .75rem var(--body);letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:0 0 .4rem}}
nav.toc a{{display:flex;gap:.6rem;color:var(--ink);text-decoration:none;font-size:.92rem;padding:.3rem .5rem;border-radius:8px}}
nav.toc a:hover{{background:var(--accent-bg)}}nav.toc a span{{color:var(--accent);font-weight:600;font-variant-numeric:tabular-nums}}
main{{display:grid;gap:2.4rem;min-width:0}}
.next{{background:var(--card);border:1.5px solid var(--accent);border-radius:16px;padding:1.3rem 1.4rem}}
.next h2{{font:400 1.7rem/1.1 var(--display);margin:0 0 .3rem}}.next>p{{margin:0 0 .9rem;color:var(--muted)}}
.next ol{{margin:0;padding-left:1.4rem;display:grid;gap:.55rem}}.next li{{padding-left:.2rem}}.next li .st{{margin-right:.5rem;vertical-align:1px}}
.next a{{color:var(--ink);text-decoration-color:var(--line);text-underline-offset:3px}}
section{{display:grid;gap:1rem;scroll-margin-top:1rem}}
.sh{{display:grid;grid-template-columns:auto 1fr auto;gap:.9rem;align-items:start;border-bottom:2px solid var(--ink);padding-bottom:.7rem}}
.num{{font:400 2.4rem/1 var(--display);color:var(--accent)}}
.sh h2{{font:400 clamp(1.5rem,3.5vw,2rem)/1.05 var(--display);margin:0;text-wrap:balance}}
.lead{{margin:.3rem 0 0;color:var(--muted);max-width:65ch}}
.prog{{font-size:.82rem;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums;padding-top:.3rem}}
@media(max-width:560px){{.sh{{grid-template-columns:auto 1fr}}.prog{{grid-column:2}}}}
ul.items{{list-style:none;margin:0;padding:0;display:grid;gap:.1rem}}
ul.items li{{display:grid;grid-template-columns:6.6rem 1fr;gap:.9rem;padding:.8rem .2rem;border-bottom:1px solid var(--line)}}
ul.items li .st{{justify-self:start;margin-top:.15rem}}
ul.items b{{font-weight:600}}ul.items p{{margin:.15rem 0 0;color:var(--muted);max-width:68ch}}
@media(max-width:560px){{ul.items li{{grid-template-columns:1fr;gap:.35rem}}}}
.st.imp,p.imp span{{color:var(--part);background:var(--part-bg)}}
ul.items p.imp{{margin-top:.5rem;color:var(--ink);border-left:3px solid var(--part);padding:.1rem 0 .1rem .6rem}}
p.imp span{{display:inline-block;font:600 .68rem var(--body);letter-spacing:.04em;text-transform:uppercase;border-radius:6px;padding:.1rem .4rem;margin-right:.45rem;vertical-align:1px}}
.hide{{display:none!important}}
footer{{grid-column:1/-1;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:1rem}}
@media(prefers-reduced-motion:no-preference){{html{{scroll-behavior:smooth}}}}
</style>
<div class="page">
<header class="top"><div class="in">
  <p class="kick">Espace 6M Lab · guide de travail</p>
  <h1>Guide du site 6M Lab</h1>
  <p>Tout ce qu'il faut pour un site qui vend bien des programmes de préparation physique handball : de l'offre à la mise en page, du référencement au marketing. Chaque point a son statut par rapport au site actuel. On le reprend chaque mois pour choisir les prochains chantiers.</p>
  <div class="legend">{legend}<small>{total} points · touche un statut pour filtrer</small></div>
</div></header>
<nav class="toc" aria-label="Sommaire"><p>Sommaire</p><a href="#priorites"><span>→</span>Par où commencer</a>{toc}</nav>
<main>
<div class="next" id="priorites"><h2>Par où commencer</h2><p>Les prochains chantiers, dans l'ordre. Les premiers dépendent de toi, et ils débloquent la mise en ligne.</p><ol>{nxt}</ol></div>
{"".join(secs)}
</main>
<footer>Mis à jour le {DATE}. Statuts : Fait = en place sur le site ; En partie = commencé, à compléter ; À faire = à faire ensemble ; De ta part = une décision, un texte ou une photo de toi ; Plus tard = quand il y aura du trafic ou des clients.</footer>
</div>
<script>
(function(){{
  var chips=[].slice.call(document.querySelectorAll('.chip')),on=null;
  chips.forEach(function(c){{c.addEventListener('click',function(){{
    on=on===c.dataset.f?null:c.dataset.f;
    chips.forEach(function(x){{x.setAttribute('aria-pressed',String(x.dataset.f===on))}});
    document.querySelectorAll('ul.items li').forEach(function(li){{li.classList.toggle('hide',!!on&&(on==='a'?!li.hasAttribute('data-a'):li.dataset.s!==on))}});
    document.querySelectorAll('main section').forEach(function(s){{s.classList.toggle('hide',!!on&&!s.querySelector('li:not(.hide)'))}});
  }})}});
}})();
</script>
'''
open(os.path.join(os.path.dirname(__file__), '..', 'private', 'docs', 'guide-site.html'), 'w').write(out)
missing = [h for h in IMPROVE if not any(h == t for _, _, _, it in SECTIONS for _, t, _ in it)]
assert not missing, missing
print(total, dict(cnt), len(IMPROVE), 'à améliorer')
