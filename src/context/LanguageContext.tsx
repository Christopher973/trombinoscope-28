
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    home: 'Home',
    members: 'Members',
    orgChart: 'Org Chart',
    language: 'Language',
    english: 'English',
    french: 'French',
    theme: 'Theme',
    defaultTheme: 'Default',
    lightTheme: 'Light',
    darkTheme: 'Dark',
  },
  fr: {
    home: 'Accueil',
    members: 'Membres',
    orgChart: 'Organigramme',
    language: 'Langue',
    english: 'Anglais',
    french: 'Français',
    theme: 'Thème',
    defaultTheme: 'Par défaut',
    lightTheme: 'Clair',
    darkTheme: 'Sombre',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
