import { atomWithStorage } from 'jotai/utils';
import { ISession } from '@/lib/models/session';

export const session = atomWithStorage('session', {
  expires: Date.now(),
  token: '',
  userId: '',
} satisfies ISession);
