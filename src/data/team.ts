
import { TeamMember, TeamMembers } from '../types';

// Function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Generate placeholder image URL
const getPlaceholderImage = (id: number): string => {
  return `https://i.pravatar.cc/300?img=${id % 70}`; // Using pravatar.cc for placeholder images
};

// Sample team data
export const initialTeamData: TeamMembers = [
  {
    id: '1',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@company.com',
    position: 'CEO',
    department: 'Executive',
    managerId: null,
    imageUrl: getPlaceholderImage(1),
    bio: 'Emily has led the company for 8 years with a focus on innovation and sustainable growth.',
    startDate: '2016-03-15',
    phoneNumber: '+1 (555) 123-4567',
    location: 'New York',
    skills: ['Leadership', 'Strategic Planning', 'Business Development']
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@company.com',
    position: 'CTO',
    department: 'Technology',
    managerId: '1',
    imageUrl: getPlaceholderImage(2),
    bio: 'Michael oversees all technical aspects of the company with 15+ years of experience in software development.',
    startDate: '2017-06-02',
    phoneNumber: '+1 (555) 234-5678',
    location: 'San Francisco',
    skills: ['Software Architecture', 'AI/ML', 'Cloud Infrastructure']
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Patel',
    email: 'sarah.patel@company.com',
    position: 'CFO',
    department: 'Finance',
    managerId: '1',
    imageUrl: getPlaceholderImage(3),
    bio: 'Sarah manages all financial operations and strategic financial planning for the company.',
    startDate: '2018-02-12',
    phoneNumber: '+1 (555) 345-6789',
    location: 'Chicago',
    skills: ['Financial Analysis', 'Risk Management', 'Strategic Planning']
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@company.com',
    position: 'VP of Product',
    department: 'Product',
    managerId: '1',
    imageUrl: getPlaceholderImage(4),
    bio: 'David leads the product team in developing innovative solutions for our customers.',
    startDate: '2019-04-25',
    location: 'Boston',
    skills: ['Product Strategy', 'User Experience', 'Market Research']
  },
  {
    id: '5',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer.martinez@company.com',
    position: 'VP of HR',
    department: 'Human Resources',
    managerId: '1',
    imageUrl: getPlaceholderImage(5),
    bio: 'Jennifer oversees all HR functions, including talent acquisition and employee development.',
    startDate: '2019-08-03',
    location: 'Miami',
    skills: ['Talent Management', 'Organizational Development', 'Employment Law']
  },
  {
    id: '6',
    firstName: 'Alex',
    lastName: 'Wong',
    email: 'alex.wong@company.com',
    position: 'Engineering Manager',
    department: 'Technology',
    managerId: '2',
    imageUrl: getPlaceholderImage(6),
    startDate: '2018-11-15',
    location: 'Seattle',
    skills: ['Software Engineering', 'Team Leadership', 'Agile Methodologies']
  },
  {
    id: '7',
    firstName: 'Rachel',
    lastName: 'Kim',
    email: 'rachel.kim@company.com',
    position: 'Senior Developer',
    department: 'Technology',
    managerId: '6',
    imageUrl: getPlaceholderImage(7),
    startDate: '2020-01-20',
    location: 'Los Angeles',
    skills: ['JavaScript', 'React', 'Node.js']
  },
  {
    id: '8',
    firstName: 'Carlos',
    lastName: 'Garcia',
    email: 'carlos.garcia@company.com',
    position: 'UX Designer',
    department: 'Product',
    managerId: '4',
    imageUrl: getPlaceholderImage(8),
    startDate: '2021-03-08',
    location: 'Austin',
    skills: ['UI/UX Design', 'Wireframing', 'User Research']
  }
];

// Utility function to get all direct reports for a manager
export const getDirectReports = (teamMembers: TeamMembers, managerId: string | null): TeamMembers => {
  return teamMembers.filter(member => member.managerId === managerId);
};

// Function to get a flattened hierarchical representation of team
export const getTeamHierarchy = (teamMembers: TeamMembers, managerId: string | null = null): any[] => {
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
  const positions = ['Software Engineer', 'Product Manager', 'UI Designer', 'QA Engineer', 'Data Scientist', 'System Administrator', 'Marketing Specialist', 'Sales Representative', 'Customer Support', 'Financial Analyst'];
  const departments = ['Engineering', 'Product', 'Design', 'QA', 'Data', 'IT', 'Marketing', 'Sales', 'Support', 'Finance'];
  const locations = ['New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Seattle', 'Austin', 'Boston', 'Denver', 'Atlanta', 'Miami'];
  
  const newMembers: TeamMembers = [];
  const allMembers = [...existingMembers];
  
  // Get all potential managers (existing members)
  const potentialManagerIds = existingMembers.map(m => m.id);
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Randomly assign a manager from existing members
    const managerId = potentialManagerIds[Math.floor(Math.random() * potentialManagerIds.length)];
    
    const newMember: TeamMember = {
      id: generateId(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      position,
      department,
      managerId,
      imageUrl: getPlaceholderImage(existingMembers.length + i + 1),
      startDate: new Date(Date.now() - Math.random() * 94608000000).toISOString().split('T')[0], // Random date within last 3 years
      location,
      skills: []
    };
    
    newMembers.push(newMember);
    allMembers.push(newMember);
  }
  
  return newMembers;
};

// Generate 50 more team members for the demo
export const demoTeamData = [...initialTeamData, ...generateTeamMembers(50, initialTeamData)];
