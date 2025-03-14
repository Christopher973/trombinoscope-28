
import { TeamMember, TeamMembers, Department, Location } from '../types';

// Create sample departments
const departments: Department[] = [
  { id: 1, name: 'Executive' },
  { id: 2, name: 'Technology' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Product' },
  { id: 5, name: 'Human Resources' },
  { id: 6, name: 'Engineering' },
  { id: 7, name: 'Design' },
  { id: 8, name: 'Marketing' },
  { id: 9, name: 'Sales' },
  { id: 10, name: 'Support' }
];

// Create sample locations
const locations: Location[] = [
  { id: 1, name: 'New York' },
  { id: 2, name: 'San Francisco' },
  { id: 3, name: 'Chicago' },
  { id: 4, name: 'Boston' },
  { id: 5, name: 'Miami' },
  { id: 6, name: 'Seattle' },
  { id: 7, name: 'Los Angeles' },
  { id: 8, name: 'Austin' }
];

// Function to get a department by id
const getDepartment = (id: number): Department => {
  return departments.find(d => d.id === id) || departments[0];
};

// Function to get a location by id
const getLocation = (id: number): Location => {
  return locations.find(l => l.id === id) || locations[0];
};

// Function to generate a placeholder image URL
const getPlaceholderImage = (id: number): string => {
  return `https://i.pravatar.cc/300?img=${id % 70}`; // Using pravatar.cc for placeholder images
};

// Sample team data
export const initialTeamData: TeamMembers = [
  {
    id: 1,
    firstname: 'Emily',
    lastname: 'Johnson',
    professionnalEmail: 'emily.johnson@company.com',
    jobDescription: 'CEO',
    managementCategory: 'Executive',
    serviceAssignmentCode: 'EX-001',
    gender: 'Female',
    departmentId: 1,
    department: getDepartment(1),
    managerId: null,
    locationId: 1,
    location: getLocation(1),
    imageUrl: getPlaceholderImage(1),
    startDate: '2016-03-15',
    birthday: '1980-05-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    firstname: 'Michael',
    lastname: 'Chen',
    professionnalEmail: 'michael.chen@company.com',
    jobDescription: 'CTO',
    managementCategory: 'Executive',
    serviceAssignmentCode: 'EX-002',
    gender: 'Male',
    departmentId: 2,
    department: getDepartment(2),
    managerId: 1,
    locationId: 2,
    location: getLocation(2),
    imageUrl: getPlaceholderImage(2),
    startDate: '2017-06-02',
    birthday: '1982-09-23',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    firstname: 'Sarah',
    lastname: 'Patel',
    professionnalEmail: 'sarah.patel@company.com',
    jobDescription: 'CFO',
    managementCategory: 'Executive',
    serviceAssignmentCode: 'EX-003',
    gender: 'Female',
    departmentId: 3,
    department: getDepartment(3),
    managerId: 1,
    locationId: 3,
    location: getLocation(3),
    imageUrl: getPlaceholderImage(3),
    startDate: '2018-02-12',
    birthday: '1979-11-05',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    firstname: 'David',
    lastname: 'Thompson',
    professionnalEmail: 'david.thompson@company.com',
    jobDescription: 'VP of Product',
    managementCategory: 'Management',
    serviceAssignmentCode: 'PM-001',
    gender: 'Male',
    departmentId: 4,
    department: getDepartment(4),
    managerId: 1,
    locationId: 4,
    location: getLocation(4),
    imageUrl: getPlaceholderImage(4),
    startDate: '2019-04-25',
    birthday: '1985-07-18',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    firstname: 'Jennifer',
    lastname: 'Martinez',
    professionnalEmail: 'jennifer.martinez@company.com',
    jobDescription: 'VP of HR',
    managementCategory: 'Management',
    serviceAssignmentCode: 'HR-001',
    gender: 'Female',
    departmentId: 5,
    department: getDepartment(5),
    managerId: 1,
    locationId: 5,
    location: getLocation(5),
    imageUrl: getPlaceholderImage(5),
    startDate: '2019-08-03',
    birthday: '1983-02-14',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    firstname: 'Alex',
    lastname: 'Wong',
    professionnalEmail: 'alex.wong@company.com',
    jobDescription: 'Engineering Manager',
    managementCategory: 'Management',
    serviceAssignmentCode: 'EG-001',
    gender: 'Male',
    departmentId: 6,
    department: getDepartment(6),
    managerId: 2,
    locationId: 6,
    location: getLocation(6),
    imageUrl: getPlaceholderImage(6),
    startDate: '2018-11-15',
    birthday: '1987-06-22',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    firstname: 'Rachel',
    lastname: 'Kim',
    professionnalEmail: 'rachel.kim@company.com',
    jobDescription: 'Senior Developer',
    managementCategory: 'Individual Contributor',
    serviceAssignmentCode: 'SD-001',
    gender: 'Female',
    departmentId: 6,
    department: getDepartment(6),
    managerId: 6,
    locationId: 7,
    location: getLocation(7),
    imageUrl: getPlaceholderImage(7),
    startDate: '2020-01-20',
    birthday: '1990-10-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    firstname: 'Carlos',
    lastname: 'Garcia',
    professionnalEmail: 'carlos.garcia@company.com',
    jobDescription: 'UX Designer',
    managementCategory: 'Individual Contributor',
    serviceAssignmentCode: 'DS-001',
    gender: 'Male',
    departmentId: 7,
    department: getDepartment(7),
    managerId: 4,
    locationId: 8,
    location: getLocation(8),
    imageUrl: getPlaceholderImage(8),
    startDate: '2021-03-08',
    birthday: '1992-04-17',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Utility function to get all direct reports for a manager
export const getDirectReports = (teamMembers: TeamMembers, managerId: number | null): TeamMembers => {
  return teamMembers.filter(member => member.managerId === managerId);
};

// Function to get a flattened hierarchical representation of team
export const getTeamHierarchy = (teamMembers: TeamMembers, managerId: number | null = null): any[] => {
  const directReports = getDirectReports(teamMembers, managerId);
  
  return directReports.map(member => ({
    ...member,
    children: getTeamHierarchy(teamMembers, member.id)
  }));
};

// Function to generate more team members (for demo purposes)
export const generateTeamMembers = (count: number, existingMembers: TeamMembers): TeamMembers => {
  const firstNames = ['James', 'Robert', 'John', 'William', 'Richard', 'Thomas', 'Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Margaret', 'Betty', 'Sandra'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'];
  const jobDescriptions = ['Software Engineer', 'Product Manager', 'UI Designer', 'QA Engineer', 'Data Scientist', 'System Administrator', 'Marketing Specialist', 'Sales Representative', 'Customer Support', 'Financial Analyst'];
  const managementCategories = ['Individual Contributor', 'Management', 'Executive'];
  
  const newMembers: TeamMembers = [];
  const allMembers = [...existingMembers];
  
  // Get all potential managers (existing members)
  const potentialManagerIds = existingMembers.map(m => m.id);
  
  for (let i = 0; i < count; i++) {
    const id = existingMembers.length + i + 1;
    const firstname = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastname = lastNames[Math.floor(Math.random() * lastNames.length)];
    const jobDescription = jobDescriptions[Math.floor(Math.random() * jobDescriptions.length)];
    const departmentId = Math.floor(Math.random() * departments.length) + 1;
    const locationId = Math.floor(Math.random() * locations.length) + 1;
    const managementCategory = managementCategories[Math.floor(Math.random() * managementCategories.length)];
    const serviceAssignmentCode = `${departmentId}-${id.toString().padStart(3, '0')}`;
    
    // Randomly assign a manager from existing members
    const managerId = potentialManagerIds[Math.floor(Math.random() * potentialManagerIds.length)];
    
    // Generate random birthdates between 1970 and 2000
    const birthYear = 1970 + Math.floor(Math.random() * 30);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthday = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
    
    // Generate random start dates within the past 5 years
    const startYear = 2018 + Math.floor(Math.random() * 5);
    const startMonth = Math.floor(Math.random() * 12) + 1;
    const startDay = Math.floor(Math.random() * 28) + 1;
    const startDate = `${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
    
    const newMember: TeamMember = {
      id,
      firstname,
      lastname,
      professionnalEmail: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@company.com`,
      jobDescription,
      managementCategory,
      serviceAssignmentCode,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      departmentId,
      department: getDepartment(departmentId),
      managerId,
      locationId,
      location: getLocation(locationId),
      imageUrl: getPlaceholderImage(id),
      startDate,
      birthday,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    newMembers.push(newMember);
    allMembers.push(newMember);
  }
  
  return newMembers;
};

// Generate 50 more team members for the demo
export const demoTeamData = [...initialTeamData, ...generateTeamMembers(50, initialTeamData)];
