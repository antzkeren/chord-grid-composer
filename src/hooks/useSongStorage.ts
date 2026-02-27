import { useState, useCallback, useEffect } from 'react';
import { Song, SongLibrary, generateSongId } from '@/types/song';
import { ChordRow } from '@/types/chord';
import api from '@/lib/api';

const STORAGE_KEY = 'chordgrid_songs';

// Fetch songs from API
const fetchSongsFromApi = async (): Promise<Song[]> => {
  try {
    const response = await api.get('/api/songs');
    return response.data.map((song: any) => ({
      id: String(song.id),
      title: song.title,
      rows: song.chord_rows?.map((row: any) => ({
        id: `row-${row.row_index}`,
        cells: (row.chords || []).map((chord: any, idx: number) => ({
          id: `cell-${idx}`,
          // Handle both string chords (from seeder) and object chords (from save)
          chord: typeof chord === 'string' ? chord : chord?.chord || null,
          beats: chord?.beats || 4,
          isNote: chord?.isNote || false,
        })),
      })) || [],
      createdAt: song.created_at,
      updatedAt: song.updated_at,
      visibility: song.visibility,
      isBookmarked: song.bookmarks_count > 0,
      owner: song.owner?.name,
      tempo: song.tempo,
      timeSignature: song.time_signature,
      baseChord: song.base_chord,
    }));
  } catch (error) {
    console.error('Failed to fetch songs from API:', error);
    return [];
  }
};

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
  const [library, setLibrary] = useState<SongLibrary>({ songs: [], bookmarks: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from API on mount
  useEffect(() => {
    const loadSongs = async () => {
      const apiSongs = await fetchSongsFromApi();
      if (apiSongs.length > 0) {
        setLibrary({ songs: apiSongs, bookmarks: [] });
      } else {
        // Fallback to localStorage if API returns empty
        setLibrary(getStoredLibrary());
      }
      setIsLoading(false);
    };
    loadSongs();
  }, []);

  // Sync to localStorage whenever library changes
  useEffect(() => {
    saveLibrary(library);
  }, [library]);

  // Save song to backend API
  const saveSongToApi = useCallback(async (
    title: string,
    rows: ChordRow[],
    existingId?: string,
    visibility: 'public' | 'unlisted' | 'private' = 'private',
    tempo?: number,
    timeSignature?: string,
    baseChord?: string,
    forceCreateNew: boolean = false
  ): Promise<{ id: string | null; isNew: boolean }> => {
    try {
      const songData = {
        title: title || 'Untitled',
        visibility,
        tempo,
        time_signature: timeSignature,
        base_chord: baseChord,
        rows: rows,
      };

      // If forceCreateNew is true (user confirmed to save as copy), always create new
      if (forceCreateNew) {
        console.log('Force creating new song');
        const response = await api.post('/api/songs', songData);
        return { id: String(response.data.id), isNew: true };
      }

      // If we have an existing ID, try to update first
      if (existingId && !existingId.startsWith('song_')) {
        try {
          console.log('Trying to update song:', existingId);
          await api.put(`/api/songs/${existingId}`, songData);
          console.log('Update successful!');
          return { id: existingId, isNew: false };
        } catch (updateError: any) {
          // Update failed - check status code
          if (updateError.response?.status === 403) {
            console.log('Not owner (403), will create new copy');
          } else {
            console.log('Update failed with status:', updateError.response?.status, updateError.message);
          }
          // For any error, fall through to create new
        }
      } else {
        console.log('No existing ID, creating new song');
      }
      
      // Create new song
      const response = await api.post('/api/songs', songData);
      return { id: String(response.data.id), isNew: true };
    } catch (error: any) {
      console.error('Failed to save song to API:', error);
      return { id: generateSongId(), isNew: true };
    }
  }, []);

  const saveSong = useCallback(
    async (
      title: string,
      rows: ChordRow[],
      existingId?: string,
      owner?: string,
      visibility: 'public' | 'unlisted' | 'private' = 'private',
      tempo?: number,
      timeSignature?: string,
      baseChord?: string,
      forceCreateNew: boolean = false
    ) => {
      const now = new Date().toISOString();

      // Save to backend API
      const result = await saveSongToApi(title, rows, existingId, visibility, tempo, timeSignature, baseChord, forceCreateNew);

      setLibrary(prev => {
        if (result.id && !result.isNew && existingId && !existingId.startsWith('song_')) {
          // Update existing song with backend ID
          const updatedSongs = prev.songs.map(song =>
            song.id === existingId
              ? { ...song, title, rows, updatedAt: now, visibility }
              : song
          );
          return { ...prev, songs: updatedSongs };
        } else {
          // Create new song - use backend ID if available
          const newSong: Song = {
            id: result.id || generateSongId(),
            title: title || 'Untitled',
            rows,
            createdAt: now,
            updatedAt: now,
            visibility,
            isBookmarked: false,
            owner,
            tempo,
            timeSignature,
            baseChord,
          };
          return { ...prev, songs: [newSong, ...prev.songs] };
        }
      });

      return { id: result.id, isNew: result.isNew };
    },
    [saveSongToApi]
  );

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
    isLoading,
  };
}
