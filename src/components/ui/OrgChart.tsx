
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useTeam } from '@/context/TeamContext';
import MemberCard from './MemberCard';
import { TeamMember } from '@/types';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface OrgChartNodeProps {
  node: any;
  isRoot?: boolean;
  expandAll: boolean;
}

interface OrgChartProps {
  selectedDepartments: string[];
  zoomLevel: number;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ node, isRoot = false, expandAll }) => {
  const hasChildren = node.children && node.children.length > 0;
  const [isOpen, setIsOpen] = useState(expandAll || isRoot);
  
  // Update open state when expandAll changes
  useEffect(() => {
    if (expandAll) setIsOpen(true);
  }, [expandAll]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-1 relative">
        <MemberCard member={node} variant="org" />
        
        {hasChildren && (
          <div 
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer z-10 border border-primary/20 hover:bg-primary/20 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-xs font-medium">
              {isOpen ? '−' : '+'}
            </span>
          </div>
        )}
      </div>
      
      {hasChildren && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <div className="pt-4">
              <div className="w-px h-8 bg-primary/30"></div>
              <div className="relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-primary/30"></div>
                <div className="flex justify-center items-start pt-8">
                  <div className="flex flex-wrap justify-center gap-12">
                    {node.children.map((childNode: any) => (
                      <div key={childNode.id} className="flex-none">
                        <OrgChartNode node={childNode} expandAll={expandAll} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

const OrgChart: React.FC<OrgChartProps> = ({ selectedDepartments = [], zoomLevel = 1 }) => {
  const { teamMembers } = useTeam();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [expandAll, setExpandAll] = useState(false);
  const [centerPosition, setCenterPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  
  // Filter team members by departments if departments are selected
  const filteredTeamMembers = useMemo(() => {
    if (selectedDepartments.length === 0) return teamMembers;
    return teamMembers.filter(member => 
      member.department && selectedDepartments.includes(member.department.name)
    );
  }, [teamMembers, selectedDepartments]);
  
  // Build hierarchy from filtered members
  const filteredHierarchy = useMemo(() => {
    if (selectedDepartments.length === 0) {
      // If no department filter, use the standard team hierarchy
      return getTeamHierarchy(teamMembers);
    }
    
    // Find the highest-level members of the selected departments
    const departmentMembers = filteredTeamMembers;
    
    // Find members whose managers are not in the filtered set
    // These will be our "roots" for the filtered hierarchy
    const rootMembers = departmentMembers.filter(member => {
      if (!member.managerId) return true;
      const managerInFilteredSet = departmentMembers.some(m => m.id === member.managerId);
      return !managerInFilteredSet;
    });
    
    // Build trees for each root member
    return rootMembers.map(rootMember => buildMemberTree(rootMember, departmentMembers));
  }, [filteredTeamMembers, selectedDepartments, teamMembers]);
  
  // Helper function to build a tree for a member
  function buildMemberTree(member: TeamMember, members: TeamMember[]) {
    const directReports = members.filter(m => m.managerId === member.id);
    return {
      ...member,
      children: directReports.map(report => buildMemberTree(report, members))
    };
  }
  
  // Function to get hierarchical representation of team
  function getTeamHierarchy(members: TeamMember[], managerId: number | null = null): any[] {
    const directReports = members.filter(member => member.managerId === managerId);
    
    return directReports.map(member => ({
      ...member,
      children: getTeamHierarchy(members, member.id)
    }));
  }
  
  // When the chart renders or zoom changes, ensure the container is set up properly
  useEffect(() => {
    if (containerRef.current) {
      // Center the chart horizontally
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = containerRef.current.clientWidth;
      
      if (containerWidth > viewportWidth) {
        const scrollTo = (containerWidth - viewportWidth) / 2;
        containerRef.current.scrollLeft = scrollTo;
        setScrollPosition({ x: scrollTo, y: 0 });
      }
      
      setLoading(false);
    }
  }, [filteredHierarchy, zoomLevel]);
  
  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX, 
        y: e.clientY 
      });
      setCenterPosition({
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop
      });
      document.body.style.cursor = 'grabbing';
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    const newScrollX = centerPosition.x - dx;
    const newScrollY = centerPosition.y - dy;
    
    containerRef.current.scrollTo({
      left: newScrollX,
      top: newScrollY,
      behavior: 'auto'
    });
    
    setScrollPosition({ x: newScrollX, y: newScrollY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    }
  };
  
  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (filteredHierarchy.length === 0) {
    return (
      <div className="text-center py-10 glassmorphism rounded-xl p-8">
        <h3 className="text-lg font-medium mb-2">No Team Members Found</h3>
        <p className="text-muted-foreground">
          {selectedDepartments.length > 0 
            ? `No team members found in the selected department(s).`
            : 'There are no team members to display in the organization chart.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 glassmorphism p-2 rounded-lg">
        <Tooltip content="Expand all branches">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleExpandAll}
            className="text-xs"
          >
            {expandAll ? 'Collapse' : 'Expand All'}
          </Button>
        </Tooltip>
      </div>
      
      <div className="text-center text-xs text-muted-foreground bg-primary/5 p-2 rounded-md mb-4">
        <span className="font-medium">Tip:</span> Click and drag to move around the chart. Use the + and - buttons to expand or collapse branches.
      </div>
      
      <div 
        ref={containerRef}
        className="org-chart-container w-full overflow-x-auto overflow-y-auto pb-12 relative glassmorphism rounded-xl p-6"
        style={{ 
          minHeight: '500px',
          maxHeight: '70vh',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="pt-10 pb-20 min-w-max transition-transform duration-300"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center'
          }}
        >
          {filteredHierarchy.map((rootNode, index) => (
            <div key={rootNode.id || index} className="mb-16 last:mb-0">
              <OrgChartNode node={rootNode} isRoot expandAll={expandAll} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
