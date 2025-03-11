
import React from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '@/context/TeamContext';
import MemberCard from '@/components/ui/MemberCard';
import { User, GitBranchPlus, Plus } from 'lucide-react';

const Index = () => {
  const { teamMembers } = useTeam();
  
  // Get just the top 6 members for featured display
  const featuredMembers = teamMembers.slice(0, 6);
  
  return (
    <div className="page-container">
      {/* Hero section */}
      <section className="py-20 flex flex-col items-center text-center animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Team Trombinoscope</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Simplify your team management with our interactive organization chart. 
          View team hierarchies, member profiles, and manage your organization with ease.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/members"
            className="py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <User className="h-5 w-5" />
            Browse All Members
          </Link>
          <Link
            to="/org-chart"
            className="py-2 px-4 bg-white border border-border rounded-md shadow-sm hover:bg-secondary/50 transition-colors flex items-center gap-2"
          >
            <GitBranchPlus className="h-5 w-5" />
            View Org Chart
          </Link>
        </div>
      </section>
      
      {/* Featured members section */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading">Team Highlights</h2>
          <Link 
            to="/members" 
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {featuredMembers.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
      
      {/* Admin actions */}
      <section className="py-12">
        <h2 className="section-heading">Team Management</h2>
        <div className="glassmorphism rounded-xl p-6 md:p-8 animate-scale-in">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Manage Your Team</h3>
              <p className="text-muted-foreground">
                Add new team members, update existing profiles, or view your organization chart.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/members/new"
                className="py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add New Member
              </Link>
              <Link
                to="/org-chart"
                className="py-2 px-4 bg-white border border-border rounded-md shadow-sm hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2"
              >
                <GitBranchPlus className="h-5 w-5" />
                Organization Chart
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
