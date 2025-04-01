import { gql } from "@apollo/client";

// Fragments pour réutiliser des portions de requêtes
export const TEAM_MEMBER_FRAGMENT = gql`
  fragment TeamMemberFields on TeamMember {
    id
    firstname
    lastname
    professionnalEmail
    jobDescription
    managementCategory
    serviceAssignmentCode
    gender
    departmentId
    managerId
    locationId
    imageUrl
    phoneNumber
    birthday
    startDate
  }
`;

// Requêtes
export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers {
      ...TeamMemberFields
      department {
        id
        name
      }
      location {
        id
        name
      }
    }
  }
  ${TEAM_MEMBER_FRAGMENT}
`;

export const GET_TEAM_MEMBER = gql`
  query GetTeamMember($id: Int!) {
    teamMember(id: $id) {
      ...TeamMemberFields
      department {
        id
        name
      }
      location {
        id
        name
      }
      manager {
        id
        firstname
        lastname
        jobDescription
      }
      directReports {
        id
        firstname
        lastname
        jobDescription
      }
    }
  }
  ${TEAM_MEMBER_FRAGMENT}
`;

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
    }
  }
`;

// Mutations
export const CREATE_TEAM_MEMBER = gql`
  mutation CreateTeamMember($data: TeamMemberCreateInput!) {
    createTeamMember(data: $data) {
      ...TeamMemberFields
    }
  }
  ${TEAM_MEMBER_FRAGMENT}
`;

export const UPDATE_TEAM_MEMBER = gql`
  mutation UpdateTeamMember($id: Int!, $data: TeamMemberUpdateInput!) {
    updateTeamMember(id: $id, data: $data) {
      ...TeamMemberFields
      manager {
        id
        firstname
        lastname
        professionnalEmail
      }
    }
  }
  ${TEAM_MEMBER_FRAGMENT}
`;

export const DELETE_TEAM_MEMBER = gql`
  mutation DeleteTeamMember($id: Int!) {
    deleteTeamMember(id: $id) {
      id
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($data: DepartmentCreateInput!) {
    createDepartment(data: $data) {
      id
      name
    }
  }
`;

export const CREATE_LOCATION = gql`
  mutation CreateLocation($data: LocationCreateInput!) {
    createLocation(data: $data) {
      id
      name
    }
  }
`;

export const IMPORT_TEAM_MEMBERS = gql`
  mutation ImportTeamMembers($members: [TeamMemberCreateInput!]!) {
    importTeamMembers(members: $members) {
      id
      firstname
      lastname
      professionnalEmail
    }
  }
`;

export const UPLOAD_MEMBER_IMAGE = gql`
  mutation UploadMemberImage($imageData: String!) {
    uploadMemberImage(imageData: $imageData) {
      url
    }
  }
`;
