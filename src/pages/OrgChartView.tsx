
import React, { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import OrgChart from '@/components/ui/OrgChart';
import { 
  GitBranchPlus, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  X, 
  ArrowLeft, 
  ArrowRight,
  ChevronDown,
  Search,
  Users,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@/components/ui/tooltip';

const OrgChartView: React.FC = () => {
  const { teamMembers } = useTeam();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openFilters, setOpenFilters] = useState<boolean>(true);
  
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
  
  // Filter departments by search term
  const filteredDepartments = departments.filter(
    department => department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 animate-fade-up flex items-center justify-center">
          <GitBranchPlus className="mr-2 h-6 w-6 text-primary" />
          Organization Chart
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up">
          Visual representation of your team's structure and reporting relationships
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar with filters */}
        <div className="lg:col-span-3">
          <div className="glassmorphism rounded-xl p-4 animate-fade-up sticky top-24">
            <Collapsible open={openFilters} onOpenChange={setOpenFilters}>
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  <span>Department Filters</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedDepartments.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearSelections}
                      className="text-xs flex items-center gap-1 h-7"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </Button>
                  )}
                  
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openFilters ? "transform rotate-180" : ""
                      )} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              
              <CollapsibleContent>
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-1.5 max-h-[40vh] overflow-y-auto pr-2">
                  {filteredDepartments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      No departments found
                    </p>
                  ) : (
                    filteredDepartments.map(department => department && (
                      <Button
                        key={department}
                        variant={selectedDepartments.includes(department) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDepartment(department)}
                        className={cn(
                          "text-xs justify-start",
                          selectedDepartments.includes(department) ? "bg-primary/90 hover:bg-primary/80" : ""
                        )}
                      >
                        <Building className="h-3 w-3 mr-2" />
                        {department}
                        {selectedDepartments.includes(department) && (
                          <span className="ml-auto bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {teamMembers.filter(m => m.department?.name === department).length}
                          </span>
                        )}
                      </Button>
                    ))
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Total Team Members: {teamMembers.length}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <div className="mt-6 border-t border-border/30 pt-4">
              <h3 className="text-sm font-medium mb-3">Zoom Controls</h3>
              <div className="flex items-center gap-2">
                <Tooltip content="Zoom Out">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => adjustZoom(-0.1)}
                    className="h-8 w-8 p-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </Tooltip>
                
                <div className="flex-1 text-center bg-secondary/50 py-1 px-2 rounded-md text-sm">
                  {Math.round(zoomLevel * 100)}%
                </div>
                
                <Tooltip content="Zoom In">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => adjustZoom(0.1)}
                    className="h-8 w-8 p-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setZoomLevel(1)}
                className="mt-2 w-full text-xs"
              >
                Reset Zoom (100%)
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main org chart */}
        <div className="lg:col-span-9 relative animate-scale-in">
          <OrgChart selectedDepartments={selectedDepartments} zoomLevel={zoomLevel} />
        </div>
      </div>
    </div>
  );
};

export default OrgChartView;
