export interface UserEntity {
  id: number;
  fullName: string;
  username: string;
  createdAt: Date;
  role: 'ADMIN' | 'STAFF' | 'USER'
}