// types/user.ts
export interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'volunteer';
  }