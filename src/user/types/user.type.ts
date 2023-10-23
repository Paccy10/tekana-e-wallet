import { User } from '../entities';

export type RequestUser = Omit<User, 'pkid' | 'password'>;
