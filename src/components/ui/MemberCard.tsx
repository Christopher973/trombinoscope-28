import React from "react";
import { Link } from "react-router-dom";
import { TeamMember } from "@/types";
import { UserRound, Mail, Phone } from "lucide-react";

interface MemberCardProps {
  member: TeamMember;
  variant?: "default" | "compact" | "org";
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  variant = "default",
}) => {
  if (variant === "org") {
    return (
      <div className="org-chart-node w-60 transition-all hover:shadow-md flex flex-col items-center p-3">
        <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-primary/20">
          <img
            src={member.imageUrl || "/placeholder.svg"}
            alt={`${member.firstname} ${member.lastname}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <h3 className="font-medium text-sm">
          {member.firstname} {member.lastname}
        </h3>
        <p className="text-xs text-muted-foreground">{member.jobDescription}</p>
        <Link
          to={`/members/${member.id}`}
          className="mt-2 text-xs text-primary underline hover:text-primary/80 transition-colors"
        >
          Voir détails
        </Link>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/members/${member.id}`} className="block">
        <div className="member-card card-hover p-4 flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-border">
            <img
              src={member.imageUrl || "/placeholder.svg"}
              alt={`${member.firstname} ${member.lastname}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate">
              {member.firstname} {member.lastname}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {member.jobDescription}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/members/${member.id}`} className="block h-full">
      <div className="member-card card-hover h-full flex flex-col">
        <div className="aspect-square overflow-hidden">
          <img
            src={member.imageUrl || "/placeholder.svg"}
            alt={`${member.firstname} ${member.lastname}`}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium">
            {member.firstname} {member.lastname}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {member.jobDescription}
          </p>
          <div className="mt-auto">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <UserRound className="h-3 w-3" />
              <span>{member.department?.name}</span>
            </div>
            {member.professionnalEmail && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{member.professionnalEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MemberCard;
