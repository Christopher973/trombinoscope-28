import React, { useState, useEffect } from "react";
import { useTeam } from "@/context/TeamContext";
import { TeamMember, Department, Location } from "@/types";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface MemberFormProps {
  memberId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  memberId,
  onSuccess,
  onCancel,
}) => {
  const { teamMembers, createTeamMember, updateTeamMember, getTeamMember } =
    useTeam();

  const [formData, setFormData] = useState<Omit<TeamMember, "id">>({
    firstname: "",
    lastname: "",
    gender: "",
    professionnalEmail: "",
    jobDescription: "",
    managementCategory: "",
    serviceAssignmentCode: "",
    departmentId: undefined,
    department: undefined,
    managerId: null,
    locationId: undefined,
    location: undefined,
    imageUrl: "https://i.pravatar.cc/300",
    startDate: new Date().toISOString().split("T")[0],
    birthday: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      managerId: value === "" ? null : Number(value),
    }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        departmentId: undefined,
        department: undefined,
      }));
    } else {
      const departmentId = Number(value);
      const department = teamMembers.find(
        (m) => m.departmentId === departmentId
      )?.department;
      setFormData((prev) => ({ ...prev, departmentId, department }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        locationId: undefined,
        location: undefined,
      }));
    } else {
      const locationId = Number(value);
      const location = teamMembers.find(
        (m) => m.locationId === locationId
      )?.location;
      setFormData((prev) => ({ ...prev, locationId, location }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      gender: formData.gender,
      professionnalEmail: formData.professionnalEmail,
      jobDescription: formData.jobDescription,
      managementCategory: formData.managementCategory,
      serviceAssignmentCode: formData.serviceAssignmentCode,
      departmentId: formData.departmentId,
      managerId: formData.managerId || null,
      locationId: formData.locationId,
      photo: formData.imageUrl, // Renommer imageUrl en photo si c'est le nom attendu
      birthDate: formData.birthday, // Renommer birthday en birthDate
      startDate: formData.startDate,
    };

    try {
      if (isEditing && memberId) {
        updateTeamMember(memberId, cleanedData);
      } else {
        createTeamMember(cleanedData);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const isEditing = !!memberId;

  // Get unique departments and locations for dropdowns
  const departments = [
    ...new Set(teamMembers.map((m) => m.department).filter(Boolean)),
  ];
  const locations = [
    ...new Set(teamMembers.map((m) => m.location).filter(Boolean)),
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Team Member" : "Add New Team Member"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Professional Email
            </label>
            <input
              type="email"
              name="professionnalEmail"
              value={formData.professionnalEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <input
              type="text"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Management Category
            </label>
            <select
              name="managementCategory"
              value={formData.managementCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select Category</option>
              <option value="Individual Contributor">
                Individual Contributor
              </option>
              <option value="Management">Management</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              name="departmentId"
              value={formData.departmentId || ""}
              onChange={handleDepartmentChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Department</option>
              {departments.map(
                (dept) =>
                  dept && (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              name="locationId"
              value={formData.locationId || ""}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Location</option>
              {locations.map(
                (loc) =>
                  loc && (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={
                typeof formData.startDate === "string"
                  ? formData.startDate.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={
                typeof formData.birthday === "string"
                  ? formData.birthday.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Service Assignment Code
            </label>
            <input
              type="text"
              name="serviceAssignmentCode"
              value={formData.serviceAssignmentCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Manager</label>
          <select
            name="managerId"
            value={formData.managerId === null ? "" : formData.managerId}
            onChange={handleManagerChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">No Manager (Top Level)</option>
            {teamMembers
              .filter((m) => m.id !== memberId) // Can't be your own manager
              .map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.firstname} {manager.lastname} -{" "}
                  {manager.jobDescription}
                </option>
              ))}
          </select>
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
            {isEditing ? "Update Member" : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
