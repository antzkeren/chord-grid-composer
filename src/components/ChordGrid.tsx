import { useEffect, useRef, useState } from 'react';
import { ChordRow } from '@/types/chord';
import { ChordCellComponent } from './ChordCellComponent';
import { Plus, Trash2, Tag, Type, X, Copy, Square, CheckSquare, GripVertical, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ChordGridProps {
  rows: ChordRow[];
  selectedCell: { rowId: string; cellId: string } | null;
  selectedRows: string[];
  /**
   * optional master toggle; when provided a header checkbox will be shown
   * above the rows. After touching this the parent can decide which rows to
   * mark as selected (e.g. all or none).
   */
  allRowsSelected?: boolean;
  onToggleAllRows?: () => void;

  /** extra metadata badges shown in the header (right side) */
  tempo?: number;
  timeSignature?: string;
  baseChord?: string;
  /** callback invoked when user clicks the metadata area */
  onMetadataClick?: () => void;

  onCellSelect: (rowId: string, cellId: string) => void;
  onToggleRowSelect: (rowId: string) => void;
  onDuplicateRows: (rowIds: string[]) => void;
  onTransposeRows: (rowIds: string[], semitones: number) => void;
  onReorderRows: (newRows: ChordRow[]) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
  onAddSection: (rowId: string) => void;
  onUpdateSection: (rowId: string, name: string) => void;
  onRemoveSection: (rowId: string) => void;
  onAddNote: (rowId: string) => void;
  onUpdateNote: (rowId: string, text: string) => void;
  onRemoveNote: (rowId: string) => void;
}

function InterstitialActions({
  onAddSection,
  onAddNote,
}: {
  onAddSection?: () => void;
  onAddNote?: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
      <div className="flex-1 border-t border-dashed border-border/50" />
      {onAddSection && (
        <button
          onClick={onAddSection}
          className="toolbar-button flex items-center gap-1 text-xs px-2 py-0.5"
          title="Tambah section di sini"
        >
          <Tag size={12} />
          <span className="hidden sm:inline">Section</span>
        </button>
      )}
      {onAddNote && (
        <button
          onClick={onAddNote}
          className="toolbar-button flex items-center gap-1 text-xs px-2 py-0.5"
          title="Tambah catatan di sini"
        >
          <Type size={12} />
          <span className="hidden sm:inline">Note</span>
        </button>
      )}
      <div className="flex-1 border-t border-dashed border-border/50" />
    </div>
  );
}

function SortableRow({
  row,
  rowIndex,
  selectedCell,
  isSelected,
  onCellSelect,
  onToggleRowSelect,
  onDeleteRow,
  onUpdateSection,
  onRemoveSection,
  onUpdateNote,
  onRemoveNote,
}: {
  row: ChordRow;
  rowIndex: number;
  selectedCell: { rowId: string; cellId: string } | null;
  isSelected: boolean;
  onCellSelect: (rowId: string, cellId: string) => void;
  onToggleRowSelect: (rowId: string) => void;
  onDeleteRow: (rowId: string) => void;
  onUpdateSection: (rowId: string, name: string) => void;
  onRemoveSection: (rowId: string) => void;
  onUpdateNote: (rowId: string, text: string) => void;
  onRemoveNote: (rowId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const noteInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div ref={setNodeRef} style={style} className="group">
      {/* Section Header */}
      {row.sectionName !== undefined && (
        <div className="flex items-center gap-2 mb-1 mt-2">
          <input
            type="text"
            value={row.sectionName}
            onChange={(e) => onUpdateSection(row.id, e.target.value)}
            placeholder="Nama section (contoh: Verse 1, Chorus)"
            className="flex-1 bg-transparent border-b border-[hsl(var(--section-header))] 
                     text-[hsl(var(--section-header))] font-semibold text-sm
                     focus:outline-none focus:border-b-2 py-1"
          />
          <button
            onClick={() => onRemoveSection(row.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            title="Hapus section"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Chord Row */}
      <div className="flex items-center gap-1.5 py-1">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-grab active:cursor-grabbing touch-none"
          title="Drag untuk memindahkan baris"
        >
          <GripVertical size={14} className="opacity-0 group-hover:opacity-100" />
        </button>
        
        {/* Selection Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleRowSelect(row.id);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
          title={isSelected ? 'Deselect row' : 'Select row'}
        >
          {isSelected ? (
            <CheckSquare size={14} className="text-primary" />
          ) : (
            <Square size={14} />
          )}
        </button>
        
        {/* Row Number */}
        <div className="text-muted-foreground text-xs w-5 text-right font-mono">
          {rowIndex + 1}
        </div>
        
        {/* Chord Cells */}
        <div className="flex-1 flex gap-1">
          {row.cells.map((cell) => (
            <ChordCellComponent
              key={cell.id}
              cell={cell}
              isSelected={selectedCell?.rowId === row.id && selectedCell?.cellId === cell.id}
              onClick={() => onCellSelect(row.id, cell.id)}
              totalBeatsInRow={16}
            />
          ))}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDeleteRow(row.id)}
          className="toolbar-button opacity-50 hover:opacity-100 hover:text-destructive"
          title="Hapus baris"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Row-level Note */}
      {row.noteText !== undefined && (
        <div className="flex items-center gap-2 ml-10 mb-1">
          <input
            ref={noteInputRef}
            type="text"
            value={row.noteText}
            onChange={(e) => onUpdateNote(row.id, e.target.value)}
            placeholder="Catatan (contoh: unisound, fill drum, dsb)"
            className="flex-1 bg-transparent border-b border-muted-foreground/30
                     text-muted-foreground text-xs italic
                     focus:outline-none focus:border-b-2 focus:border-muted-foreground/50 py-0.5"
          />
          <button
            onClick={() => onRemoveNote(row.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
            title="Hapus catatan"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export function ChordGrid({
  rows,
  selectedCell,
  selectedRows,
  allRowsSelected = false,
  onToggleAllRows,
  tempo,
  timeSignature,
  baseChord,
  onMetadataClick,
  onCellSelect,
  onToggleRowSelect,
  onDuplicateRows,
  onTransposeRows,
  onReorderRows,
  onAddRow,
  onDeleteRow,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
}: ChordGridProps) {
  const [transposeDialogOpen, setTransposeDialogOpen] = useState(false);
  const [selectedSemitones, setSelectedSemitones] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = rows.findIndex((row) => row.id === active.id);
      const newIndex = rows.findIndex((row) => row.id === over.id);
      const newRows = arrayMove(rows, oldIndex, newIndex);
      onReorderRows(newRows);
    }
  };

  const handleAddSection = (rowId: string) => {
    onAddSection(rowId);
  };

  const handleAddNote = (rowId: string) => {
    onAddNote(rowId);
  };

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={rows.map((row) => row.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="max-w-4xl mx-auto space-y-0 p-2 sm:p-4">
            {/* Metadata header - always visible and clickable */}
            <div className="flex items-center gap-1.5 py-1 border-b border-border">
              {/* placeholder for checkbox column when not in select mode */}
              {!onToggleAllRows && <div className="w-5" />}
              
              {/* master "select all" checkbox header */}
              {onToggleAllRows && rows.length > 0 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAllRows();
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                    title={allRowsSelected ? 'Deselect all rows' : 'Select all rows'}
                  >
                    {allRowsSelected ? (
                      <CheckSquare size={14} className="text-primary" />
                    ) : (
                      <Square size={14} />
                    )}
                  </button>

                  {/* placeholder for row number column */}
                  <div className="text-muted-foreground text-xs w-5 text-right font-mono">
                    #
                  </div>

                  {/* empty space matching chord cells area */}
                  <div className="flex-1 flex gap-1">
                    <span className="text-xs text-muted-foreground italic">
                      select all
                    </span>
                  </div>
                </>
              )}

              {/* metadata labels (tempo / time / key) - always clickable */}
              <div
                className="flex items-center gap-3 ml-auto text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => onMetadataClick && onMetadataClick()}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onMetadataClick && onMetadataClick();
                  }
                }}
              >
                {tempo !== undefined && (
                  <span className="whitespace-nowrap">Tempo: {tempo}</span>
                )}
                {timeSignature && (
                  <span className="whitespace-nowrap">{timeSignature}</span>
                )}
                {baseChord && (
                  <span className="whitespace-nowrap">Key: {baseChord}</span>
                )}
              </div>
            </div>

            {rows.map((row, rowIndex) => (
              <div key={row.id}>
                {/* Interstitial before this row */}
                <InterstitialActions
                  onAddSection={row.sectionName === undefined ? () => handleAddSection(row.id) : undefined}
                  onAddNote={rowIndex > 0 && rows[rowIndex - 1].noteText === undefined ? () => handleAddNote(rows[rowIndex - 1].id) : (rowIndex === 0 ? undefined : undefined)}
                />

                <SortableRow
                  row={row}
                  rowIndex={rowIndex}
                  selectedCell={selectedCell}
                  isSelected={selectedRows.includes(row.id)}
                  onCellSelect={onCellSelect}
                  onToggleRowSelect={onToggleRowSelect}
                  onDeleteRow={onDeleteRow}
                  onUpdateSection={onUpdateSection}
                  onRemoveSection={onRemoveSection}
                  onUpdateNote={onUpdateNote}
                  onRemoveNote={onRemoveNote}
                />
              </div>
            ))}

            {/* Final interstitial - for adding note to last row or section to a new row */}
            {rows.length > 0 && (
              <InterstitialActions
                onAddNote={rows[rows.length - 1].noteText === undefined ? () => handleAddNote(rows[rows.length - 1].id) : undefined}
              />
            )}

            {/* Add Row Button */}
            <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
              {selectedRows.length > 0 && (
                <>
                  <Button
                    onClick={() => {
                      onDuplicateRows(selectedRows);
                    }}
                    variant="outline"
                    className="border-dashed border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm"
                  >
                    <Copy size={14} className="mr-1 sm:mr-2" />
                    Duplicate ({selectedRows.length})
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSemitones(0);
                      setTransposeDialogOpen(true);
                    }}
                    variant="outline"
                    className="border-dashed border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm"
                  >
                    <ArrowUpDown size={14} className="mr-1 sm:mr-2" />
                    Transpose ({selectedRows.length})
                  </Button>
                </>
              )}
              <Button
                onClick={onAddRow}
                variant="outline"
                className="flex-1 border-dashed border-border hover:border-primary hover:bg-primary/10 text-xs sm:text-sm"
              >
                <Plus size={14} className="mr-1 sm:mr-2" />
                Add Row
              </Button>
            </div>
          </div>
        </SortableContext>
      </DndContext>

      {/* Transpose Dialog */}
      <Dialog open={transposeDialogOpen} onOpenChange={setTransposeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transpose Chord</DialogTitle>
            <DialogDescription>
              Select a transpose interval for {selectedRows.length} selected rows
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2 py-4">
            {[-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((semitones) => (
              <Button
                key={semitones}
                variant={selectedSemitones === semitones ? 'default' : 'outline'}
                onClick={() => setSelectedSemitones(semitones)}
                className="text-sm"
              >
                {semitones > 0 ? `+${semitones}` : semitones}
              </Button>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground py-2">
            {selectedSemitones !== 0 && (
              <span>
                {selectedSemitones > 0 ? 'Naik' : 'Turun'} {Math.abs(selectedSemitones)} semitone(s)
              </span>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransposeDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                if (selectedSemitones !== 0) {
                  onTransposeRows(selectedRows, selectedSemitones);
                  setTransposeDialogOpen(false);
                }
              }}
              disabled={selectedSemitones === 0}
            >
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
