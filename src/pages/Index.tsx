import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [currentSongOwner, setCurrentSongOwner] = useState<string | undefined>();
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // metadata controls shown in the header
  const [tempo, setTempo] = useState<number>(120);
  const [timeSignature, setTimeSignature] = useState<string>('4/4');
  // base chord (can be multiple e.g. "C-D"); controlled manually rather than tied to selectedKey
  const [baseChord, setBaseChord] = useState<string>('');

  // metadata editing dialog state
  const [metaOpen, setMetaOpen] = useState(false);
  const [draftTempo, setDraftTempo] = useState(tempo);
  const [draftTimeSig, setDraftTimeSig] = useState(timeSignature);
  const [draftBaseChord, setDraftBaseChord] = useState(baseChord);

  const openMeta = () => {
    setDraftTempo(tempo);
    setDraftTimeSig(timeSignature);
    setDraftBaseChord(baseChord);
    setMetaOpen(true);
  };
  const saveMeta = () => {
    setTempo(draftTempo);
    setTimeSignature(draftTimeSig);
    setBaseChord(draftBaseChord);
    setMetaOpen(false);
  };

  // if the user hasn't specified a base chord yet, keep it in sync with the
  // selected key so there's always something displayed. once the user types
  // a value we leave it alone (they can set it back to empty to re‑sync).
  useEffect(() => {
    if (!baseChord) {
      setBaseChord(selectedKey.key);
    }
  }, [selectedKey, baseChord]);

  // derived helper to know if every row is currently selected
  const allRowsSelected = rows.length > 0 && selectedRows.length === rows.length;
  const [keyboardOpen, setKeyboardOpen] = useState(true);

  // Store initial state to track unsaved changes
  const initialStateRef = useRef({ rows, songTitle, visibility, tempo, timeSignature, baseChord });

  // Check for unsaved changes
  useEffect(() => {
    const isDifferent = (
      JSON.stringify(rows) !== JSON.stringify(initialStateRef.current.rows) ||
      songTitle !== initialStateRef.current.songTitle ||
      visibility !== initialStateRef.current.visibility ||
      tempo !== initialStateRef.current.tempo ||
      timeSignature !== initialStateRef.current.timeSignature ||
      baseChord !== initialStateRef.current.baseChord
    );
    setHasUnsavedChanges(isDifferent);
  }, [rows, songTitle, visibility, tempo, timeSignature, baseChord]);

  // Load song from URL params
  useEffect(() => {
    if (id && songs.length > 0) {
      const song = songs.find(s => s.id === id);
      if (song) {
        handleLoadSong(song, true); // Skip unsaved check when loading from URL
      }
    }
  }, [id, songs.length]);

  const handleSaveSong = async () => {
    // Check if this song belongs to someone else
    // If currentSongOwner is set and different from current user, show confirmation
    const isOtherUsersSong = currentSongOwner && user?.name && currentSongOwner !== user.name;
    
    if (isOtherUsersSong) {
      const confirmed = confirm('Lagu ini bukan milik Anda. Apakah Anda ingin menyimpan perubahan sebagai salinan atas nama Anda?');
      if (!confirmed) {
        return;
      }
      // User confirmed - force create new copy
      const result = await saveSong(songTitle, rows, currentSongId, user?.name, visibility, tempo, timeSignature, baseChord, true);
      // Update current song ID and owner to the new copy
      if (result?.isNew && result.id) {
        setCurrentSongId(result.id);
        setCurrentSongOwner(user?.name);
        navigate(`/songs/${result.id}`, { replace: true });
      }
      initialStateRef.current = {
        rows: JSON.parse(JSON.stringify(rows)),
        songTitle,
        visibility,
        tempo,
        timeSignature,
        baseChord,
      };
      toast.success('Lagu tersimpan sebagai salinan!');
      return;
    }
    
    const result = await saveSong(songTitle, rows, currentSongId, user?.name, visibility, tempo, timeSignature, baseChord);
    
    // Update current song ID and owner if this is a new song (copy of another user's song)
    if (result?.isNew && result.id) {
      setCurrentSongId(result.id);
      setCurrentSongOwner(user?.name); // Now we own this copy
    }
    
    // Update initial state after saving
    initialStateRef.current = {
      rows: JSON.parse(JSON.stringify(rows)),
      songTitle,
      visibility,
      tempo,
      timeSignature,
      baseChord,
    };
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
    setCurrentSongOwner(undefined);
    setVisibility('private');
    setTempo(120);
    setTimeSignature('4/4');
    setBaseChord('');
    initialStateRef.current = {
      rows: JSON.parse(JSON.stringify(emptyRows)),
      songTitle: '',
      visibility: 'private',
      tempo: 120,
      timeSignature: '4/4',
      baseChord: '',
    };
    // Navigate back to home page
    navigate('/', { replace: true });
    toast.info('Chart baru dibuat');
  };

  const handleLoadSong = (song: Song, skipUnsavedCheck: boolean = false) => {
    // Skip unsaved changes check when loading from URL or skipUnsavedCheck is true
    if (!skipUnsavedCheck && hasUnsavedChanges) {
      if (!confirm('Ada perubahan yang belum disimpan. Muat lagu lain?')) {
        return;
      }
    }
    // Get owner name - could be string or object
    const ownerName = typeof song.owner === 'string' ? song.owner : song.owner?.name;
    setRows(song.rows);
    setSongTitle(song.title);
    setCurrentSongId(song.id);
    setCurrentSongOwner(ownerName); // Track who owns this song
    setVisibility((song.visibility as 'public' | 'private') || 'private');
    setTempo(song.tempo ?? 120);
    setTimeSignature(song.timeSignature || '4/4');
    setBaseChord(song.baseChord || '');
    setSelectedCell(null);
    initialStateRef.current = {
      rows: JSON.parse(JSON.stringify(song.rows)),
      songTitle: song.title,
      visibility: (song.visibility as 'public' | 'private') || 'private',
      tempo: song.tempo ?? 120,
      timeSignature: song.timeSignature || '4/4',
      baseChord: song.baseChord || '',
    };
    // Update URL to /songs/:id
    navigate(`/songs/${song.id}`, { replace: true });
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
        visibility={visibility}
        onVisibilityChange={setVisibility}
      />

      <ChordGrid
        rows={rows}
        selectedCell={selectedCell}
        selectedRows={selectedRows}
        allRowsSelected={allRowsSelected}
        onToggleAllRows={() => setSelectedRows(allRowsSelected ? [] : rows.map(r => r.id))}
        tempo={tempo}
        timeSignature={timeSignature}
        baseChord={baseChord}
        onMetadataClick={openMeta}
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
          toast.success(`${rowIds.length} rows duplicated`);
        }}
        onTransposeRows={(rowIds, semitones) => {
          transposeRows(rowIds, semitones);
          setSelectedRows([]);
          toast.success(`${rowIds.length} rows transposed ${semitones > 0 ? '+' : ''}${semitones} semitone`);
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

      {/* Metadata edit dialog */}
      <Dialog open={metaOpen} onOpenChange={setMetaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Metadata</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col">
              <label className="text-xs mb-1">Tempo (BPM)</label>
              <input
                type="number"
                min={1}
                value={draftTempo}
                onChange={e => setDraftTempo(Number(e.target.value))}
                className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs mb-1">Time Signature</label>
              <input
                type="text"
                value={draftTimeSig}
                onChange={e => setDraftTimeSig(e.target.value)}
                className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs mb-1">Base Chord</label>
              <input
                type="text"
                value={draftBaseChord}
                onChange={e => setDraftBaseChord(e.target.value)}
                className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMetaOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveMeta}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky Keyboard Section */}
      <div className="sticky bottom-0 z-10 bg-background border-t border-border">
        <div className="border-t border-border">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between px-4 py-2 h-auto"
            onClick={() => setKeyboardOpen(!keyboardOpen)}
          >
            <div className="flex items-center gap-2">
              <Keyboard size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Chord Keyboard</span>
            </div>
            {keyboardOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </Button>
        </div>

        {/* Collapsible Keyboard - Toggleable on all screen sizes */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
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
      />
    </div>
  );
};

export default Index;
