import { atom } from 'jotai';
import { ISession } from '@/lib/models/session';

export const session = atom({
  expires: Date.now(),
  token: '',
  userId: '',
} satisfies ISession);
