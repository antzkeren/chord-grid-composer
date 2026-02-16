import { KEY_FAMILIES, EXTRA_CHORDS, BASS_NOTES, KeyFamily } from '@/types/chord';
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
    <div className="bg-card border-t border-border p-4 space-y-3">
      {/* Tabs */}
      <div className="flex border-b bg-secondary/30 rounded-t-lg overflow-x-auto scrollbar-thin">
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
      <div className="min-h-[100px]">
        {activeTab === 'chords' && (
          <div className="flex flex-wrap gap-1.5">
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
            <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-wrap gap-1.5">
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
        )}

        {activeTab === 'bass' && (
          <div className="flex flex-wrap gap-1.5">
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
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
        {/* Beat Selector - Changes current cell's beats */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ketuk:</span>
          {[1, 2, 3, 4].map((beat) => (
            <button
              key={beat}
              onClick={() => onBeatChange(beat)}
              className={cn(
                'w-8 h-8 rounded-lg font-mono font-semibold transition-all',
                currentCellBeats === beat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-[hsl(var(--chord-hover))]'
              )}
            >
              {beat}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Action Buttons */}
        <button
          onClick={onClear}
          className="toolbar-button flex items-center gap-2 px-3 hover:bg-destructive/20 hover:text-destructive"
          title="Hapus chord"
        >
          <Trash size={16} />
          <span className="text-sm">Clear</span>
        </button>
      </div>
    </div>
  );
}
