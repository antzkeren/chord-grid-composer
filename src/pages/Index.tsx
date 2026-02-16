import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChordGrid } from '@/components/ChordGrid';
import { ChordKeyboard } from '@/components/ChordKeyboard';
import { SongLibrary } from '@/components/SongLibrary';
import { useChordGrid } from '@/hooks/useChordGrid';
import { useSongStorage } from '@/hooks/useSongStorage';
import { useAuth } from '@/contexts/AuthContext';
import { Song } from '@/types/song';
import { toast } from 'sonner';
import { ChevronUp, ChevronDown, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const { user } = useAuth();
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
    transposeRows,
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
  const [keyboardOpen, setKeyboardOpen] = useState(true);

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
    saveSong(songTitle, rows, currentSongId, user?.name);
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
        onTransposeRows={(rowIds, semitones) => {
          transposeRows(rowIds, semitones);
          setSelectedRows([]);
          toast.success(`${rowIds.length} baris di-transpose ${semitones > 0 ? '+' : ''}${semitones} semitone`);
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

      {/* Mobile Keyboard Toggle */}
      <div className="md:hidden border-t border-border">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between px-4 py-2 h-auto"
          onClick={() => setKeyboardOpen(!keyboardOpen)}
        >
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Piano Keyboard</span>
          </div>
          {keyboardOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </Button>
      </div>

      {/* Collapsible Keyboard - Mobile Only */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        keyboardOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
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
      </div>

      {/* Desktop Keyboard - Always visible */}
      <div className="hidden md:block">
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
      </div>

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
