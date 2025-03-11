
import React from 'react';
import { useTeam } from '@/context/TeamContext';
import OrgChart from '@/components/ui/OrgChart';
import { GitBranchPlus } from 'lucide-react';

const OrgChartView: React.FC = () => {
  const { teamHierarchy } = useTeam();
  
  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 animate-fade-up">
          <GitBranchPlus className="inline-block mr-2 h-6 w-6" />
          Organization Chart
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up">
          Explore your team's structure and relationships. Zoom in to see details, or click on a member to view their profile.
        </p>
      </div>
      
      <div className="glassmorphism rounded-xl p-4 overflow-hidden animate-scale-in">
        <OrgChart />
      </div>
    </div>
  );
};

export default OrgChartView;
