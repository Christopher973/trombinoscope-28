import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTeam } from "@/context/TeamContext";
import MemberCard from "@/components/ui/MemberCard";
import { User, GitBranchPlus, Plus } from "lucide-react";

const Index = () => {
  const { teamMembers } = useTeam();

  // Trier les membres par startDate décroissante (plus récente d'abord)
  const featuredMembers = useMemo(() => {
    // Créer une copie pour éviter de modifier l'original
    return [...teamMembers]
      .sort((a, b) => {
        // Convertir les dates en objets Date si nécessaire
        const dateA =
          a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
        const dateB =
          b.startDate instanceof Date ? b.startDate : new Date(b.startDate);

        // Trier par ordre décroissant (plus récent d'abord)
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 12); // Prendre les 12 premiers après tri
  }, [teamMembers]);

  return (
    <div className="page-container">
      {/* Hero section */}
      <section className="py-20 flex flex-col items-center text-center animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Hiéraflow</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Simplifiez la gestion de votre équipe avec notre organigramme
          interactif. Affichez les hiérarchies d'équipe, les profils de membres
          et gérez votre organisation avec facilité.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/members"
            className="py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <User className="h-5 w-5" />
            Parcourir Tous les Membres
          </Link>
          <Link
            to="/org-chart"
            className="py-2 px-4 bg-white border border-border rounded-md shadow-sm hover:bg-secondary/50 transition-colors flex items-center gap-2"
          >
            <GitBranchPlus className="h-5 w-5" />
            Voir le tableau Org
          </Link>
        </div>
      </section>

      {/* Featured members section */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading">Derniers arrivants dans l'équipe</h2>
          <Link
            to="/members"
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Admin actions */}
      <section className="py-12">
        <h2 className="section-heading">Gestion d'Équipe</h2>
        <div className="glassmorphism rounded-xl p-6 md:p-8 animate-scale-in">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Gérer Votre Équipe</h3>
              <p className="text-muted-foreground">
                Ajouter de nouveaux membres d'équipe, mettre à jour les profils
                existants ou afficher organigramme.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/members/new"
                className="py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Ajouter un Nouveau Membre
              </Link>
              <Link
                to="/org-chart"
                className="py-2 px-4 bg-white border border-border rounded-md shadow-sm hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2"
              >
                <GitBranchPlus className="h-5 w-5" />
                Organigramme
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
