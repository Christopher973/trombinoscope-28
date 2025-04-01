import React, { createContext, useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_TEAM_MEMBERS,
  GET_DEPARTMENTS,
  GET_LOCATIONS,
  CREATE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER,
  IMPORT_TEAM_MEMBERS,
  UPLOAD_MEMBER_IMAGE,
} from "../api/graphql/queries";

// Types à adapter selon vos besoins actuels
interface TeamContextType {
  teamMembers: any[];
  departments: any[];
  locations: any[];
  loading: boolean;
  error: any;
  createTeamMember: (data: any) => Promise<any>;
  updateTeamMember: (id: number, data: any) => Promise<any>;
  deleteTeamMember: (id: number) => Promise<any>;
  importTeamMembers: (members: any[]) => Promise<any>;
  getTeamMember: (id: number) => any;
  getDirectReports: (managerId: number) => any[];
  importTeamMembersFromCSV: (csvText: string) => Promise<{ imported: number }>;
  uploadImage: (base64Image: string) => Promise<string>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Récupération des données
  const {
    data: teamMembersData,
    loading: membersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery(GET_TEAM_MEMBERS);
  const { data: departmentsData, loading: deptsLoading } =
    useQuery(GET_DEPARTMENTS);
  const { data: locationsData, loading: locsLoading } = useQuery(GET_LOCATIONS);

  // Mutations
  const [createTeamMemberMutation] = useMutation(CREATE_TEAM_MEMBER);
  const [updateTeamMemberMutation] = useMutation(UPDATE_TEAM_MEMBER);
  const [deleteTeamMemberMutation] = useMutation(DELETE_TEAM_MEMBER);
  const [importTeamMembersMutation] = useMutation(IMPORT_TEAM_MEMBERS);

  // États locaux pour le cache optimiste
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Mise à jour des états locaux quand les données GraphQL sont chargées
  useEffect(() => {
    if (teamMembersData?.teamMembers) {
      setTeamMembers(teamMembersData.teamMembers);
    }
    if (departmentsData?.departments) {
      setDepartments(departmentsData.departments);
    }
    if (locationsData?.locations) {
      setLocations(locationsData.locations);
    }
  }, [teamMembersData, departmentsData, locationsData]);

  // Fonctions d'interaction avec l'API
  const createTeamMember = async (data: any) => {
    try {
      const { data: result } = await createTeamMemberMutation({
        variables: { data },
        refetchQueries: [{ query: GET_TEAM_MEMBERS }],
      });
      return result.createTeamMember;
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  };

  const updateTeamMember = async (id: number, data: any) => {
    try {
      const { data: result } = await updateTeamMemberMutation({
        variables: { id, data },
        refetchQueries: [{ query: GET_TEAM_MEMBERS }],
      });
      return result.updateTeamMember;
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error;
    }
  };

  const deleteTeamMember = async (id: number) => {
    try {
      const { data: result } = await deleteTeamMemberMutation({
        variables: { id },
        refetchQueries: [{ query: GET_TEAM_MEMBERS }],
      });
      return result.deleteTeamMember;
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw error;
    }
  };

  const importTeamMembers = async (members: any[]) => {
    try {
      const { data: result } = await importTeamMembersMutation({
        variables: { members },
        refetchQueries: [{ query: GET_TEAM_MEMBERS }],
      });
      return result.importTeamMembers;
    } catch (error) {
      console.error("Error importing team members:", error);
      throw error;
    }
  };

  const importTeamMembersFromCSV = async (csvText: string) => {
    try {
      // Déterminer le séparateur (virgule ou point-virgule)
      const firstLine = csvText.trim().split("\n")[0];
      // Vérifier quel séparateur est le plus utilisé dans la première ligne
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semicolonCount = (firstLine.match(/;/g) || []).length;
      const separator = semicolonCount > commaCount ? ";" : ",";

      console.log(`Séparateur CSV détecté: "${separator}"`);

      // Analyser le CSV
      const lines = csvText.trim().split("\n");
      const headers = lines[0].split(separator).map((h) => h.trim());

      // Première étape: Créer un mapping temporaire entre email et membre
      const emailToMemberMap = new Map();
      const members = [];
      const managerRelations = []; // Stocke les relations manager-subordonné

      // Récupérer tous les départements et localisations pour la résolution des noms
      const departmentsMap = new Map();
      const locationsMap = new Map();

      // Créer des maps nom -> id pour faciliter la recherche
      departments.forEach((dept) => {
        departmentsMap.set(dept.name.toLowerCase(), dept.id);
      });

      locations.forEach((loc) => {
        locationsMap.set(loc.name.toLowerCase(), loc.id);
      });

      // Parcourir chaque ligne (sauf l'en-tête)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(separator).map((v) => v.trim());

        if (
          values.length === 1 &&
          line.includes(separator === "," ? ";" : ",")
        ) {
          // Cette ligne utilise probablement un séparateur différent de celui détecté
          const alternateSeparator = separator === "," ? ";" : ",";
          console.warn(
            `Ligne ${i} utilise un séparateur différent (${alternateSeparator}), tentative de parsing alternatif...`
          );
          const alternativeValues = line
            .split(alternateSeparator)
            .map((v) => v.trim());
          if (alternativeValues.length >= headers.length) {
            // Si le parsing alternatif donne plus de colonnes, utilisez celui-ci
            console.log(`Parsing alternatif réussi pour la ligne ${i}`);
            values.splice(0, values.length, ...alternativeValues);
          }
        }

        const rawMember = {};

        // Mapper les valeurs aux propriétés
        for (let j = 0; j < Math.min(headers.length, values.length); j++) {
          const key = headers[j];
          let value = values[j];

          // Convertir les valeurs numériques (sauf managerId qui sera géré séparément)
          if (key === "departmentId" || key === "locationId") {
            value = value ? parseInt(value) : null;
          }

          rawMember[key] = value;
        }

        // Créer un membre sans managerId
        const member = {
          firstname: rawMember.firstName || rawMember.firstname,
          lastname: rawMember.lastName || rawMember.lastname,
          professionnalEmail:
            rawMember.professionnalEmail ||
            rawMember.professionalemail ||
            rawMember.email,
          phoneNumber: rawMember.phoneNumber,
          jobDescription: rawMember.jobDescription,
          managementCategory:
            rawMember.managementCategory || "Individual Contributor",
          serviceAssignmentCode: rawMember.serviceAssignmentCode || `EMP-${i}`,
          gender: rawMember.gender,
          departmentId: null,
          locationId: null,
          imageUrl: rawMember.imageUrl || rawMember.photo,
          birthday: rawMember.birthday || rawMember.birthDate,
          startDate:
            rawMember.startDate || new Date().toISOString().split("T")[0],
          // Ne pas inclure managerId pour l'instant
        };

        // Résolution du département (soit par ID soit par nom)
        if (rawMember.departmentId) {
          member.departmentId = parseInt(rawMember.departmentId);
        } else if (rawMember.department || rawMember.departmentName) {
          const deptName = (
            rawMember.department || rawMember.departmentName
          ).toLowerCase();
          member.departmentId = departmentsMap.get(deptName) || null;
          if (!member.departmentId) {
            console.warn(
              `Département non trouvé: ${
                rawMember.department || rawMember.departmentName
              }`
            );
          }
        }

        // Résolution de la localisation (soit par ID soit par nom)
        if (rawMember.locationId) {
          member.locationId = parseInt(rawMember.locationId);
        } else if (rawMember.location || rawMember.locationName) {
          const locName = (
            rawMember.location || rawMember.locationName
          ).toLowerCase();
          member.locationId = locationsMap.get(locName) || null;
          if (!member.locationId) {
            console.warn(
              `Localisation non trouvée: ${
                rawMember.location || rawMember.locationName
              }`
            );
          }
        }

        // Stocker la relation manager-subordonné pour traitement ultérieur
        if (rawMember.managerEmail) {
          managerRelations.push({
            subordinateEmail: member.professionnalEmail,
            managerEmail: rawMember.managerEmail,
          });
        } else if (rawMember.managerId) {
          // Si c'est un ID numérique, le conserver pour mise à jour ultérieure
          managerRelations.push({
            subordinateEmail: member.professionnalEmail,
            managerId: parseInt(rawMember.managerId),
          });
        }

        // Vérifier les champs obligatoires
        if (member.firstname && member.lastname && member.professionnalEmail) {
          members.push(member);
          emailToMemberMap.set(member.professionnalEmail, member);
        } else {
          console.warn(
            `Ligne ${i} ignorée : données obligatoires manquantes`,
            rawMember
          );
        }

        const notFoundDepartments = new Set();
        const notFoundLocations = new Set();

        members.forEach((member) => {
          // Vérifier si des erreurs de résolution de département se sont produites
          if (member._originalDepartmentName && !member.departmentId) {
            notFoundDepartments.add(member._originalDepartmentName);
          }

          // Vérifier si des erreurs de résolution de localisation se sont produites
          if (member._originalLocationName && !member.locationId) {
            notFoundLocations.add(member._originalLocationName);
          }

          // Supprimer les champs temporaires avant l'envoi à l'API
          delete member._originalDepartmentName;
          delete member._originalLocationName;
        });

        // Afficher un avertissement si des départements ou localisations n'ont pas été trouvés
        if (notFoundDepartments.size > 0) {
          console.warn(
            `Départements non trouvés: ${Array.from(notFoundDepartments).join(
              ", "
            )}`
          );
        }

        if (notFoundLocations.size > 0) {
          console.warn(
            `Localisations non trouvées: ${Array.from(notFoundLocations).join(
              ", "
            )}`
          );
        }
      }

      // Étape 1: Importer tous les membres sans relations hiérarchiques
      const createdMembers = await importTeamMembers(members);

      // Créer un mapping email -> ID pour les membres créés
      const emailToIdMap = new Map();
      createdMembers.forEach((member) => {
        emailToIdMap.set(member.professionnalEmail, member.id);
      });

      // Étape 2: Mettre à jour les relations manager-subordonné
      const updates = [];
      for (const relation of managerRelations) {
        const subordinateId = emailToIdMap.get(relation.subordinateEmail);
        let managerId;

        // Obtenir le managerId soit directement, soit via email
        if (relation.managerEmail) {
          managerId = emailToIdMap.get(relation.managerEmail);
          console.log(
            `Résolution de manager: ${relation.managerEmail} -> ${managerId}`
          );
        } else if (relation.managerId) {
          managerId = relation.managerId;
          console.log(`Utilisation de managerId direct: ${managerId}`);
        }

        // Vérifier que les IDs sont valides avant de mettre à jour
        if (subordinateId && managerId) {
          console.log(
            `Mise à jour du membre ${subordinateId} avec le manager ${managerId}`
          );
          updates.push(updateTeamMember(subordinateId, { managerId }));
        } else {
          console.warn(
            `Relation ignorée: subordonné=${relation.subordinateEmail} (ID=${subordinateId}), ` +
              `manager=${
                relation.managerEmail || relation.managerId
              } (ID=${managerId})`
          );
        }
      }

      // Attendre que toutes les mises à jour soient terminées
      if (updates.length > 0) {
        await Promise.all(updates);
        console.log(`${updates.length} relations managériales mises à jour`);
      }

      return { imported: members.length };
    } catch (error) {
      console.error("Error parsing CSV:", error);
      throw new Error("Failed to parse CSV file. Please check the format.");
    }
  };

  const getTeamMember = (id: number) => {
    return teamMembers.find((member) => member.id === id) || null;
  };

  const getDirectReports = (managerId: number) => {
    return teamMembers.filter((member) => member.managerId === managerId) || [];
  };

  const [uploadMemberImage] = useMutation(UPLOAD_MEMBER_IMAGE);

  const uploadImage = async (base64Image: string) => {
    try {
      const { data } = await uploadMemberImage({
        variables: { imageData: base64Image },
      });
      return data.uploadMemberImage.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const loading = membersLoading || deptsLoading || locsLoading;
  const error = membersError;

  return (
    <TeamContext.Provider
      value={{
        teamMembers,
        departments,
        locations,
        loading,
        error,
        createTeamMember,
        updateTeamMember,
        deleteTeamMember,
        importTeamMembers,
        getTeamMember,
        getDirectReports,
        importTeamMembersFromCSV,
        uploadImage,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
