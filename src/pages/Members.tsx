
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '@/context/TeamContext';
import MemberCard from '@/components/ui/MemberCard';
import { PlusCircle, Search, Filter, Upload } from 'lucide-react';
import CSVImportDialog from '@/components/ui/CSVImportDialog';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Members: React.FC = () => {
  const { teamMembers } = useTeam();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(teamMembers);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 8; // Number of members per page
  
  // Get unique departments for filter
  const departments = [...new Set(
    teamMembers
      .map(member => member.department?.name)
      .filter(Boolean)
  )];
  
  // Filter members based on search and department
  useEffect(() => {
    const filtered = teamMembers.filter(member => {
      const matchesSearch = searchTerm === '' || 
        `${member.firstname} ${member.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.professionnalEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDepartment = departmentFilter === '' || member.department?.name === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    });
    
    setFilteredMembers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [teamMembers, searchTerm, departmentFilter]);
  
  // Calculate pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Generate page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to create pagination items with limited display for large page counts
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => paginate(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => paginate(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Calculate range of pages to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(totalPages - 3, 2);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => paginate(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => paginate(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <CSVImportDialog>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
          </CSVImportDialog>
          
          <Link
            to="/members/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Member
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-border/60 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full appearance-none pl-9 pr-8 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(department => department && (
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
      </div>
      
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No members found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {currentMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="my-6">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => paginate(currentPage - 1)} 
                    />
                  </PaginationItem>
                )}
                
                {getPaginationItems()}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => paginate(currentPage + 1)} 
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
          
          <div className="text-center text-sm text-muted-foreground mt-2">
            Showing {indexOfFirstMember + 1} to {Math.min(indexOfLastMember, filteredMembers.length)} of {filteredMembers.length} members
          </div>
        </>
      )}
    </div>
  );
};

export default Members;
