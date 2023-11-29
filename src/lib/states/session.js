import { atomWithStorage } from 'jotai/utils';

export const session = atomWithStorage('session', {
  expires: Date.now(),
  token: '',
  userId: '',
});
