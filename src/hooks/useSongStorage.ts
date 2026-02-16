import { useState, useCallback, useEffect } from 'react';
import { Song, SongLibrary, generateSongId } from '@/types/song';
import { ChordRow } from '@/types/chord';

const STORAGE_KEY = 'chordgrid_songs';

const getStoredLibrary = (): SongLibrary => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse stored songs:', e);
  }
  return { songs: [], bookmarks: [] };
};

const saveLibrary = (library: SongLibrary) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  } catch (e) {
    console.error('Failed to save songs:', e);
  }
};

export function useSongStorage() {
  const [library, setLibrary] = useState<SongLibrary>(getStoredLibrary);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync to localStorage whenever library changes
  useEffect(() => {
    saveLibrary(library);
  }, [library]);

  const saveSong = useCallback((title: string, rows: ChordRow[], existingId?: string) => {
    const now = new Date().toISOString();
    
    setLibrary(prev => {
      if (existingId) {
        // Update existing song
        const updatedSongs = prev.songs.map(song =>
          song.id === existingId
            ? { ...song, title, rows, updatedAt: now }
            : song
        );
        return { ...prev, songs: updatedSongs };
      } else {
        // Create new song
        const newSong: Song = {
          id: generateSongId(),
          title: title || 'Untitled',
          rows,
          createdAt: now,
          updatedAt: now,
          isBookmarked: false,
        };
        return { ...prev, songs: [newSong, ...prev.songs] };
      }
    });
  }, []);

  const deleteSong = useCallback((songId: string) => {
    setLibrary(prev => ({
      songs: prev.songs.filter(s => s.id !== songId),
      bookmarks: prev.bookmarks.filter(id => id !== songId),
    }));
  }, []);

  const toggleBookmark = useCallback((songId: string) => {
    setLibrary(prev => {
      const isBookmarked = prev.bookmarks.includes(songId);
      const newBookmarks = isBookmarked
        ? prev.bookmarks.filter(id => id !== songId)
        : [...prev.bookmarks, songId];
      
      const updatedSongs = prev.songs.map(song =>
        song.id === songId
          ? { ...song, isBookmarked: !isBookmarked }
          : song
      );

      return { songs: updatedSongs, bookmarks: newBookmarks };
    });
  }, []);

  const getSong = useCallback((songId: string): Song | undefined => {
    return library.songs.find(s => s.id === songId);
  }, [library.songs]);

  const filteredSongs = useCallback((showBookmarksOnly: boolean = false) => {
    let songs = library.songs;
    
    if (showBookmarksOnly) {
      songs = songs.filter(s => library.bookmarks.includes(s.id));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      songs = songs.filter(s => s.title.toLowerCase().includes(query));
    }
    
    return songs;
  }, [library, searchQuery]);

  return {
    songs: library.songs,
    bookmarks: library.bookmarks,
    searchQuery,
    setSearchQuery,
    saveSong,
    deleteSong,
    toggleBookmark,
    getSong,
    filteredSongs,
  };
}
