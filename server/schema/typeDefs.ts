
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Member {
    id: Int!
    firstname: String!
    lastname: String!
    gender: String
    startDate: String!
    birthday: String!
    jobDescription: String!
    managementCategory: String!
    serviceAssignmentCode: String!
    professionnalEmail: String!
    imageUrl: String
    department: Department
    location: Location
    manager: Member
    directReports: [Member!]
    createdAt: String!
    updatedAt: String!
  }

  type Department {
    id: Int!
    name: String!
    members: [Member!]!
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    id: Int!
    name: String!
    members: [Member!]!
  }

  type Query {
    members: [Member!]!
    member(id: Int!): Member
    departments: [Department!]!
    department(id: Int!): Department
    locations: [Location!]!
    location(id: Int!): Location
  }

  type Mutation {
    createMember(
      firstname: String!
      lastname: String!
      gender: String
      startDate: String!
      birthday: String!
      jobDescription: String!
      managementCategory: String!
      serviceAssignmentCode: String!
      professionnalEmail: String!
      imageUrl: String
      departmentId: Int
      locationId: Int
      managerId: Int
    ): Member!

    updateMember(
      id: Int!
      firstname: String
      lastname: String
      gender: String
      startDate: String
      birthday: String
      jobDescription: String
      managementCategory: String
      serviceAssignmentCode: String
      professionnalEmail: String
      imageUrl: String
      departmentId: Int
      locationId: Int
      managerId: Int
    ): Member!

    deleteMember(id: Int!): Member!

    createDepartment(name: String!): Department!
    updateDepartment(id: Int!, name: String!): Department!
    deleteDepartment(id: Int!): Department!

    createLocation(name: String!): Location!
    updateLocation(id: Int!, name: String!): Location!
    deleteLocation(id: Int!): Location!
  }
`;
