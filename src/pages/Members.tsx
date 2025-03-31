import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTeam } from "@/context/TeamContext";
import MemberCard from "@/components/ui/MemberCard";
import { PlusCircle, Search, Filter, Upload } from "lucide-react";
import CSVImportDialog from "@/components/ui/CSVImportDialog";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const MEMBERS_PER_PAGE = 8; // Number of members to display per page

const Members: React.FC = () => {
  const { teamMembers } = useTeam();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(teamMembers);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(teamMembers);

  // Get unique departments for filter
  const { departments } = useTeam();
  const departmentNames = departments.map((dept) => dept.name);

  // Filter members based on search and department
  useEffect(() => {
    const filtered = teamMembers.filter((member) => {
      const matchesSearch =
        searchTerm === "" ||
        `${member.firstname} ${member.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.jobDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.professionnalEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "" || member.department?.name === departmentFilter;

      return matchesSearch && matchesDepartment;
    });

    setFilteredMembers(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [teamMembers, searchTerm, departmentFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);
  const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + MEMBERS_PER_PAGE,
    filteredMembers.length
  );
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page, last page, current page, and one page before and after current
    const pages = [1];

    if (currentPage > 3) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
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
              {departments.map(
                (department) =>
                  department && (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  )
              )}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No members found matching your search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                <span>
                  Showing {startIndex + 1}-{endIndex} of{" "}
                  {filteredMembers.length} members
                </span>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === -1 ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Members;
