import { KEY_FAMILIES, EXTRA_CHORDS, BASS_NOTES, CHROMATIC_NOTES, KeyFamily } from '@/types/chord';
import { cn } from '@/lib/utils';
import { Trash, X } from 'lucide-react';
import { useState } from 'react';

type TabType = 'chords' | 'key' | 'modifier' | 'bass';

interface ChordKeyboardProps {
  selectedKey: KeyFamily;
  onKeyChange: (key: KeyFamily) => void;
  onChordSelect: (chord: string) => void;
  onBeatChange: (beats: number) => void;
  onClear: () => void;
  onAddBass: (bass: string) => void;
  currentCellBeats: number;
  currentChord: string | null;
  customChords?: string[];
  onRemoveCustomChord?: (chord: string) => void;
}

export function ChordKeyboard({
  selectedKey,
  onKeyChange,
  onChordSelect,
  onBeatChange,
  onClear,
  onAddBass,
  currentCellBeats,
  currentChord,
  customChords = [],
  onRemoveCustomChord,
}: ChordKeyboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chords');

  return (
    <div className="bg-card border-t border-border p-2 sm:p-4 space-y-2 sm:space-y-3">
      {/* Tabs */}
      <div className="flex border-b bg-secondary/30 rounded-t-lg overflow-x-auto scrollbar-thin -mx-2 px-2 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab('chords')}
          className={cn(
            'flex-shrink-0 px-2 sm:px-3 py-2 text-xs transition-colors font-semibold whitespace-nowrap',
            activeTab === 'chords'
              ? 'bg-primary/20 text-foreground border-b-2 border-primary'
              : 'hover:bg-secondary/50'
          )}
        >
          Chord Family
        </button>
        <button
          onClick={() => setActiveTab('key')}
          className={cn(
            'flex-shrink-0 px-2 sm:px-3 py-2 text-xs transition-colors font-semibold whitespace-nowrap',
            activeTab === 'key'
              ? 'bg-primary/20 text-foreground border-b-2 border-primary'
              : 'hover:bg-secondary/50'
          )}
        >
          <span className="hidden xs:inline">Key Change</span>
          <span className="xs:hidden">Key</span>
          <span className="ml-1">(Do={selectedKey.key})</span>
        </button>
        <button
          onClick={() => setActiveTab('modifier')}
          className={cn(
            'flex-shrink-0 px-2 sm:px-3 py-2 text-xs transition-colors font-semibold whitespace-nowrap',
            activeTab === 'modifier'
              ? 'bg-primary/20 text-foreground border-b-2 border-primary'
              : 'hover:bg-secondary/50'
          )}
        >
          Modifier
        </button>
        <button
          onClick={() => setActiveTab('bass')}
          className={cn(
            'flex-shrink-0 px-2 sm:px-3 py-2 text-xs transition-colors font-semibold whitespace-nowrap',
            activeTab === 'bass'
              ? 'bg-primary/20 text-foreground border-b-2 border-primary'
              : 'hover:bg-secondary/50'
          )}
        >
          Bass Note
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[100px] overflow-y-auto">
        {activeTab === 'chords' && (
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {/* Standard chord family */}
            {selectedKey.chords.map((chord) => (
              <button
                key={chord}
                onClick={() => onChordSelect(chord)}
                className="chord-button text-xs"
              >
                {chord}
              </button>
            ))}
            {/* Custom chords */}
            {customChords.length > 0 && (
              <div className="w-full flex flex-wrap gap-1.5 pt-2 border-t border-dashed mt-1">
                {customChords.map((chord) => (
                  <div key={chord} className="relative group">
                    <button
                      onClick={() => onChordSelect(chord)}
                      className="chord-button text-xs"
                    >
                      {chord}
                    </button>
                    {onRemoveCustomChord && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveCustomChord(chord);
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'key' && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
              {KEY_FAMILIES.map((keyFamily) => (
                <button
                  key={keyFamily.key}
                  onClick={() => onKeyChange(keyFamily)}
                  className={cn(
                    'key-button text-xs',
                    selectedKey.key === keyFamily.key && 'active'
                  )}
                >
                  {keyFamily.doName}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'modifier' && (
          <div className="space-y-2">
            {/* Row 1: Chromatic notes - change root note */}
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              <span className="text-[10px] text-muted-foreground w-full mb-1">Root:</span>
              {CHROMATIC_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => onChordSelect(note)}
                  className="chord-button text-xs"
                >
                  {note}
                </button>
              ))}
            </div>
            {/* Row 2: Modifiers */}
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              <span className="text-[10px] text-muted-foreground w-full mb-1">Modifier:</span>
              {EXTRA_CHORDS.map((mod) => (
                <button
                  key={mod}
                  onClick={() => onChordSelect(mod)}
                  className="chord-button text-xs"
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bass' && (
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {BASS_NOTES.map((bass) => (
              <button
                key={bass}
                onClick={() => onAddBass(bass)}
                disabled={!currentChord}
                className="chord-button text-xs min-w-[32px]"
              >
                /{bass}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Beat Selector & Actions */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 pt-2 border-t border-border">
        {/* Beat Selector - Changes current cell's beats */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">Ketuk:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((beat) => (
              <button
                key={beat}
                onClick={() => onBeatChange(beat)}
                className={cn(
                  'w-8 h-8 sm:w-8 sm:h-8 rounded-lg font-mono font-semibold text-sm transition-all',
                  currentCellBeats === beat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-[hsl(var(--chord-hover))]'
                )}
              >
                {beat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 hidden sm:block" />

        {/* Action Buttons */}
        <button
          onClick={onClear}
          className="toolbar-button flex items-center gap-1 sm:gap-2 px-2 sm:px-3 hover:bg-destructive/20 hover:text-destructive"
          title="Hapus chord"
        >
          <Trash size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm hidden xs:inline">Clear</span>
        </button>
      </div>
    </div>
  );
}
