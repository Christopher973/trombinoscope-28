
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTeam } from '@/context/TeamContext';
import MemberForm from '@/components/forms/MemberForm';
import MemberCard from '@/components/ui/MemberCard';
import { 
  Mail, Phone, MapPin, Calendar, Users, BadgeCheck, ChevronLeft,
  Pencil, Trash2, AlertTriangle, X
} from 'lucide-react';

const Member: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeamMember, deleteTeamMember, getDirectReports, teamMembers } = useTeam();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  // Handle new member creation
  const isNewMember = id === 'new';
  
  if (isNewMember) {
    return (
      <div className="page-container max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Link 
            to="/members" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Members
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-border/60 p-6">
          <MemberForm 
            onSuccess={() => navigate('/members')}
            onCancel={() => navigate('/members')}
          />
        </div>
      </div>
    );
  }
  
  // Get member data
  const member = getTeamMember(id || '');
  
  if (!member) {
    return (
      <div className="page-container text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Member Not Found</h2>
        <p className="text-muted-foreground mb-6">The team member you're looking for doesn't exist.</p>
        <Link 
          to="/members" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Members
        </Link>
      </div>
    );
  }
  
  // Get manager
  const manager = member.managerId ? getTeamMember(member.managerId) : null;
  
  // Get direct reports
  const directReports = getDirectReports(member.id);
  
  // Handle delete
  const handleDelete = () => {
    deleteTeamMember(member.id);
    navigate('/members');
  };
  
  if (isEditing) {
    return (
      <div className="page-container max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <button 
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-border/60 p-6">
          <MemberForm 
            memberId={member.id}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <Link 
          to="/members" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Members
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile image and basic info */}
        <div className="lg:col-span-1">
          <div className="glassmorphism rounded-xl overflow-hidden sticky top-20">
            <div className="aspect-square">
              <img 
                src={member.imageUrl} 
                alt={`${member.firstName} ${member.lastName}`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h1 className="text-xl font-semibold">{member.firstName} {member.lastName}</h1>
              <p className="text-muted-foreground mb-4">{member.position}</p>
              
              <div className="space-y-2">
                {member.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`mailto:${member.email}`} 
                      className="text-sm text-primary hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                )}
                
                {member.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`tel:${member.phoneNumber}`} 
                      className="text-sm"
                    >
                      {member.phoneNumber}
                    </a>
                  </div>
                )}
                
                {member.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                )}
                
                {member.startDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {new Date(member.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{member.department}</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 px-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </button>
                
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="py-2 px-3 border border-destructive/30 text-destructive rounded-md hover:bg-destructive/10 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Detailed info and relationships */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio section */}
          {member.bio && (
            <div className="glassmorphism rounded-xl p-6 animate-fade-up">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-muted-foreground">{member.bio}</p>
            </div>
          )}
          
          {/* Skills section */}
          {member.skills && member.skills.length > 0 && (
            <div className="glassmorphism rounded-xl p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <h2 className="text-lg font-semibold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {member.skills.map(skill => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
                  >
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Manager section */}
          {manager && (
            <div className="glassmorphism rounded-xl p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-lg font-semibold mb-3">Manager</h2>
              <MemberCard member={manager} variant="compact" />
            </div>
          )}
          
          {/* Direct reports section */}
          {directReports.length > 0 && (
            <div className="glassmorphism rounded-xl p-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-lg font-semibold mb-3">
                Direct Reports ({directReports.length})
              </h2>
              <div className="space-y-3">
                {directReports.map(report => (
                  <MemberCard key={report.id} member={report} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="bg-destructive/10 p-2 rounded-full mr-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button 
                onClick={() => setIsConfirmingDelete(false)}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-4">
              Are you sure you want to delete <strong>{member.firstName} {member.lastName}</strong>? 
              This action cannot be undone.
            </p>
            
            {directReports.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                <p className="text-amber-800 font-medium mb-1">Warning</p>
                <p className="text-amber-700">
                  This member has {directReports.length} direct report{directReports.length !== 1 && 's'}.
                  Their direct reports will be reassigned to {member.managerId ? 'this member\'s manager' : 'no manager'}.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
