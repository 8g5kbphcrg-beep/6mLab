import { goalIds, goalName, REATH } from "@/lib/goals";

export const quiz = {
  fr: {
    title: "Trouve ton programme",
    intro: "Quelques questions rapides. Tes réponses ne sont pas enregistrées.",
    q: "Question", of: "sur", back: "Retour", restart: "Recommencer",
    steps: [
      { q: "Où en es-tu dans la saison ?", o: ["Avant la saison", "En pleine saison"] },
      { q: "Quel est ton premier objectif ?", o: [...goalIds, REATH].map((g) => goalName(g, "fr")) },
      { q: "Et ton deuxième objectif ?", o: goalIds.map((g) => goalName(g, "fr")) },
      { q: "Quel est ton niveau en préparation physique ?", o: ["Je débute", "J'ai quelques bases", "J'ai de l'expérience"] },
      { q: "Où t'entraînes-tu ?", o: ["À la maison, sans matériel", "À la maison, avec petit matériel", "En salle de sport"] },
      { q: "Combien de séances par semaine peux-tu ajouter à ton club ?", o: ["2", "3", "4"] },
      { q: "As-tu une blessure ou une douleur en ce moment ?", o: ["Non", "Oui"] },
    ],
    labels: ["Moment", "Objectif 1", "Objectif 2", "Niveau", "Lieu", "Séances par semaine"],
    result: "Ton programme recommandé", summary: "Tes réponses",
    notes: ["Cette formule compte 3 séances par semaine, plus une séance bonus facultative. Avec 2 séances disponibles, tu la suivras plus lentement.", "Cette formule prévoit 2 séances courtes par semaine, pensées pour garder de la fraîcheur avant les matchs."],
    hurt: { t: "Demande d'abord un avis médical", p: "Avec une blessure ou une douleur, le mieux est de consulter un professionnel de santé avant de commencer un programme. Aucune formule n'est recommandée dans ce cas. Une fois que ton médecin t'a donné le feu vert pour reprendre, le programme Réathlétisation est fait pour ça." },
    diet: "Nos programmes portent sur l'entraînement, sans plan alimentaire.",
  },
  en: {
    title: "Find your program",
    intro: "A few quick questions. Your answers are not saved.",
    q: "Question", of: "of", back: "Back", restart: "Start over",
    steps: [
      { q: "Where are you in the season?", o: ["Before the season", "During the season"] },
      { q: "What is your first goal?", o: [...goalIds, REATH].map((g) => goalName(g, "en")) },
      { q: "And your second goal?", o: goalIds.map((g) => goalName(g, "en")) },
      { q: "What is your level in physical training?", o: ["Beginner", "Intermediate", "Advanced"] },
      { q: "Where do you train?", o: ["At home, no equipment", "At home, small equipment", "At the gym"] },
      { q: "How many sessions per week can you add to your club training?", o: ["2", "3", "4"] },
      { q: "Do you have an injury or pain right now?", o: ["No", "Yes"] },
    ],
    labels: ["Moment", "Goal 1", "Goal 2", "Level", "Place", "Sessions per week"],
    result: "Your recommended program", summary: "Your answers",
    notes: ["This program has 3 sessions per week, plus an optional bonus session. With 2 sessions available, you will follow it more slowly.", "This program has 2 short sessions per week, designed to keep you fresh for matches."],
    hurt: { t: "Get medical advice first", p: "With an injury or pain, it is best to see a health professional before starting a program. No program is recommended in this case. Once your doctor has cleared you to play again, the return-to-play program is built for that." },
    diet: "Our programs cover training only, with no meal plans.",
  },
};
