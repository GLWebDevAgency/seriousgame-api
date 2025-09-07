import { UserRole } from '../enums/user-role.enum';

export type UserPayload = Readonly<{
  sub: string;
  email: string;
  nickname?: string;
  role: UserRole;
}>;

export type RequestWithUser<T extends UserPayload = UserPayload> = Readonly<{
  user: T;
}>;
