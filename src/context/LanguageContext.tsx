
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
    teamHighlights: 'Team Highlights',
    viewAll: 'View all',
    teamManagement: 'Team Management',
    manageYourTeam: 'Manage Your Team',
    addNewMember: 'Add New Member',
    organizationChart: 'Organization Chart',
    teamMembers: 'Team Members',
    searchMembers: 'Search members...',
    allDepartments: 'All Departments',
    noMembersFound: 'No members found matching your search criteria.',
    exploreTeamStructure: 'Explore your team\'s structure and relationships. Select multiple departments to compare teams.',
    filterDepartments: 'Filter Departments:',
    clearAll: 'Clear All',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset Zoom',
    scrollLeft: 'Scroll Left',
    scrollRight: 'Scroll Right',
    trombinoscope: 'Trombinoscope',
    teamHighlightsDescription: 'Simplify your team management with our interactive organization chart. View team hierarchies, member profiles, and manage your organization with ease.',
    addMemberDescription: 'Add new team members, update existing profiles, or view your organization chart.',
    browseAllMembers: 'Browse All Members',
    viewOrgChart: 'View Org Chart',
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
    teamHighlights: 'Équipe en vedette',
    viewAll: 'Voir tout',
    teamManagement: 'Gestion d\'équipe',
    manageYourTeam: 'Gérez votre équipe',
    addNewMember: 'Ajouter un membre',
    organizationChart: 'Organigramme',
    teamMembers: 'Membres de l\'équipe',
    searchMembers: 'Rechercher des membres...',
    allDepartments: 'Tous les départements',
    noMembersFound: 'Aucun membre ne correspond à vos critères de recherche.',
    exploreTeamStructure: 'Explorez la structure et les relations de votre équipe. Sélectionnez plusieurs départements pour comparer les équipes.',
    filterDepartments: 'Filtrer les départements:',
    clearAll: 'Tout effacer',
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    resetZoom: 'Réinitialiser',
    scrollLeft: 'Défiler à gauche',
    scrollRight: 'Défiler à droite',
    trombinoscope: 'Trombinoscope',
    teamHighlightsDescription: 'Simplifiez la gestion de votre équipe avec notre organigramme interactif. Visualisez les hiérarchies d\'équipe, les profils des membres et gérez votre organisation facilement.',
    addMemberDescription: 'Ajoutez de nouveaux membres à l\'équipe, mettez à jour les profils existants ou visualisez votre organigramme.',
    browseAllMembers: 'Parcourir tous les membres',
    viewOrgChart: 'Voir l\'organigramme',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    } else {
      // Use browser language as fallback
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') {
        setLanguage('fr');
        localStorage.setItem('language', 'fr');
      }
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    // Type assertion to make TypeScript happy
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
