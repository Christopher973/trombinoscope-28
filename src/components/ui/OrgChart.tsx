
import React, { useRef, useEffect, useMemo } from 'react';
import { useTeam } from '@/context/TeamContext';
import MemberCard from './MemberCard';
import { TeamMember } from '@/types';

interface OrgChartNodeProps {
  node: any;
  isRoot?: boolean;
}

interface OrgChartProps {
  selectedDepartment?: string;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ node, isRoot = false }) => {
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className={`flex flex-col items-center`}>
      <div className="mb-1">
        <MemberCard member={node} variant="org" />
      </div>
      
      {hasChildren && (
        <>
          <div className="w-px h-8 bg-primary/30"></div>
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-primary/30"></div>
            <div className="flex justify-center items-start pt-8">
              <div className="flex flex-wrap justify-center gap-12">
                {node.children.map((childNode: any) => (
                  <div key={childNode.id} className="flex-none">
                    <OrgChartNode node={childNode} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const OrgChart: React.FC<OrgChartProps> = ({ selectedDepartment = '' }) => {
  const { teamMembers } = useTeam();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter team members by department if a department is selected
  const filteredTeamMembers = useMemo(() => {
    if (!selectedDepartment) return teamMembers;
    return teamMembers.filter(member => member.department === selectedDepartment);
  }, [teamMembers, selectedDepartment]);
  
  // Build hierarchy from filtered members
  const filteredHierarchy = useMemo(() => {
    if (!selectedDepartment) {
      // If no department filter, use the standard team hierarchy
      return getTeamHierarchy(teamMembers);
    }
    
    // Find the highest-level members of the selected department
    const departmentMembers = filteredTeamMembers;
    
    // Find members whose managers are not in the filtered set
    // These will be our "roots" for the filtered hierarchy
    const rootMembers = departmentMembers.filter(member => {
      if (!member.managerId) return true;
      const managerInDepartment = departmentMembers.some(m => m.id === member.managerId);
      return !managerInDepartment;
    });
    
    // Build trees for each root member
    return rootMembers.map(rootMember => buildMemberTree(rootMember, departmentMembers));
  }, [filteredTeamMembers, selectedDepartment, teamMembers]);
  
  // Helper function to build a tree for a member
  function buildMemberTree(member: TeamMember, members: TeamMember[]) {
    const directReports = members.filter(m => m.managerId === member.id);
    return {
      ...member,
      children: directReports.map(report => buildMemberTree(report, members))
    };
  }
  
  // Function to get hierarchical representation of team
  function getTeamHierarchy(members: TeamMember[], managerId: string | null = null): any[] {
    const directReports = members.filter(member => member.managerId === managerId);
    
    return directReports.map(member => ({
      ...member,
      children: getTeamHierarchy(members, member.id)
    }));
  }
  
  // When the chart renders, center it horizontally
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = containerRef.current.clientWidth;
      
      if (containerWidth > viewportWidth) {
        const scrollTo = (containerWidth - viewportWidth) / 2;
        containerRef.current.scrollLeft = scrollTo;
      }
    }
  }, [filteredHierarchy]);
  
  if (filteredHierarchy.length === 0) {
    return (
      <div className="text-center py-10">
        {selectedDepartment 
          ? `No team members found in the ${selectedDepartment} department.`
          : 'Loading organization chart...'}
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="w-full overflow-x-auto pb-12"
      style={{ minHeight: '500px' }}
    >
      <div className="pt-10 pb-20 min-w-max">
        {filteredHierarchy.map((rootNode, index) => (
          <div key={rootNode.id || index} className="mb-16 last:mb-0">
            <OrgChartNode node={rootNode} isRoot />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgChart;
