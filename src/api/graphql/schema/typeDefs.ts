import gql from 'graphql-tag';

export const typeDefs = gql`
  type Department {
    id: Int!
    name: String!
    teamMembers: [TeamMember!]
  }

  type Location {
    id: Int!
    name: String!
    teamMembers: [TeamMember!]
  }

  type TeamMember {
    id: Int!
    firstname: String!
    lastname: String!
    professionnalEmail: String!
    jobDescription: String!
    managementCategory: String!
    serviceAssignmentCode: String!
    gender: String
    departmentId: Int
    department: Department
    managerId: Int
    manager: TeamMember
    directReports: [TeamMember!]
    locationId: Int
    location: Location
    imageUrl: String
    phoneNumber: String
    birthDate: String
    startDate: String
  }

  type Query {
    departments: [Department!]!
    department(id: Int!): Department
    locations: [Location!]!
    location(id: Int!): Location
    teamMembers: [TeamMember!]!
    teamMember(id: Int!): TeamMember
    teamMembersByDepartment(departmentId: Int!): [TeamMember!]!
    teamMembersByManager(managerId: Int!): [TeamMember!]!
  }

  input TeamMemberCreateInput {
    firstname: String!
    lastname: String!
    professionnalEmail: String!
    jobDescription: String!
    managementCategory: String!
    serviceAssignmentCode: String!
    gender: String
    departmentId: Int
    managerId: Int
    locationId: Int
    imageUrl: String
    phoneNumber: String
    birthDate: String
    startDate: String
  }

  input TeamMemberUpdateInput {
    firstname: String
    lastname: String
    professionnalEmail: String
    jobDescription: String
    managementCategory: String
    serviceAssignmentCode: String
    gender: String
    departmentId: Int
    managerId: Int
    locationId: Int
    imageUrl: String
    phoneNumber: String
    birthDate: String
    startDate: String
  }

  input DepartmentCreateInput {
    name: String!
  }

  input LocationCreateInput {
    name: String!
  }

  type Mutation {
    createTeamMember(data: TeamMemberCreateInput!): TeamMember!
    updateTeamMember(id: Int!, data: TeamMemberUpdateInput!): TeamMember!
    deleteTeamMember(id: Int!): TeamMember!
    createDepartment(data: DepartmentCreateInput!): Department!
    deleteDepartment(id: Int!): Department!
    createLocation(data: LocationCreateInput!): Location!
    deleteLocation(id: Int!): Location!
    importTeamMembers(members: [TeamMemberCreateInput!]!): [TeamMember!]!
    uploadMemberImage(imageData: String!): UploadResult!
  }

  type UploadResult {
  url: String!
}
`;