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
 ("you", "Une garantie claire", "« Satisfait ou remboursé » ou pas, et sur combien de jours. Le PDF reste au client ; seul l'accès aux animations s'arrête. C'est un des leviers de confiance les plus forts avant un premier achat."),
 ("you", "Ce qui te rend unique, dit en une phrase", "Ton expérience de joueur, de coach, de préparateur, tes diplômes. À écrire en une phrase réutilisée partout : accueil, À propos, réseaux, emails."),
]),
("structure", "Structure et navigation", "Chaque visiteur doit trouver son chemin sans réfléchir.", [
 ("ok", "Un menu court", "Quelques entrées seulement : Programmes, Exercices, Conseils, Clubs, À propos. Le reste est dans le pied de page."),
 ("ok", "Un parcours d'achat en peu de clics", "Accueil, puis questionnaire ou programme, puis paiement. Le questionnaire oriente vers le bon programme."),
 ("ok", "Un pied de page complet", "Mentions légales, CGV, confidentialité, contact, changement de langue."),
 ("ok", "Une recherche dans la bibliothèque d'exercices", "Recherche et familles d'exercices (dont Gardiens de but)."),
 ("ok", "Une page d'erreur 404 utile", "Une adresse fausse affiche une page 6M Lab (« Tir hors cadre ») qui renvoie vers le questionnaire, la séance gratuite et les programmes."),
 ("ok", "Une FAQ générale", "18 questions en 4 thèmes (choisir, commande et accès, clubs, contact), en français et en anglais, lisibles par Google. Lien dans le pied de page."),
]),
("design", "Design et mise en page", "Le site doit paraître aussi sérieux que le contenu des programmes.", [
 ("ok", "Une identité cohérente", "Logo, couleurs, typographies et ton identiques sur le site, les PDF, les emails et l'admin."),
 ("ok", "Pensé d'abord pour le téléphone", "La plupart des joueurs arrivent depuis Instagram ou TikTok, sur mobile. Toutes les pages sont vérifiées à la largeur d'un téléphone."),
 ("ok", "Un bouton principal par écran", "Chaque section mène vers une seule action évidente : questionnaire, programme ou devis."),
 ("part", "Un site vivant et dynamique (objectif)", "Donner du mouvement sans refaire le site. Fait : blocs qui apparaissent en glissant au défilement, cartes qui se soulèvent au survol, boutons qui réagissent au toucher, bande défilante des objectifs sous l'accueil, animations d'exercices qui démarrent quand on les voit (et se mettent en pause hors écran), fondu entre les pages, bandeau du haut qui se resserre au défilement, réponses de la FAQ qui s'ouvrent en douceur. À suivre : chiffres qui s'animent (joueurs accompagnés, avis) quand il y en aura, courtes vidéos. Toujours désactivé si le téléphone demande moins d'animations."),
 ("ok", "Montrer le produit", "PDF qui se feuillette, animations d'exercices, aperçu de la séance gratuite."),
 ("you", "De vraies photos", "Des photos de toi sur le terrain et de joueurs à l'entraînement, avec leur accord. C'est ce qui manque le plus pour que le site paraisse humain et crédible."),
 ("ok", "Accessibilité", "Audit complet (axe, normes WCAG 2.1 AA) sur 25 pages, en clair et en sombre, sur téléphone et ordinateur : zéro erreur. Navigation au clavier vérifiée, repère visible sur chaque élément, animations coupées si le téléphone le demande. À refaire après chaque grosse modification."),
]),
("contenu", "Contenu et textes", "Des textes qui parlent de ce que le joueur gagne, avec les mots du handball.", [
 ("ok", "Des bénéfices avant les caractéristiques", "« Arriver prêt à la reprise, sans blessure » plutôt que « 12 séances de renforcement »."),
 ("ok", "Des pages programme détaillées", "Pour qui, combien de temps, quel matériel, déroulé d'une semaine, FAQ, aperçu du PDF."),
 ("ok", "Le vocabulaire du handball", "Induction, repli, montée, poste, ligne des 9 m : le lecteur doit se sentir chez lui."),
 ("ok", "Français et anglais", "Site, programmes PDF, emails et animations dans les deux langues."),
 ("part", "Des articles de conseils réguliers", "La rubrique Conseils existe, avec des études résumées et leurs sources. À faire : un rythme régulier (par exemple 2 articles par mois) calé sur la saison."),
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
 ("ok", "Page de remerciement et email de confirmation", "Le client sait tout de suite quoi faire : PDF joint, accès aux animations, rappel avant le début."),
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
 ("ok", "Données structurées", "Produits (programmes, prix) et articles sont décrits pour Google."),
 ("part", "Des pages pour chaque recherche importante", "Déjà : page Handball, Clubs, bibliothèque d'exercices, conseils. À ajouter : « préparation physique handball pré-saison », « exercices gardien de but handball », « prévention blessures handball »…"),
 ("todo", "Des liens depuis d'autres sites", "Clubs, comités, ligues, kinés, blogs de handball qui parlent de 6M Lab avec un lien. Ça vient avec les partenariats."),
]),
("technique", "Technique et performance", "Un site rapide, fiable, et qui envoie ses emails.", [
 ("ok", "Hébergement fiable et HTTPS", "Vercel, avec un aperçu pour chaque modification avant de la valider."),
 ("ok", "Sauvegarde du site", "Tout le code et les documents sont sur GitHub : rien ne se perd."),
 ("part", "Vitesse", "Pages légères et images optimisées. À mesurer sur mobile après la mise en ligne (PageSpeed Insights), puis corriger ce qui ralentit."),
 ("todo", "Emails envoyés depuis ton domaine", "Adresse du type contact@ton-domaine, avec les réglages SPF, DKIM et DMARC pour que les emails n'arrivent pas en spam."),
 ("part", "Surveiller les erreurs", "Les erreurs sont visibles dans les journaux Vercel. À faire : une alerte par email si un paiement ou un envoi de programme échoue."),
]),
("legal", "Légal et conformité", "Vendre en règle, surtout à des mineurs et pour du sport.", [
 ("ok", "CGV, confidentialité, mentions légales", "Les trois pages existent, en français et en anglais."),
 ("you", "Compléter les mentions légales", "Nom, SIRET, adresse et médiateur de la consommation. Obligatoire avant de vendre pour de vrai."),
 ("ok", "Droit de rétractation", "L'acheteur accepte les CGV et renonce à la rétractation une fois le programme envoyé, au moment du paiement."),
 ("ok", "Mineurs et santé", "Accord d'un parent pour un mineur, conseil de consulter un médecin, arrêt en cas de douleur : c'est écrit dans les CGV et les programmes."),
 ("ok", "Pas de cookie publicitaire", "La mesure d'audience est anonyme et sans cookie : pas de bandeau à afficher."),
 ("ok", "Mention TVA", "« TVA non applicable, article 293 B du CGI » dans les mentions et les CGV. À vérifier avec ton statut."),
]),
("marketing", "Marketing et acquisition", "Faire venir les bonnes personnes, régulièrement, sans dépendre de la publicité.", [
 ("ok", "Un cadeau d'entrée : la séance gratuite", "Elle récolte des emails de joueurs intéressés, en français et en anglais."),
 ("ok", "Des emails aux bons moments de la saison", "Reprise, trêve, fin de saison : les inscrits reçoivent le bon message au bon moment."),
 ("ok", "Savoir d'où viennent les visiteurs", "Instagram, TikTok, Google, liens de clubs : chaque visite et chaque vente est rattachée à sa source."),
 ("you", "Instagram et TikTok réguliers", "Les animations d'exercices, des conseils courts, des extraits de séances. 3 publications par semaine, chacune avec un lien suivi."),
 ("you", "Un calendrier de communication calé sur la saison", "Juin-juillet : pré-saison. Septembre : reprise. Décembre : trêve. Mai : fin de saison et coupure."),
 ("todo", "Parrainage", "Un code à partager : le filleul a une réduction, le parrain aussi. Idéal entre coéquipiers."),
 ("you", "Partenariats", "Clubs, coachs, kinés, magasins de sport : un lien, un code promo dédié, et le suivi des ventes par partenaire."),
 ("later", "Publicité payante", "Seulement quand le site convertit bien et a des avis. Petits budgets, ciblés sur les parents et les joueurs, en période de reprise."),
]),
("fidelisation", "Après l'achat et fidélisation", "Un client content revient et en parle.", [
 ("ok", "Accès aux animations et PDF gardé à vie", "Le client garde son PDF ; les animations restent accessibles pendant la durée prévue."),
 ("ok", "Questionnaire de forme et avis", "Le client suit sa forme, laisse un avis et reçoit un code de réduction."),
 ("part", "Proposer la suite", "À la fin d'un programme, proposer le suivant : saison après pré-saison, prévention en fin de saison. Les emails de saison le font en partie."),
 ("todo", "Répondre vite", "Un délai de réponse annoncé et tenu (par exemple 48 h), et une réponse type pour les questions fréquentes."),
]),
("clubs", "Offre Clubs", "Un autre public, qui décide autrement : il faut rassurer et faciliter.", [
 ("ok", "Une page dédiée", "Bénéfices, séance type, ce qu'il faut savoir, exemple d'exercice animé."),
 ("ok", "Un devis structuré", "Catégorie, niveau, joueurs de champ et gardiens, installations, matériel ; acquis à confirmer."),
 ("ok", "Tes outils de réponse", "Méthode Clubs, exemple U18, dossier Gardiens et fiche de suivi, dans l'admin."),
 ("todo", "Code d'accès aux animations pour les clubs", "Pour que l'œil des PDF clubs ouvre les animations."),
 ("todo", "Sortie des programmes clubs en PDF", "Produire les 4 documents d'un devis directement en PDF."),
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
 ("you", "Décider de la garantie", "offre"),
 ("you", "Faire tester 5 à 10 joueurs et un club pour avoir les premiers avis", "confiance"),
 ("todo", "Mise en ligne : domaine, emails du domaine, ouverture à Google, Search Console, Stripe en mode réel", "seo"),
 ("part", "Rendre le site plus dynamique, étape par étape", "design"),
 ("you", "Lancer Instagram et TikTok avec les animations d'exercices", "marketing"),
 ("todo", "Ajouter le parrainage", "marketing"),
]
from collections import Counter
MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
_d = datetime.date.today(); DATE = f'{_d.day} {MOIS[_d.month-1]} {_d.year}'
cnt = Counter(s for _, _, _, items in SECTIONS for s, _, _ in items)
total = sum(cnt.values())
e = html.escape
def pill(s): return f'<span class="st {s}">{S[s]}</span>'
toc = "".join(f'<a href="#{sid}"><span>{i:02d}</span>{e(t)}</a>' for i, (sid, t, _, _) in enumerate(SECTIONS, 1))
secs = []
for i, (sid, t, lead, items) in enumerate(SECTIONS, 1):
    c = Counter(s for s, _, _ in items)
    done = c["ok"]
    lis = "".join(f'<li data-s="{s}">{pill(s)}<div><b>{e(h)}</b><p>{e(p)}</p></div></li>' for s, h, p in items)
    secs.append(f'<section id="{sid}"><div class="sh"><span class="num">{i:02d}</span><div><h2>{e(t)}</h2><p class="lead">{e(lead)}</p></div><span class="prog">{done}/{len(items)} faits</span></div><ul class="items">{lis}</ul></section>')
nxt = "".join(f'<li>{pill(s)}<a href="#{sec}">{e(t)}</a></li>' for s, t, sec in NEXT)
legend = "".join(f'<button type="button" class="chip" data-f="{k}" aria-pressed="false">{pill(k)}<b>{cnt[k]}</b></button>' for k in S)
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
    document.querySelectorAll('ul.items li').forEach(function(li){{li.classList.toggle('hide',!!on&&li.dataset.s!==on)}});
    document.querySelectorAll('main section').forEach(function(s){{s.classList.toggle('hide',!!on&&!s.querySelector('li:not(.hide)'))}});
  }})}});
}})();
</script>
'''
open(os.path.join(os.path.dirname(__file__), '..', 'private', 'docs', 'guide-site.html'), 'w').write(out)
print(total, dict(cnt))
