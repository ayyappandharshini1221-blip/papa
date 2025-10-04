
type Language = 'en' | 'ta';

const translations = {
  en: {
    studentDashboardTitle: "Let's Go, {name}!",
    studentDashboardSubtitle: "Time to crush some quizzes and climb the ranks.",
  },
  ta: {
    studentDashboardTitle: "போகலாம், {name}!",
    studentDashboardSubtitle: "வினாக்களை நசுக்கி, தரவரிசையில் ஏற வேண்டிய நேரம்.",
  },
};

export const getTranslation = (lang: Language, key: string): string => {
  return translations[lang][key as keyof typeof translations[Language]] || key;
};

    