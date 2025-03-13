import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Member {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    position: String!
    department: Department
    manager: Member
    imageUrl: String
    bio: String
    startDate: String!
    phoneNumber: String
    directReports: [Member!]
    location: Location
    createdAt: String!
    updatedAt: String!
  }

  type Department {
    id: Int!
    name: String!
    description: String
    members: [Member!]!
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    id: Int!
    title: String!
    members: [Member!]!
  }

  type Query {
    members: [Member!]!
    member(id: ID!): Member
    departments: [Department!]!
    department(id: Int!): Department
    locations: [Location!]!
    location(id: Int!): Location
  }

  type Mutation {
    createMember(
      firstName: String!
      lastName: String!
      email: String!
      position: String!
      departmentId: Int
      managerId: String
      imageUrl: String
      bio: String
      phoneNumber: String
      locationId: Int
    ): Member!
    updateMember(
      id: ID!
      firstName: String
      lastName: String
      email: String
      position: String
      departmentId: Int
      managerId: String
      imageUrl: String
      bio: String
      phoneNumber: String
      locationId: Int
    ): Member!
    deleteMember(id: ID!): Member!

    createDepartment(name: String!, description: String): Department!
    updateDepartment(id: Int!, name: String, description: String): Department!
    deleteDepartment(id: Int!): Department!

    createLocation(title: String!): Location!
    updateLocation(id: Int!, title: String!): Location!
    deleteLocation(id: Int!): Location!
  }
`;
