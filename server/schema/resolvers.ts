
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    members: () => prisma.member.findMany(),
    member: (_, { id }) => prisma.member.findUnique({ where: { id } }),
    departments: () => prisma.department.findMany(),
    department: (_, { id }) => prisma.department.findUnique({ where: { id } }),
    locations: () => prisma.location.findMany(),
    location: (_, { id }) => prisma.location.findUnique({ where: { id } }),
  },
  
  Mutation: {
    createMember: (_, args) => {
      return prisma.member.create({
        data: {
          ...args,
          startDate: new Date(args.startDate),
          birthday: new Date(args.birthday),
          departmentId: args.departmentId || undefined,
          locationId: args.locationId || undefined,
          managerId: args.managerId || undefined,
        },
      });
    },
    
    updateMember: (_, { id, ...data }) => {
      const updateData = { ...data };
      if (data.startDate) updateData.startDate = new Date(data.startDate);
      if (data.birthday) updateData.birthday = new Date(data.birthday);
      
      return prisma.member.update({
        where: { id },
        data: updateData,
      });
    },
    
    deleteMember: (_, { id }) => prisma.member.delete({ where: { id } }),

    createDepartment: (_, args) => prisma.department.create({ data: args }),
    updateDepartment: (_, { id, ...data }) => {
      return prisma.department.update({
        where: { id },
        data,
      });
    },
    deleteDepartment: (_, { id }) => prisma.department.delete({ where: { id } }),

    createLocation: (_, args) => prisma.location.create({ data: args }),
    updateLocation: (_, { id, ...data }) => {
      return prisma.location.update({
        where: { id },
        data,
      });
    },
    deleteLocation: (_, { id }) => prisma.location.delete({ where: { id } }),
  },
  
  Member: {
    manager: (parent) =>
      parent.managerId
        ? prisma.member.findUnique({ where: { id: parent.managerId } })
        : null,
    directReports: (parent) =>
      prisma.member.findMany({ where: { managerId: parent.id } }),
    department: (parent) =>
      parent.departmentId
        ? prisma.department.findUnique({ where: { id: parent.departmentId } })
        : null,
    location: (parent) =>
      parent.locationId
        ? prisma.location.findUnique({ where: { id: parent.locationId } })
        : null,
  },
  
  Department: {
    members: (parent) =>
      prisma.member.findMany({ where: { departmentId: parent.id } }),
  },
  
  Location: {
    members: (parent) =>
      prisma.member.findMany({ where: { locationId: parent.id } }),
  },
};
