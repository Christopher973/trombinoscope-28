
export interface Department {
  id: number;
  name: string;
  members?: TeamMember[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Location {
  id: number;
  name: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: number;
  firstname: string;
  lastname: string;
  gender?: string;
  startDate: Date | string;
  birthday: Date | string;
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
  manager?: TeamMember;
  directReports?: TeamMember[];
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type TeamMembers = TeamMember[];
