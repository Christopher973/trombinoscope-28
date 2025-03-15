import { PrismaClient } from '@prisma/client';
import { uploadImage } from '../../../services/uploadImage';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    departments: () => prisma.department.findMany(),
    department: (_, { id }) => prisma.department.findUnique({ where: { id } }),
    locations: () => prisma.location.findMany(),
    location: (_, { id }) => prisma.location.findUnique({ where: { id } }),
    teamMembers: () => prisma.teamMember.findMany(),
    teamMember: (_, { id }) => prisma.teamMember.findUnique({ where: { id } }),
    teamMembersByDepartment: (_, { departmentId }) => 
      prisma.teamMember.findMany({ where: { departmentId } }),
    teamMembersByManager: (_, { managerId }) => 
      prisma.teamMember.findMany({ where: { managerId } }),
  },
  
  Mutation: {
    createTeamMember: (_, { data }) => {
      // Transformation des données pour Prisma (false = création)
      const prismaData = transformDataForPrisma(data, false);
      return prisma.teamMember.create({ data: prismaData });
    },
    updateTeamMember: (_, { id, data }) => {
      // Transformation des données pour Prisma (true = mise à jour)
      const prismaData = transformDataForPrisma(data, true);
      return prisma.teamMember.update({ 
        where: { id },
        data: prismaData
      });
    },
    deleteTeamMember: (_, { id }) => 
      prisma.teamMember.delete({ where: { id } }),
    createDepartment: (_, { data }) => 
      prisma.department.create({ data }),
    deleteDepartment: (_, { id }) => 
      prisma.department.delete({ where: { id } }),
    createLocation: (_, { data }) => 
      prisma.location.create({ data }),
    deleteLocation: (_, { id }) => 
      prisma.location.delete({ where: { id } }),
    importTeamMembers: async (_, { members }) => {
      const createdMembers = [];
      for (const member of members) {
        const prismaData = transformDataForPrisma(member, false);
        const createdMember = await prisma.teamMember.create({ data: prismaData });
        createdMembers.push(createdMember);
      }
      return createdMembers;
    },
    uploadMemberImage: async (_, { imageData }) => {
    try {
      const imageUrl = await uploadImage(imageData);
      return { url: imageUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },
  },
  
  Department: {
    teamMembers: (parent) => 
      prisma.department.findUnique({ where: { id: parent.id } }).teamMembers(),
  },
  
  Location: {
    teamMembers: (parent) => 
      prisma.location.findUnique({ where: { id: parent.id } }).teamMembers(),
  },
  
  TeamMember: {
    department: (parent) => 
      parent.departmentId ? prisma.department.findUnique({ where: { id: parent.departmentId } }) : null,
    location: (parent) => 
      parent.locationId ? prisma.location.findUnique({ where: { id: parent.locationId } }) : null,
    manager: (parent) => 
      parent.managerId ? prisma.teamMember.findUnique({ where: { id: parent.managerId } }) : null,
    directReports: (parent) => 
      prisma.teamMember.findMany({ where: { managerId: parent.id } }),
  },
};

// Fonction utilitaire pour transformer les données au format attendu par Prisma
function transformDataForPrisma(data, isUpdate = false) {
  const result = { ...data };
  
  // Supprimer les champs qui ne sont pas dans le schéma Prisma
  delete result.department;
  delete result.location;
  delete result.manager;
  delete result.birthday;
  delete result.createdAt;
  delete result.updatedAt;

  // Transformer les dates en format ISO-8601 DateTime
  if (result.startDate) {
    try {
      // Convertir la date simple en format ISO-8601 DateTime complet
      result.startDate = new Date(result.startDate + 'T00:00:00Z').toISOString();
    } catch (error) {
      console.error(`Erreur lors de la conversion de startDate: ${result.startDate}`, error);
    }
  }

  if (result.photo) {
    result.imageUrl = result.photo;
    delete result.photo;
  }

  if (result.birthDate) {
    try {
      // Convertir la date simple en format ISO-8601 DateTime complet
      result.birthday = new Date(result.birthDate + 'T00:00:00Z').toISOString();
      delete result.birthDate;
    } catch (error) {
      console.error(`Erreur lors de la conversion de birthDate: ${result.birthDate}`, error);
    }
  }

  // Transformer departmentId en relation Prisma
  if (result.departmentId !== undefined) {
    if (result.departmentId === null) {
      if (isUpdate) {
        result.department = { disconnect: true };
      } else {
        // Pour la création, ne rien connecter
        // Rien à faire ici, on laisse departmentId à null
      }
    } else {
      result.department = { connect: { id: result.departmentId } };
    }
    delete result.departmentId;
  }

  // Transformer locationId en relation Prisma
  if (result.locationId !== undefined) {
    if (result.locationId === null) {
      if (isUpdate) {
        result.location = { disconnect: true };
      } else {
        // Pour la création, ne rien connecter
        // Rien à faire ici, on laisse locationId à null
      }
    } else {
      result.location = { connect: { id: result.locationId } };
    }
    delete result.locationId;
  }

  // Transformer managerId en relation Prisma
  if (result.managerId !== undefined) {
    if (result.managerId === null) {
      if (isUpdate) {
        result.manager = { disconnect: true };
      } else {
        // Pour la création, ne pas inclure la relation manager du tout
        delete result.managerId;
      }
    } else {
      result.manager = { connect: { id: result.managerId } };
    }
    delete result.managerId;
  }
  
  // Renommer birthDate en birthday si nécessaire
  if (result.birthDate) {
    result.birthday = result.birthDate;
    delete result.birthDate;
  }

  return result;
}