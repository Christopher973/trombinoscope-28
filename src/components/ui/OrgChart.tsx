
import React, { useRef, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import MemberCard from './MemberCard';

interface OrgChartNodeProps {
  node: any;
  isRoot?: boolean;
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

const OrgChart: React.FC = () => {
  const { teamHierarchy } = useTeam();
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  }, [teamHierarchy]);
  
  if (!teamHierarchy.length) {
    return <div className="text-center py-10">Loading organization chart...</div>;
  }
  
  // Assuming the CEO/root is the first item in the hierarchy
  const rootNode = teamHierarchy[0];
  
  return (
    <div 
      ref={containerRef}
      className="w-full overflow-x-auto pb-12"
      style={{ minHeight: '500px' }}
    >
      <div className="pt-10 pb-20 min-w-max">
        <OrgChartNode node={rootNode} isRoot />
      </div>
    </div>
  );
};

export default OrgChart;
