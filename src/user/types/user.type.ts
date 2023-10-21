import { User } from '../user.entity';

export type RequestUser = Omit<User, 'pkid' | 'password'>;
