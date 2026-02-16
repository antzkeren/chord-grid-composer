import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChordGrid } from '@/components/ChordGrid';
import { ChordKeyboard } from '@/components/ChordKeyboard';
import { useChordGrid } from '@/hooks/useChordGrid';
import { useSongStorage } from '@/hooks/useSongStorage';
import { toast } from 'sonner';
import { ChevronUp, ChevronDown, Keyboard, Eye, Star, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SharedSongData {
  title: string;
  rows: any[];
  owner: string;
}

const SharedView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<SharedSongData | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(true);
  
  const {
    rows,
    selectedCell,
    selectedKey,
    setRows,
    setSelectedCell,
    setSelectedKey,
    selectChord,
    clearCell,
    addBassNote,
    updateCellBeats,
    getSelectedCellData,
    customChords,
    removeCustomChord,
  } = useChordGrid();

  const {
    bookmarks,
    toggleBookmark,
    saveSong,
  } = useSongStorage();

  // Parse shared data from URL
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(atob(dataParam));
        const parsed = JSON.parse(decoded) as SharedSongData;
        setSharedData(parsed);
        setRows(parsed.rows);
      } catch (error) {
        toast.error('Link tidak valid');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [searchParams, navigate, setRows]);

  const handleToggleBookmark = () => {
    if (sharedData) {
      toggleBookmark(sharedData.title);
      toast.success(bookmarks.includes(sharedData.title) ? 'Dihapus dari bookmark' : 'Ditambahkan ke bookmark');
    }
  };

  const handleSaveToLibrary = () => {
    if (sharedData) {
      saveSong(sharedData.title, rows);
      toast.success('Lagu disimpan ke library!');
    }
  };

  if (!sharedData) {
    return null;
  }

  const isBookmarked = bookmarks.includes(sharedData.title);

  return (
    <div className="h-screen sm:h-auto sm:min-h-screen flex flex-col bg-background">
      {/* Header - Read Only */}
      <header className="bg-card border-b border-border px-2 sm:px-4 py-2 sm:py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-primary flex-shrink-0">
            <Eye size={20} />
            <span className="font-semibold text-sm">Read Only</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{sharedData.title}</p>
            <p className="text-xs text-muted-foreground">Owner: {sharedData.owner}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleToggleBookmark}
              variant="outline"
              size="sm"
            >
              <Star size={16} className={cn(isBookmarked && "fill-primary text-primary")} />
            </Button>
            <Button
              onClick={handleSaveToLibrary}
              size="sm"
            >
              <Save size={16} className="mr-2" />
              Simpan
            </Button>
          </div>
        </div>
      </header>

      {/* Chord Grid - Read Only */}
      <ChordGrid
        rows={rows}
        selectedCell={selectedCell}
        selectedRows={[]}
        onCellSelect={(rowId, cellId) => setSelectedCell({ rowId, cellId })}
        onToggleRowSelect={() => {}}
        onDuplicateRows={() => {}}
        onTransposeRows={() => {}}
        onReorderRows={() => {}}
        onAddRow={() => {}}
        onDeleteRow={() => {}}
        onAddSection={() => {}}
        onUpdateSection={() => {}}
        onRemoveSection={() => {}}
        onAddNote={() => {}}
        onUpdateNote={() => {}}
        onRemoveNote={() => {}}
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
    </div>
  );
};

export default SharedView;
