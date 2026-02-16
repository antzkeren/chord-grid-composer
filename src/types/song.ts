import { ChordRow } from './chord';

export interface Song {
  id: string;
  title: string;
  rows: ChordRow[];
  createdAt: string;
  updatedAt: string;
  isBookmarked: boolean;
}

export interface SongLibrary {
  songs: Song[];
  bookmarks: string[]; // song ids
}

export const generateSongId = (): string => {
  return `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
