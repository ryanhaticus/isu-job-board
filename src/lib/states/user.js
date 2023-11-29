import { atom } from 'jotai';

export const user = atom({
  firstName: '',
  lastName: '',
  email: '',
  passwordHash: '',
  desiredPosition: '',
  salaryExpectation: 0,
  resume: '',
});
