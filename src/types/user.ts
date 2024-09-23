type UserRole = 'ADMIN' | 'USER';

export type User =
  | {
      id: string;
      created_at: Date;
      email: string;
      fullname?: string;
      image?: string;
      active: boolean;
      role: UserRole;
    }
  | undefined;
