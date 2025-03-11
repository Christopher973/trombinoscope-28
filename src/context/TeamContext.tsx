
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeamMember, TeamMembers } from '../types';
import { demoTeamData, getTeamHierarchy } from '../data/team';
import { toast } from '@/components/ui/sonner';

interface TeamContextProps {
  teamMembers: TeamMembers;
  teamHierarchy: any[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  getTeamMember: (id: string) => TeamMember | undefined;
  getDirectReports: (managerId: string | null) => TeamMembers;
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
    const id = Math.random().toString(36).substring(2, 11);
    const newMember = { id, ...memberData };
    
    setTeamMembers(prev => [...prev, newMember]);
    toast.success('Team member added successfully');
  };

  // Update an existing team member
  const updateTeamMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    toast.success('Team member updated successfully');
  };

  // Delete a team member
  const deleteTeamMember = (id: string) => {
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
    
    toast.success('Team member deleted successfully');
  };

  // Get a specific team member by ID
  const getTeamMember = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  // Get all direct reports for a manager
  const getDirectReports = (managerId: string | null) => {
    return teamMembers.filter(member => member.managerId === managerId);
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
        getDirectReports
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
