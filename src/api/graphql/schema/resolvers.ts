import { PrismaClient } from '@prisma/client';

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
    createTeamMember: (_, { data }) => 
      prisma.teamMember.create({ data }),
    updateTeamMember: (_, { id, data }) => 
      prisma.teamMember.update({ where: { id }, data }),
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
        const createdMember = await prisma.teamMember.create({ data: member });
        createdMembers.push(createdMember);
      }
      return createdMembers;
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