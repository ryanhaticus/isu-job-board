import { atomWithStorage } from 'jotai/utils';

export const session = atomWithStorage('session', {
  token: '',
  expires: Date.now() - 1,
});
