
export enum Role {
  ADMIN = "Admin",
  HRM = "HRM",
  DEPARTMENT = "Department",
  USER = "User",
  GUEST = "Guest",
  IMPACT_PLAYER = "ImpactPlayer",
}

export interface Organization {
  id: string; // company_id
  name: string;
  email: string;
  contact: string;
  adminPasswordHash: string; // Store hashed passwords
}

export interface Department {
  id: string; // department_id
  companyId: string;
  name: string;
  passwordHash: string; // Store hashed passwords
  members: string[]; // User IDs of department members
}

export interface User {
  id: string; // user_id
  username?: string; // Optional, for identified users
  passwordHash: string; // Store hashed passwords
  role: Role;
  companyId?: string; // For HRM, Department users
  departmentId?: string; // For Department users
}

export enum ComplaintStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  REOPENED = "Reopened",
  CLOSED = "Closed",
}

export interface Evidence {
  fileName: string;
  fileType: string;
  dataUrl: string; // Base64 encoded file or link
}

export interface Feedback {
  by: string; // User ID or "Department" or "HRM"
  message: string;
  timestamp: string;
}

export interface Complaint {
  caseId: string;
  companyId: string;
  departmentId: string;
  description: string;
  evidence: Evidence[];
  isAnonymous: boolean;
  submittedByUserId?: string; // Only if not anonymous
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  feedback: Feedback[];
  resolutionFeedback?: string;
  satisfaction?: {
    satisfied: boolean;
    reason?: string;
  };
  impactPlayers?: string[]; // User IDs of impact players
  impactPlayerFeedback?: { userId: string; resolved: boolean; comment: string }[];
}

export interface Notification {
  id: string;
  recipientId: string; // User ID, Department ID, or special "Admin" / "HRM"
  message: string;
  caseId?: string;
  isRead: boolean;
  timestamp: string;
  isAnonymousComplaint?: boolean;
}

export interface LoggedInUser {
  id: string;
  username?: string;
  role: Role;
  companyId?: string;
  departmentId?: string;
}
