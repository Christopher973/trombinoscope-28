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

  const importTeamMembersFromCSV = async (
    csvText: string
  ): Promise<{ imported: number }> => {
    try {
      // Déterminer le séparateur (virgule ou point-virgule)
      const firstLine = csvText.trim().split("\n")[0];
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semicolonCount = (firstLine.match(/;/g) || []).length;
      const separator = semicolonCount > commaCount ? ";" : ",";

      console.log(`Séparateur CSV détecté: "${separator}"`);

      // Analyser le CSV
      const lines = csvText.trim().split("\n");
      const headers = lines[0]
        .split(separator)
        .map((h) => h.trim().toLowerCase());

      // Structures pour stocker les données et relations
      const members = [];
      const managerRelations = [];

      // Maps pour résolution des départements et locations
      const departmentsMap = new Map();
      const locationsMap = new Map();

      // Préparer les maps pour recherche
      departments.forEach((dept) => {
        departmentsMap.set(dept.name.toLowerCase(), dept.id);
      });

      locations.forEach((loc) => {
        locationsMap.set(loc.name.toLowerCase(), loc.id);
      });

      // Traiter chaque ligne du CSV
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(separator).map((v) => v.trim());

        // Vérifier si la ligne utilise un séparateur différent
        if (
          values.length === 1 &&
          line.includes(separator === "," ? ";" : ",")
        ) {
          const alternateSeparator = separator === "," ? ";" : ",";
          console.warn(
            `Ligne ${i} utilise un séparateur différent (${alternateSeparator}), tentative de parsing alternatif...`
          );
          const alternativeValues = line
            .split(alternateSeparator)
            .map((v) => v.trim());
          if (alternativeValues.length >= headers.length) {
            values.splice(0, values.length, ...alternativeValues);
          }
        }

        // Créer l'objet membre depuis les valeurs CSV
        const rawMember = {};
        for (let j = 0; j < Math.min(headers.length, values.length); j++) {
          rawMember[headers[j]] = values[j];
        }

        // Créer un membre avec les champs requis
        const member = {
          firstname: rawMember["firstname"] || rawMember["firstName"] || "",
          lastname: rawMember["lastname"] || rawMember["lastName"] || "",
          professionnalEmail:
            rawMember["professionnalemail"] || rawMember["email"] || "",
          phoneNumber: rawMember["phonenumber"] || "",
          jobDescription: rawMember["jobdescription"] || rawMember["job"] || "",
          managementCategory:
            rawMember["managementcategory"] || "Individual Contributor",
          serviceAssignmentCode:
            rawMember["serviceassignmentcode"] || `EMP-${i}`,
          gender: rawMember["gender"] || "",
          departmentId: null,
          locationId: null,
          imageUrl: rawMember["imageurl"] || rawMember["photo"] || "",
          birthday: rawMember["birthday"] || rawMember["birthdate"] || null,
          startDate:
            rawMember["startdate"] || new Date().toISOString().split("T")[0],
        };

        // Résolution du département
        if (rawMember["departmentid"]) {
          member.departmentId = parseInt(rawMember["departmentid"]);
        } else if (rawMember["department"] || rawMember["departmentname"]) {
          const deptName = (
            rawMember["department"] || rawMember["departmentname"]
          ).toLowerCase();
          member.departmentId = departmentsMap.get(deptName) || null;
        }

        // Résolution de la localisation
        if (rawMember["locationid"]) {
          member.locationId = parseInt(rawMember["locationid"]);
        } else if (rawMember["location"] || rawMember["locationname"]) {
          const locName = (
            rawMember["location"] || rawMember["locationname"]
          ).toLowerCase();
          member.locationId = locationsMap.get(locName) || null;
        }

        // Stocker la relation manager si présente
        if (rawMember["managerserviceassignmentcode"]) {
          managerRelations.push({
            serviceAssignmentCode: member.serviceAssignmentCode,
            managerServiceAssignmentCode:
              rawMember["managerserviceassignmentcode"],
            email: member.professionnalEmail, // Pour le débogage
          });

          console.log(
            `Relation détectée: ${member.serviceAssignmentCode} a pour manager ${rawMember["managerserviceassignmentcode"]}`
          );
        }

        // Vérifier les champs obligatoires
        if (member.firstname && member.lastname && member.professionnalEmail) {
          members.push(member);
        } else {
          console.warn(
            `Ligne ${i} ignorée: données obligatoires manquantes`,
            rawMember
          );
        }
      }

      // Importer tous les membres
      console.log(`Importation de ${members.length} membres...`);
      const createdMembers = await importTeamMembers(members);
      console.log(`${createdMembers.length} membres importés avec succès`);

      // Attendre 1 seconde pour s'assurer que la base de données est à jour
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Rafraîchir les données pour récupérer tous les membres, y compris ceux importés
      console.log("Récupération de tous les membres...");
      const { data: refreshedData } = await refetchMembers();
      const allMembers = refreshedData?.teamMembers || [];

      console.log(
        `${allMembers.length} membres trouvés après rafraîchissement`
      );

      // Créer un mapping code d'assignation -> id pour tous les membres
      const serviceCodeMap = new Map();
      allMembers.forEach((member) => {
        if (member.serviceAssignmentCode) {
          // Normaliser le code pour éviter les problèmes de casse ou d'espaces
          const normalizedCode = String(member.serviceAssignmentCode).trim();
          serviceCodeMap.set(normalizedCode, member.id);
          // Aussi stocker sans aucune espace pour être plus tolérant
          serviceCodeMap.set(normalizedCode.replace(/\s+/g, ""), member.id);
        }
      });

      console.log(
        `Codes d'assignation disponibles: ${Array.from(
          serviceCodeMap.keys()
        ).join(", ")}`
      );

      // Mettre à jour les relations manager-subordonné
      const updates = [];

      for (const relation of managerRelations) {
        // Normaliser les codes pour la recherche
        const subordinateCode = String(relation.serviceAssignmentCode).trim();
        const managerCode = String(
          relation.managerServiceAssignmentCode
        ).trim();

        // Trouver les IDs
        let subordinateId = serviceCodeMap.get(subordinateCode);
        let managerId = serviceCodeMap.get(managerCode);

        // Si les codes exacts ne sont pas trouvés, essayer sans espaces
        if (!subordinateId)
          subordinateId = serviceCodeMap.get(
            subordinateCode.replace(/\s+/g, "")
          );
        if (!managerId)
          managerId = serviceCodeMap.get(managerCode.replace(/\s+/g, ""));

        console.log(
          `Résolution de relation: ${subordinateCode} (ID=${subordinateId}) -> Manager ${managerCode} (ID=${managerId})`
        );

        if (subordinateId && managerId) {
          console.log(
            `Mise à jour du membre ${subordinateId} avec le manager ${managerId}`
          );
          updates.push(updateTeamMember(subordinateId, { managerId }));
        } else {
          console.warn(
            `Relation ignorée: subordonné=${relation.email} (code=${subordinateCode}, ID=${subordinateId}), ` +
              `manager=${managerCode} (ID=${managerId})`
          );
        }
      }

      // Appliquer toutes les mises à jour
      if (updates.length > 0) {
        await Promise.all(updates);
        console.log(`${updates.length} relations managériales mises à jour`);
      }

      // Rafraîchir une dernière fois pour avoir la structure complète
      await refetchMembers();

      return { imported: members.length };
    } catch (error) {
      console.error("Erreur lors de l'importation CSV:", error);
      throw new Error(
        "Échec de l'analyse du fichier CSV. Veuillez vérifier le format."
      );
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
