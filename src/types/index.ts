
export interface TeamMember {
  id: number;
  firstname: string;
  lastname: string;
  gender?: string;
  startDate: string | Date;
  birthday: string | Date;
  jobDescription: string;
  managementCategory: string;
  serviceAssignmentCode: string;
  professionnalEmail: string;
  imageUrl?: string;
  departmentId?: number;
  department?: Department;
  locationId?: number;
  location?: Location;
  managerId?: number | null;
  manager?: TeamMember | null;
  directReports?: TeamMember[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Department {
  id: number;
  name: string;
  members?: TeamMember[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Location {
  id: number;
  name: string;
  members?: TeamMember[];
}

export type TeamMembers = TeamMember[];
