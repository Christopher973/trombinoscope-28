
import React, { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import OrgChart from '@/components/ui/OrgChart';
import { GitBranchPlus, Filter, ZoomIn, ZoomOut, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const OrgChartView: React.FC = () => {
  const { teamMembers } = useTeam();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  // Get unique departments for filter
  const departments = [...new Set(
    teamMembers
      .map(member => member.department?.name)
      .filter(Boolean)
  )].sort();
  
  // Handle department selection/deselection
  const toggleDepartment = (department: string) => {
    if (selectedDepartments.includes(department)) {
      setSelectedDepartments(prev => prev.filter(d => d !== department));
    } else {
      setSelectedDepartments(prev => [...prev, department]);
    }
  };
  
  // Clear all selected departments
  const clearSelections = () => {
    setSelectedDepartments([]);
  };
  
  // Adjust zoom level
  const adjustZoom = (increment: number) => {
    setZoomLevel(prev => {
      const newZoom = prev + increment;
      return Math.min(Math.max(newZoom, 0.5), 2); // Limit zoom between 0.5x and 2x
    });
  };
  
  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 animate-fade-up">
          <GitBranchPlus className="inline-block mr-2 h-6 w-6" />
          Organization Chart
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up">
          Explore your team's structure and relationships. Select multiple departments to compare teams.
        </p>
      </div>
      
      <div className="mb-6 glassmorphism rounded-xl p-4 animate-fade-up">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter Departments:</span>
          </div>
          
          {selectedDepartments.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearSelections}
              className="text-xs flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {departments.map(department => department && (
            <Button
              key={department}
              variant={selectedDepartments.includes(department) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleDepartment(department)}
              className="text-xs"
            >
              {department}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="relative glassmorphism rounded-xl p-4 overflow-hidden animate-scale-in">
        {/* Chart controls */}
        <div className={cn(
          "absolute right-4 top-4 z-10 flex flex-col gap-2 glassmorphism p-2 rounded-lg transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-40"
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        >
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => adjustZoom(0.1)}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => adjustZoom(-0.1)}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setZoomLevel(1)}
            title="Reset Zoom"
            className="text-xs"
          >
            1x
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 glassmorphism p-2 rounded-lg">
          <Button 
            variant="outline" 
            size="icon" 
            title="Scroll Left"
            onClick={() => {
              if (document.querySelector('.org-chart-container')) {
                const container = document.querySelector('.org-chart-container') as HTMLElement;
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            title="Scroll Right"
            onClick={() => {
              if (document.querySelector('.org-chart-container')) {
                const container = document.querySelector('.org-chart-container') as HTMLElement;
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <OrgChart selectedDepartments={selectedDepartments} zoomLevel={zoomLevel} />
      </div>
    </div>
  );
};

export default OrgChartView;
