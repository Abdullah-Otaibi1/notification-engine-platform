export type Role = 'Admin' | 'Operations' | 'Auditor' | 'Viewer';

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
