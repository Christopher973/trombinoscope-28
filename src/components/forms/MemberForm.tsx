import React, { useState, useEffect } from "react";
import { useTeam } from "@/context/TeamContext";
import { TeamMember, Department, Location } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

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
  const {
    teamMembers,
    createTeamMember,
    updateTeamMember,
    getTeamMember,
    uploadImage,
  } = useTeam();

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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Si une nouvelle image a été sélectionnée, l'uploader d'abord
      let imageUrl = formData.imageUrl;
      if (imagePreview && imagePreview !== formData.imageUrl) {
        imageUrl = await uploadImage(imagePreview);
      }

      // Fonction révisée pour le formatage des dates au format ISO-8601 standard
      const formatDateForSubmit = (
        dateValue: string | Date | number | undefined
      ) => {
        if (!dateValue) return null;

        try {
          let date: Date;

          // Cas 1: C'est un nombre (timestamp)
          if (
            typeof dateValue === "number" ||
            (typeof dateValue === "string" && !isNaN(Number(dateValue)))
          ) {
            const timestamp =
              typeof dateValue === "string" ? Number(dateValue) : dateValue;
            date = new Date(timestamp);
            if (isNaN(date.getTime())) {
              console.error(`Timestamp invalide: ${dateValue}`);
              return null;
            }
          }
          // Cas 2: C'est déjà un objet Date
          else if (dateValue instanceof Date) {
            date = dateValue;
          }
          // Cas 3: C'est une chaîne au format YYYY-MM-DD
          else if (
            typeof dateValue === "string" &&
            dateValue.match(/^\d{4}-\d{2}-\d{2}$/)
          ) {
            // Pour éviter les problèmes de timezone, on utilise ce format
            date = new Date(`${dateValue}T12:00:00Z`);
            if (isNaN(date.getTime())) {
              console.error(`Date invalide: ${dateValue}`);
              return null;
            }
          }
          // Cas 4: Autres formats de chaîne de date
          else if (
            typeof dateValue === "string" &&
            !isNaN(Date.parse(dateValue))
          ) {
            date = new Date(dateValue);
          } else {
            console.error(
              `Format de date non reconnu: ${dateValue} (type: ${typeof dateValue})`
            );
            return null;
          }

          // Utiliser directement le format ISO-8601 standard (qui est ce que toISOString() produit)
          const isoDate = date.toISOString();
          console.log(`Date convertie: ${dateValue} -> ${isoDate}`);

          return isoDate;
        } catch (error) {
          console.error(
            `Erreur lors du formatage de la date: ${dateValue}`,
            error
          );
          return null;
        }
      };

      const birthday = formatDateForSubmit(formData.birthday);
      const startDate = formatDateForSubmit(formData.startDate);

      console.log("Dates formatées:", { birthday, startDate });

      const cleanedData = {
        imageUrl: imageUrl,
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
        birthday: birthday,
        startDate: startDate,
      };

      // Vérifier que les dates sont dans un format valide avant soumission
      if (formData.birthday && !cleanedData.birthday) {
        throw new Error("Format de date d'anniversaire invalide");
      }

      if (formData.startDate && !cleanedData.startDate) {
        throw new Error("Format de date de début invalide");
      }

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
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Échec de l'enregistrement du membre",
        variant: "destructive",
      });
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const isEditing = !!memberId;

  // Get unique departments and locations for dropdowns
  const { departments } = useTeam();
  const { locations } = useTeam();

  // La partie qui gère l'affichage des dates dans les champs de formulaire nécessite aussi d'être mise à jour
  // Pour gérer correctement les timestamps
  const formatDateForInput = (
    dateValue: string | number | Date | undefined
  ) => {
    if (!dateValue) return "";

    let date: Date;

    // Si c'est un timestamp numérique (ou une chaîne représentant un nombre)
    if (
      typeof dateValue === "number" ||
      (typeof dateValue === "string" && !isNaN(Number(dateValue)))
    ) {
      date = new Date(
        typeof dateValue === "string" ? Number(dateValue) : dateValue
      );
    }
    // Si c'est déjà une date
    else if (dateValue instanceof Date) {
      date = dateValue;
    }
    // Si c'est une chaîne ISO ou autre format de date
    else {
      date = new Date(dateValue);
    }

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.error(`Date invalide pour l'affichage: ${dateValue}`);
      return "";
    }

    // Formater en YYYY-MM-DD pour le champ input type="date"
    return date.toISOString().split("T")[0];
  };

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

          {/* 
            <div>
            <label className="block text-sm font-medium mb-1">
              Management Category
            </label>
            <select
              name="managementCategory"
              value={formData.managementCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Category</option>
              <option value="Individual Contributor">
                Individual Contributor
              </option>
              <option value="Management">Management</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          */}

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
              value={formatDateForInput(formData.startDate)}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* 
          <div>
            <label className="block text-sm font-medium mb-1">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formatDateForInput(formData.birthday)}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          */}

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
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 border border-border rounded-md overflow-hidden">
              <img
                src={imagePreview || formData.imageUrl || "/placeholder.svg"}
                alt="Member preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-3 py-2 border border-border rounded-md cursor-pointer bg-background hover:bg-secondary/50 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choisir une image
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Formats acceptés: JPG, PNG, GIF (max. 5MB)
              </p>
            </div>
          </div>
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
