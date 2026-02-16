import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChordGrid } from '@/components/ChordGrid';
import { ChordKeyboard } from '@/components/ChordKeyboard';
import { SongLibrary } from '@/components/SongLibrary';
import { useChordGrid } from '@/hooks/useChordGrid';
import { useSongStorage } from '@/hooks/useSongStorage';
import { Song } from '@/types/song';
import { toast } from 'sonner';

const Index = () => {
  const {
    rows,
    selectedCell,
    selectedKey,
    selectedBeats,
    songTitle,
    setRows,
    setSelectedCell,
    setSelectedKey,
    setSelectedBeats,
    setSongTitle,
    selectChord,
    addBassNote,
    addRow,
    deleteRow,
    addSection,
    updateSection,
    removeSection,
    addNote,
    updateNote,
    removeNote,
    clearCell,
    resetGrid,
    exportToText,
    getSelectedCellData,
    updateCellBeats,
    customChords,
    removeCustomChord,
    duplicateRows,
  } = useChordGrid();

  const {
    songs,
    bookmarks,
    searchQuery,
    setSearchQuery,
    saveSong,
    deleteSong,
    toggleBookmark,
    filteredSongs,
  } = useSongStorage();

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Store initial state to track unsaved changes
  const initialStateRef = useRef({ rows, songTitle, currentSongId });

  // Check for unsaved changes
  useEffect(() => {
    const isDifferent = (
      JSON.stringify(rows) !== JSON.stringify(initialStateRef.current.rows) ||
      songTitle !== initialStateRef.current.songTitle ||
      currentSongId !== initialStateRef.current.currentSongId
    );
    setHasUnsavedChanges(isDifferent);
  }, [rows, songTitle, currentSongId]);

  const handleSaveSong = () => {
    saveSong(songTitle, rows, currentSongId);
    // Update initial state after saving
    initialStateRef.current = { rows: JSON.parse(JSON.stringify(rows)), songTitle, currentSongId };
    toast.success(currentSongId ? 'Lagu diupdate!' : 'Lagu tersimpan!');
  };

  const handleNew = () => {
    if (hasUnsavedChanges) {
      if (!confirm('Ada perubahan yang belum disimpan. Buat chart baru?')) {
        return;
      }
    }
    // Create fresh empty rows
    const emptyRows = [
      {
        id: Math.random().toString(36).substring(2, 9),
        cells: [
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
        ],
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        cells: [
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
          { id: Math.random().toString(36).substring(2, 9), chord: null, beats: 4, isNote: false },
        ],
      },
    ];
    setRows(emptyRows);
    setSongTitle('');
    setCurrentSongId(undefined);
    initialStateRef.current = { rows: JSON.parse(JSON.stringify(emptyRows)), songTitle: '', currentSongId: undefined };
    toast.info('Chart baru dibuat');
  };

  const handleLoadSong = (song: Song) => {
    if (hasUnsavedChanges) {
      if (!confirm('Ada perubahan yang belum disimpan. Muat lagu lain?')) {
        return;
      }
    }
    setRows(song.rows);
    setSongTitle(song.title);
    setCurrentSongId(song.id);
    setSelectedCell(null);
    initialStateRef.current = { rows: JSON.parse(JSON.stringify(song.rows)), songTitle: song.title, currentSongId: song.id };
    toast.success(`"${song.title}" dimuat`);
  };

  return (
    <div className="h-screen sm:h-auto sm:min-h-screen flex flex-col bg-background">
      <Header
        songTitle={songTitle}
        onTitleChange={setSongTitle}
        onSave={handleSaveSong}
        onNew={handleNew}
        onOpenLibrary={() => setLibraryOpen(true)}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <ChordGrid
        rows={rows}
        selectedCell={selectedCell}
        selectedRows={selectedRows}
        onCellSelect={(rowId, cellId) => setSelectedCell({ rowId, cellId })}
        onToggleRowSelect={(rowId) => {
          setSelectedRows(prev => 
            prev.includes(rowId) 
              ? prev.filter(id => id !== rowId)
              : [...prev, rowId]
          );
        }}
        onDuplicateRows={(rowIds) => {
          duplicateRows(rowIds);
          setSelectedRows([]);
          toast.success(`${rowIds.length} baris diduplikasi`);
        }}
        onReorderRows={(newRows) => {
          setRows(newRows);
        }}
        onAddRow={addRow}
        onDeleteRow={deleteRow}
        onAddSection={addSection}
        onUpdateSection={updateSection}
        onRemoveSection={removeSection}
        onAddNote={addNote}
        onUpdateNote={updateNote}
        onRemoveNote={removeNote}
      />

      <ChordKeyboard
        selectedKey={selectedKey}
        onKeyChange={setSelectedKey}
        onChordSelect={selectChord}
        onBeatChange={updateCellBeats}
        onClear={clearCell}
        onAddBass={addBassNote}
        currentCellBeats={getSelectedCellData()?.beats || 4}
        currentChord={getSelectedCellData()?.chord || null}
        customChords={customChords[selectedKey.key] || []}
        onRemoveCustomChord={removeCustomChord}
      />

      <SongLibrary
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        songs={songs}
        bookmarks={bookmarks}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoadSong={handleLoadSong}
        onDeleteSong={deleteSong}
        onToggleBookmark={toggleBookmark}
        filteredSongs={filteredSongs}
        currentSongTitle={songTitle}
        onSaveCurrent={handleSaveSong}
      />
    </div>
  );
};

export default Index;
