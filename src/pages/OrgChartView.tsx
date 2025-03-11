
import React, { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import OrgChart from '@/components/ui/OrgChart';
import { GitBranchPlus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrgChartView: React.FC = () => {
  const { teamMembers } = useTeam();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  // Get unique departments for filter
  const departments = [...new Set(teamMembers.map(member => member.department))].sort();
  
  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 animate-fade-up">
          <GitBranchPlus className="inline-block mr-2 h-6 w-6" />
          Organization Chart
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up">
          Explore your team's structure and relationships. Filter by department to focus on specific teams.
        </p>
      </div>
      
      <div className="mb-6 glassmorphism rounded-xl p-4 animate-fade-up">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter by Department:</span>
          </div>
          
          <div className="relative flex-1 sm:max-w-xs">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full appearance-none px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(department => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={selectedDepartment === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDepartment("")}
            className="text-xs"
          >
            All
          </Button>
          
          {departments.map(department => (
            <Button
              key={department}
              variant={selectedDepartment === department ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDepartment(department)}
              className="text-xs"
            >
              {department}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="glassmorphism rounded-xl p-4 overflow-hidden animate-scale-in">
        <OrgChart selectedDepartment={selectedDepartment} />
      </div>
    </div>
  );
};

export default OrgChartView;
