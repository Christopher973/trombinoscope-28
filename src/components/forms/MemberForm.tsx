
import React, { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { TeamMember } from '@/types';
import { toast } from '@/components/ui/sonner';
import { X } from 'lucide-react';

interface MemberFormProps {
  memberId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  memberId,
  onSuccess,
  onCancel
}) => {
  const { teamMembers, addTeamMember, updateTeamMember, getTeamMember } = useTeam();
  
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    managerId: null,
    imageUrl: 'https://i.pravatar.cc/300',
    bio: '',
    startDate: '',
    phoneNumber: '',
    location: '',
    skills: []
  });
  
  const [newSkill, setNewSkill] = useState('');
  const isEditing = !!memberId;
  
  // If editing, load the member data
  useEffect(() => {
    if (memberId) {
      const member = getTeamMember(memberId);
      if (member) {
        const { id, ...memberData } = member;
        setFormData(memberData);
      }
    }
  }, [memberId, getTeamMember]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      managerId: value === '' ? null : value 
    }));
  };
  
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && memberId) {
        updateTeamMember({ id: memberId, ...formData });
      } else {
        addTeamMember(formData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to save team member');
      console.error(error);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Profile Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Manager</label>
          <select
            name="managerId"
            value={formData.managerId || ''}
            onChange={handleManagerChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">No Manager (Top Level)</option>
            {teamMembers
              .filter(m => m.id !== memberId) // Can't be your own manager
              .map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.firstName} {manager.lastName} - {manager.position}
                </option>
              ))
            }
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.skills?.map(skill => (
              <span 
                key={skill} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 text-primary/70 hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {isEditing ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
