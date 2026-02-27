import { ChordCell } from '@/types/chord';
import { cn } from '@/lib/utils';

interface ChordCellComponentProps {
  cell: ChordCell;
  isSelected: boolean;
  onClick: () => void;
  totalBeatsInRow?: number;
}

export function ChordCellComponent({ cell, isSelected, onClick, totalBeatsInRow = 16 }: ChordCellComponentProps) {
  const getBeatDots = (beats: number) => {
    return Array.from({ length: beats }, (_, i) => (
      <div
        key={i}
        className={cn('beat-dot', `beat-${i + 1}`)}
      />
    ));
  };

  // Calculate width percentage based on beats (proportional to 16-beat row)
  const widthPercent = (cell.beats / totalBeatsInRow) * 100;

  return (
    <div
      onClick={onClick}
      style={{ 
        width: `${widthPercent}%`,
        minWidth: `${widthPercent}%`,
        flexShrink: 0,
        flexGrow: 0,
      }}
      className={cn(
        'chord-cell min-h-[48px] sm:min-h-[60px]',
        isSelected && 'active',
        cell.chord && 'filled'
      )}
    >
      {cell.isNote ? (
        <div className="text-[10px] xs:text-xs text-muted-foreground italic px-1 text-center line-clamp-2">
          {cell.noteText || '📝'}
        </div>
      ) : (
        <>
          <span className={cn(
            'chord-text text-xs sm:text-base',
            !cell.chord && 'text-muted-foreground/30'
          )}>
            {cell.chord || '—'}
          </span>
          
          {cell.beats > 0 && (
            <div className="beat-indicator">
              {getBeatDots(cell.beats)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
