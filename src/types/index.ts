
export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  managerId: string | null;
  imageUrl: string;
  bio?: string;
  startDate?: string;
  phoneNumber?: string;
  location?: string;
  skills?: string[];
}

export type TeamMembers = TeamMember[];
