import { ChordRow } from './chord';

export interface Song {
  id: string;
  title: string;
  rows: ChordRow[];
  createdAt: string;
  updatedAt: string;
  visibility?: 'public' | 'unlisted' | 'private';
  owner?: { id: number; name: string } | string; // owner may be name or object from API
  bookmark_count?: number;
  isBookmarked?: boolean; // local fallback
}

export interface SongLibrary {
  songs: Song[];
  bookmarks: string[]; // song ids
}

export const generateSongId = (): string => {
  return `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
