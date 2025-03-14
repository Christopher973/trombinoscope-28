
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeamMember, TeamMembers } from '../types';
import { demoTeamData, getTeamHierarchy } from '../data/team';
import { toast } from '@/hooks/use-toast';

interface TeamContextProps {
  teamMembers: TeamMembers;
  teamHierarchy: any[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: number) => void;
  getTeamMember: (id: number) => TeamMember | undefined;
  getDirectReports: (managerId: number | null) => TeamMembers;
  importTeamMembersFromCSV: (csvContent: string) => { imported: number; errors: number };
}

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMembers>([]);
  const [teamHierarchy, setTeamHierarchy] = useState<any[]>([]);

  // Initialize team data
  useEffect(() => {
    setTeamMembers(demoTeamData);
  }, []);

  // Update team hierarchy whenever team members change
  useEffect(() => {
    const hierarchy = getTeamHierarchy(teamMembers);
    setTeamHierarchy(hierarchy);
  }, [teamMembers]);

  // Add a new team member
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const id = Math.max(0, ...teamMembers.map(m => m.id)) + 1;
    const newMember = { id, ...memberData };
    
    setTeamMembers(prev => [...prev, newMember]);
    toast({
      title: "Success",
      description: "Team member added successfully",
    });
  };

  // Update an existing team member
  const updateTeamMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    toast({
      title: "Success",
      description: "Team member updated successfully",
    });
  };

  // Delete a team member
  const deleteTeamMember = (id: number) => {
    // First, reassign all direct reports to the deleted member's manager
    const memberToDelete = teamMembers.find(m => m.id === id);
    if (!memberToDelete) return;
    
    const managerId = memberToDelete.managerId;
    
    setTeamMembers(prev => {
      // First reassign direct reports
      const updatedTeam = prev.map(member => 
        member.managerId === id 
          ? { ...member, managerId } 
          : member
      );
      
      // Then remove the member
      return updatedTeam.filter(member => member.id !== id);
    });
    
    toast({
      title: "Success",
      description: "Team member deleted successfully",
    });
  };

  // Get a specific team member by ID
  const getTeamMember = (id: number) => {
    return teamMembers.find(member => member.id === id);
  };

  // Get all direct reports for a manager
  const getDirectReports = (managerId: number | null) => {
    return teamMembers.filter(member => member.managerId === managerId);
  };

  // Parse CSV text and import team members
  const importTeamMembersFromCSV = (csvContent: string) => {
    // Split by lines and get headers
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error("The CSV file is empty or has no data rows");
    }

    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    // Validate required headers
    const requiredHeaders = ['firstname', 'lastname', 'professionalemail', 'jobdescription', 'startdate', 'birthday'];
    const missingHeaders = requiredHeaders.filter(reqHeader => 
      !headers.some(header => header.replace(/[^a-z0-9]/g, '') === reqHeader)
    );
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Process each data row
    let importedCount = 0;
    let errorCount = 0;
    const newMembers: TeamMember[] = [];
    const baseId = Math.max(0, ...teamMembers.map(m => m.id)) + 1;

    for (let i = 1; i < lines.length; i++) {
      try {
        // Skip empty lines
        if (lines[i].trim() === '') continue;
        
        // Parse CSV row while handling quotes
        let values: string[] = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          
          if (char === '"' && (j === 0 || lines[i][j-1] !== '\\')) {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        values.push(currentValue.trim());
        
        // Create member object from CSV row
        const member: any = { id: baseId + importedCount };
        
        headers.forEach((header, index) => {
          const cleanHeader = header.replace(/[^a-z0-9]/g, '');
          const value = values[index] || '';
          
          // Skip empty values for optional fields
          if (value === '' && !requiredHeaders.includes(cleanHeader)) {
            return;
          }

          // Handle date fields
          if (cleanHeader === 'startdate' || cleanHeader === 'birthday') {
            if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
              throw new Error(`Invalid date format for ${header} at row ${i + 1}. Use YYYY-MM-DD format.`);
            }
            member[cleanHeader === 'startdate' ? 'startDate' : 'birthday'] = value;
          } 
          // Handle numeric fields
          else if (['departmentid', 'locationid', 'managerid'].includes(cleanHeader)) {
            if (value !== '') {
              const numValue = parseInt(value, 10);
              if (isNaN(numValue)) {
                throw new Error(`Invalid number for ${header} at row ${i + 1}`);
              }
              
              // Map to proper field names
              if (cleanHeader === 'departmentid') member.departmentId = numValue;
              else if (cleanHeader === 'locationid') member.locationId = numValue;
              else if (cleanHeader === 'managerid') member.managerId = numValue;
            }
          } 
          // Handle email specifically
          else if (cleanHeader === 'professionalemail') {
            member.professionnalEmail = value;
          }
          // Handle other string fields
          else {
            // Map CSV header to proper field name (camelCase)
            const fieldName = cleanHeader === 'firstname' ? 'firstname' :
                             cleanHeader === 'lastname' ? 'lastname' :
                             cleanHeader === 'gender' ? 'gender' :
                             cleanHeader === 'jobdescription' ? 'jobDescription' :
                             cleanHeader === 'managementcategory' ? 'managementCategory' :
                             cleanHeader === 'serviceassignmentcode' ? 'serviceAssignmentCode' :
                             cleanHeader === 'imageurl' ? 'imageUrl' : cleanHeader;
                             
            member[fieldName] = value;
          }
        });

        // Set default values for required fields if missing
        if (!member.managementCategory) member.managementCategory = 'Individual Contributor';
        if (!member.serviceAssignmentCode) {
          member.serviceAssignmentCode = `EMP-${(baseId + importedCount).toString().padStart(3, '0')}`;
        }
        
        // Add timestamps
        member.createdAt = new Date().toISOString();
        member.updatedAt = new Date().toISOString();
        
        // Basic validation
        if (!member.firstname || !member.lastname || !member.professionnalEmail) {
          throw new Error(`Missing required data at row ${i + 1}`);
        }

        newMembers.push(member as TeamMember);
        importedCount++;
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
        errorCount++;
      }
    }

    // Add new members
    if (newMembers.length > 0) {
      setTeamMembers(prev => [...prev, ...newMembers]);
    }

    return { imported: importedCount, errors: errorCount };
  };

  return (
    <TeamContext.Provider 
      value={{ 
        teamMembers, 
        teamHierarchy,
        addTeamMember, 
        updateTeamMember, 
        deleteTeamMember, 
        getTeamMember,
        getDirectReports,
        importTeamMembersFromCSV
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
