import { atom } from 'jotai';

export type ISearch = {
  query: string;
};

export const search = atom<ISearch>({
  query: '',
});
