import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTeam } from "@/context/TeamContext";
import MemberForm from "@/components/forms/MemberForm";
import MemberCard from "@/components/ui/MemberCard";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

const Member: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeamMember, deleteTeamMember, getDirectReports, teamMembers } =
    useTeam();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Handle new member creation
  const isNewMember = id === "new";

  if (isNewMember) {
    return (
      <div className="page-container max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Link
            to="/members"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux Membres
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border/60 p-6">
          <MemberForm
            onSuccess={() => navigate("/members")}
            onCancel={() => navigate("/members")}
          />
        </div>
      </div>
    );
  }

  // Get member data
  const member = getTeamMember(parseInt(id || "0"));

  if (!member) {
    return (
      <div className="page-container text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Membre Non Trouvé</h2>
        <p className="text-muted-foreground mb-6">
          Le membre de l'équipe que vous recherchez n'existe pas.
        </p>
        <Link
          to="/members"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour aux Membres
        </Link>
      </div>
    );
  }

  // Get manager
  const manager = member.managerId ? getTeamMember(member.managerId) : null;

  // Get direct reports
  const directReports = getDirectReports(member.id);

  // Handle delete
  const handleDelete = () => {
    deleteTeamMember(member.id);
    navigate("/members");
  };

  if (isEditing) {
    return (
      <div className="page-container max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour au Profil
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border/60 p-6">
          <MemberForm
            memberId={member.id}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <Link
          to="/members"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux Membres
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile image and basic info */}
        <div className="lg:col-span-1">
          <div className="glassmorphism rounded-xl overflow-hidden sticky top-20">
            <div className="aspect-square">
              <img
                src={member.imageUrl || "/placeholder.svg"}
                alt={`${member.firstname} ${member.lastname}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h1 className="text-xl font-semibold">
                {member.firstname} {member.lastname}
              </h1>
              <p className="text-muted-foreground mb-4">
                {member.jobDescription}
              </p>

              <div className="space-y-2">
                {member.professionnalEmail && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={`mailto:${member.professionnalEmail}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {member.professionnalEmail}
                    </a>
                  </div>
                )}

                {member.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{member.location.name}</span>
                  </div>
                )}

                {member.startDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Date d'entrée :{" "}
                      {new Date(Number(member.startDate)).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{member.department?.name}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 px-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </button>

                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="py-2 px-3 border border-destructive/30 text-destructive rounded-md hover:bg-destructive/10 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Detailed info and relationships */}
        <div className="lg:col-span-2 space-y-6">
          {/* Additional info section */}
          <div className="glassmorphism rounded-xl p-6 animate-fade-up">
            <h2 className="text-lg font-semibold mb-3">
              Informations Supplémentaires
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Genre</p>
                <p>
                  {member.gender || "Données non fournis, veuillez la saissir"}
                </p>
              </div>

              {/* <div>
                <p className="text-sm text-muted-foreground">
                  Date de naissance
                </p>
                {new Date(Number(member.birthday)).toLocaleDateString() ||
                  "Données non fournis, veuillez la saissir"}
              </div> */}

              <div>
                <p className="text-sm text-muted-foreground">
                  Numéro de téléphone
                </p>
                <p>
                  {member.phoneNumber ||
                    "Données non fournis, veuillez la saissir"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Matricule Agent</p>
                <p>{member.serviceAssignmentCode}</p>
              </div>

              {/*  Management Category NOT USED
              <div>
                <p className="text-sm text-muted-foreground">
                  Management Category
                </p>
                <p>{member.managementCategory}</p>
              </div>
              */}
            </div>
          </div>

          {/* Manager section */}
          {manager && (
            <div
              className="glassmorphism rounded-xl p-6 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="text-lg font-semibold mb-3">Manager</h2>
              <MemberCard member={manager} variant="compact" />
            </div>
          )}

          {/* Direct reports section */}
          {directReports.length > 0 && (
            <div
              className="glassmorphism rounded-xl p-6 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <h2 className="text-lg font-semibold mb-3">
                Subordonnées ({directReports.length})
              </h2>
              <div className="space-y-3">
                {directReports.map((report) => (
                  <MemberCard
                    key={report.id}
                    member={report}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="bg-destructive/10 p-2 rounded-full mr-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">
                Confirmer la Suppression
              </h3>
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>
                {member.firstname} {member.lastname}
              </strong>
              ? Cette action ne peut être annulée.
            </p>

            {directReports.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                <p className="text-amber-800 font-medium mb-1">Avertissement</p>
                <p className="text-amber-700">
                  This member has {directReports.length} rapport direct
                  {directReports.length !== 1 && "s"}. Leurs rapports directs
                  seront être réaffecté à{" "}
                  {member.managerId ? "this member's manager" : "aucun manager"}
                  .
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                Annuler
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
