import { atom } from 'jotai';
import { IUser } from '@/lib/models/user';

export const user = atom({
  firstName: '',
  lastName: '',
  email: '',
  passwordHash: '',
  desiredPosition: '',
  salaryExpectation: 0,
  resume: '',
} satisfies IUser);
