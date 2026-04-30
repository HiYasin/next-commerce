export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CUSTOMER = "CUSTOMER",
  GUEST = "GUEST",
}


export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (formData: FormData) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}
