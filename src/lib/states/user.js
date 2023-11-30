import { atomWithStorage } from 'jotai/utils';

export const user = atomWithStorage('user', {
  firstName: '',
  lastName: '',
  email: '',
  passwordHash: '',
  desiredPosition: '',
  salaryExpectation: 0,
  resume: '',
});
