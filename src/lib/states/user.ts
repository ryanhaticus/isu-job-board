import { atom } from 'jotai';
import { IUser } from '@/lib/models/user';

export const user = atom<IUser>({
  firstName: '',
  lastName: '',
  email: '',
  passwordHash: '',
  desiredPosition: '',
  salaryExpectation: 0,
  resume: '',
});
