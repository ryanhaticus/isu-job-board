import { atomWithStorage } from 'jotai/utils';
import { ISession } from '@/lib/models/session';

export const session = atomWithStorage<ISession>('session', {
  expires: Date.now(),
  token: '',
  userId: '',
});
