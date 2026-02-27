import { useState, useCallback, useEffect } from 'react';
import { ChordRow, ChordCell, KEY_FAMILIES, KeyFamily, generateId, transposeChord } from '@/types/chord';

const BEATS_PER_ROW = 16;

const createEmptyCell = (beats: number = 4): ChordCell => ({
  id: generateId(),
  chord: null,
  beats,
  isNote: false,
});

// Create a row with cells that total to 16 beats
const createEmptyRow = (): ChordRow => ({
  id: generateId(),
  cells: [createEmptyCell(4), createEmptyCell(4), createEmptyCell(4), createEmptyCell(4)],
});

// Calculate total beats in a row
const getRowTotalBeats = (cells: ChordCell[]): number => {
  return cells.reduce((sum, cell) => sum + cell.beats, 0);
};

export function useChordGrid() {
  const [rows, setRows] = useState<ChordRow[]>([createEmptyRow(), createEmptyRow()]);
  const [selectedCell, setSelectedCell] = useState<{ rowId: string; cellId: string } | null>(null);
  const [selectedKey, setSelectedKey] = useState<KeyFamily>(KEY_FAMILIES[0]);
  const [selectedBeats, setSelectedBeats] = useState(4);
  const [songTitle, setSongTitle] = useState('');
  const [customChords, setCustomChords] = useState<Record<string, string[]>>({});

  // Auto-select first cell on initial load
  useEffect(() => {
    if (rows.length > 0 && rows[0].cells.length > 0 && !selectedCell) {
      setSelectedCell({
        rowId: rows[0].id,
        cellId: rows[0].cells[0].id
      });
    }
  }, [rows, selectedCell]);

  const getSelectedCellData = useCallback(() => {
    if (!selectedCell) return null;
    const row = rows.find(r => r.id === selectedCell.rowId);
    if (!row) return null;
    return row.cells.find(c => c.id === selectedCell.cellId);
  }, [selectedCell, rows]);

  const updateCell = useCallback((update: Partial<ChordCell>) => {
    if (!selectedCell) return;
    
    setRows(prev => prev.map(row => {
      if (row.id !== selectedCell.rowId) return row;
      return {
        ...row,
        cells: row.cells.map(cell => {
          if (cell.id !== selectedCell.cellId) return cell;
          return { ...cell, ...update };
        }),
      };
    }));
  }, [selectedCell]);

  const selectChord = useCallback((chord: string) => {
    const currentCell = getSelectedCellData();
    if (!currentCell || currentCell.isNote) return;

    // Check if it's a modifier
    const modifiers = ['7', 'maj7', 'maj', 'min', 'min7', 'min7b5', 'sus4', 'sus2', 'add9', '6', 'dim7', 'Maj', '9', '11', '13', 'maj9', 'maj13', 'add2', 'aug', 'dim'];
    // Chromatic notes - used to change root note
    const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Check if it's a chromatic note (root note change)
    if (chromaticNotes.includes(chord)) {
      // Only change root note if there's an existing chord in the cell
      if (currentCell.chord) {
        // Extract the modifier from current chord (everything after the root note)
        const modifierMatch = currentCell.chord.match(/^[A-G][#b]?(.*)$/);
        const modifier = modifierMatch ? modifierMatch[1] : '';
        // Create new chord with new root + existing modifier
        const newChord = chord + modifier;
        updateCell({ chord: newChord });
        // Add to custom chords
        setCustomChords(prev => ({
          ...prev,
          [selectedKey.key]: [...new Set([...(prev[selectedKey.key] || []), newChord])]
        }));
      } else {
        // No existing chord - treat as new chord selection
        updateCell({ chord });
        moveToNextCell();
      }
      // Don't auto-advance when root note is changed (if there was an existing chord)
    } else if (modifiers.includes(chord)) {
      if (currentCell.chord) {
        // Remove existing modifiers first (including m7b5, m7, and min7 variants)
        let baseChord = currentCell.chord.replace(/(7|maj7|maj|min7|m7b5|min7b5|min|m7|sus4|sus2|add9|6|dim7|9|11|13|maj9|maj13|add2|aug|dim)$/, '');
        // Remove bass note
        baseChord = baseChord.replace(/\/[A-G][#b]?$/, '');
        let newChord = baseChord;
        
        // "min" modifier: adds "min" to major chord, keeps "min" for minor
        if (chord === 'min') {
          // If already has "min", keep it; otherwise add "min"
          if (!baseChord.includes('min')) {
            newChord = baseChord + 'min';
          }
          updateCell({ chord: newChord });
        }
        // "Maj" converts minor to major (Dmin → D, then add Maj)
        else if (chord === 'Maj' || chord === 'maj') {
          baseChord = baseChord.replace(/min$/, '');
          newChord = baseChord;
          updateCell({ chord: newChord });
        }
        // "7" converts minor to major and adds 7 (Dmin → D7)
        else if (chord === '7') {
          baseChord = baseChord.replace(/min$/, '');
          newChord = baseChord + '7';
          updateCell({ chord: newChord });
        }
        // "maj7" converts minor to major and adds maj7 (Dmin → Dmaj7)
        else if (chord === 'maj7') {
          baseChord = baseChord.replace(/min$/, '');
          newChord = baseChord + 'maj7';
          updateCell({ chord: newChord });
        }
        // "min7" keeps minor and adds 7 (Dmin → Dmin7, or D → Dmin7, Dm7b5 → Dm7)
        else if (chord === 'min7') {
          // If already minor (min or m), just add 7 or convert from m7b5
          if (baseChord.includes('min') || baseChord.endsWith('m')) {
            // If it's m7b5, convert to m7
            if (baseChord.endsWith('m7b5')) {
              newChord = baseChord.replace(/m7b5$/, 'm7');
            } else {
              newChord = baseChord + '7';
            }
          } else {
            // Add min7 to major chord
            newChord = baseChord + 'min7';
          }
          updateCell({ chord: newChord });
        }
        // "min7b5" converts minor to half-diminished (Dmin → Dm7b5)
        else if (chord === 'min7b5') {
          // If already minor (min or m), replace with m7b5
          if (baseChord.includes('min') || baseChord.endsWith('m')) {
            newChord = baseChord.replace(/min$|m$/, '') + 'm7b5';
          } else {
            // Add min7b5 to major chord
            newChord = baseChord + 'm7b5';
          }
          updateCell({ chord: newChord });
        }
        else {
          newChord = baseChord + chord;
          updateCell({ chord: newChord });
        }
        
        // Add the new chord to custom chords for this key
        setCustomChords(prev => ({
          ...prev,
          [selectedKey.key]: [...new Set([...(prev[selectedKey.key] || []), newChord])]
        }));
      }
      // Don't auto-advance when modifier is clicked
    } else {
      updateCell({ chord });
      // Auto-advance to next cell when chord is selected
      moveToNextCell();
    }
  }, [getSelectedCellData, updateCell]);

  const addBassNote = useCallback((bass: string) => {
    const currentCell = getSelectedCellData();
    if (!currentCell || currentCell.isNote || !currentCell.chord) return;

    // Remove existing bass note if any, then add new one
    const chordWithoutBass = currentCell.chord.replace(/\/[A-G][#b]?$/, '');
    const newChord = `${chordWithoutBass}/${bass}`;
    updateCell({ chord: newChord });

    // Add the new chord to custom chords for this key
    setCustomChords(prev => ({
      ...prev,
      [selectedKey.key]: [...new Set([...(prev[selectedKey.key] || []), newChord])]
    }));
  }, [getSelectedCellData, updateCell]);

  const moveToNextCell = useCallback(() => {
    if (!selectedCell) return;
    
    setRows(prevRows => {
      const rowIndex = prevRows.findIndex(r => r.id === selectedCell.rowId);
      const row = prevRows[rowIndex];
      const cellIndex = row.cells.findIndex(c => c.id === selectedCell.cellId);

      if (cellIndex < row.cells.length - 1) {
        // Move to next cell in same row
        setTimeout(() => {
          setSelectedCell({ rowId: row.id, cellId: row.cells[cellIndex + 1].id });
        }, 0);
        return prevRows;
      } else if (rowIndex < prevRows.length - 1) {
        // Move to first cell of next row
        const nextRow = prevRows[rowIndex + 1];
        setTimeout(() => {
          setSelectedCell({ rowId: nextRow.id, cellId: nextRow.cells[0].id });
        }, 0);
        return prevRows;
      } else {
        // Last cell of last row - add new row automatically
        const newRow = {
          id: generateId(),
          cells: [
            { id: generateId(), chord: null, beats: 4, isNote: false },
            { id: generateId(), chord: null, beats: 4, isNote: false },
            { id: generateId(), chord: null, beats: 4, isNote: false },
            { id: generateId(), chord: null, beats: 4, isNote: false },
          ],
        };
        setTimeout(() => {
          setSelectedCell({ rowId: newRow.id, cellId: newRow.cells[0].id });
        }, 0);
        return [...prevRows, newRow];
      }
    });
  }, [selectedCell]);

  // Update beat count for selected cell and rebalance row
  const updateCellBeats = useCallback((newBeats: number) => {
    if (!selectedCell) return;

    setRows(prev => prev.map(row => {
      if (row.id !== selectedCell.rowId) return row;

      const cellIndex = row.cells.findIndex(c => c.id === selectedCell.cellId);
      if (cellIndex === -1) return row;

      const currentCell = row.cells[cellIndex];
      const beatDiff = newBeats - currentCell.beats;

      // Calculate total beats after change
      const currentTotal = getRowTotalBeats(row.cells);
      const newTotal = currentTotal + beatDiff;

      let newCells = [...row.cells];
      newCells[cellIndex] = { ...currentCell, beats: newBeats };

      if (newTotal < BEATS_PER_ROW) {
        // Need to add more cells to fill 16 beats
        const remaining = BEATS_PER_ROW - newTotal;
        // Add cells with default 4 beats or remaining beats
        let beatsToAdd = remaining;
        while (beatsToAdd > 0) {
          const cellBeats = Math.min(4, beatsToAdd);
          newCells.push(createEmptyCell(cellBeats));
          beatsToAdd -= cellBeats;
        }
      } else if (newTotal > BEATS_PER_ROW) {
        // Need to remove/shrink cells from the end
        let excessBeats = newTotal - BEATS_PER_ROW;
        
        // Work backwards from the end, but skip selected cell
        for (let i = newCells.length - 1; i >= 0 && excessBeats > 0; i--) {
          if (i === cellIndex) continue; // Don't modify selected cell
          
          const cell = newCells[i];
          if (cell.beats <= excessBeats) {
            // Remove this cell entirely
            excessBeats -= cell.beats;
            newCells.splice(i, 1);
          } else {
            // Shrink this cell
            newCells[i] = { ...cell, beats: cell.beats - excessBeats };
            excessBeats = 0;
          }
        }
      }

      return { ...row, cells: newCells };
    }));
  }, [selectedCell]);

  const addRow = useCallback(() => {
    const newRow = createEmptyRow();
    setRows(prev => [...prev, newRow]);
    setSelectedCell({ rowId: newRow.id, cellId: newRow.cells[0].id });
  }, []);

  const deleteRow = useCallback((rowId: string) => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter(r => r.id !== rowId));
    if (selectedCell?.rowId === rowId) {
      setSelectedCell(null);
    }
  }, [rows.length, selectedCell]);

  const addSection = useCallback((rowId: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return { ...row, sectionName: row.sectionName ?? '' };
    }));
  }, []);

  const updateSection = useCallback((rowId: string, name: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return { ...row, sectionName: name };
    }));
  }, []);

  const removeSection = useCallback((rowId: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const { sectionName, ...rest } = row;
      return rest as ChordRow;
    }));
  }, []);

  const addNote = useCallback((rowId: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return { ...row, noteText: row.noteText ?? '' };
    }));
  }, []);

  const updateNote = useCallback((rowId: string, text: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return { ...row, noteText: text };
    }));
  }, []);

  const removeNote = useCallback((rowId: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const { noteText, ...rest } = row;
      return rest as ChordRow;
    }));
  }, []);

  const clearCell = useCallback(() => {
    updateCell({ chord: null, isNote: false, noteText: undefined, beats: 4 });
  }, [updateCell]);

  const toggleNote = useCallback(() => {
    const cell = getSelectedCellData();
    if (!cell) return;
    updateCell({ isNote: !cell.isNote, chord: null });
  }, [getSelectedCellData, updateCell]);

  const setNoteText = useCallback((text: string) => {
    updateCell({ noteText: text, isNote: true });
  }, [updateCell]);

  const resetGrid = useCallback(() => {
    setRows([createEmptyRow(), createEmptyRow()]);
    setSelectedCell(null);
    setSongTitle('');
  }, []);

  const exportToText = useCallback(() => {
    let output = songTitle ? `# ${songTitle}\n\n` : '';
    
    rows.forEach((row, index) => {
      if (row.sectionName) {
        output += `\n[${row.sectionName}]\n`;
      }
      
      const chords = row.cells.map(cell => {
        if (!cell.chord) return '—';
        return `${cell.chord}${cell.beats < 4 ? `(${cell.beats})` : ''}`;
      });
      
      output += `| ${chords.join(' | ')} |\n`;

      if (row.noteText) {
        output += `  // ${row.noteText}\n`;
      }
    });

    return output;
  }, [rows, songTitle]);

  const removeCustomChord = useCallback((chordToRemove: string) => {
    setCustomChords(prev => ({
      ...prev,
      [selectedKey.key]: (prev[selectedKey.key] || []).filter(c => c !== chordToRemove)
    }));
  }, [selectedKey.key]);

  const duplicateRows = useCallback((rowIds: string[]) => {
    if (rowIds.length === 0) return;
    
    setRows(prev => {
      const newRows: ChordRow[] = [];
      
      rowIds.forEach(rowId => {
        const rowToDuplicate = prev.find(r => r.id === rowId);
        if (rowToDuplicate) {
          // Deep copy the row with new IDs
          const newRow: ChordRow = {
            id: generateId(),
            cells: rowToDuplicate.cells.map(cell => ({
              ...cell,
              id: generateId(),
            })),
            sectionName: rowToDuplicate.sectionName,
            noteText: rowToDuplicate.noteText,
          };
          newRows.push(newRow);
        }
      });
      
      // Find the index of the last selected row
      const lastSelectedIndex = prev.findIndex(r => r.id === rowIds[rowIds.length - 1]);
      
      // Insert new rows after the last selected row
      const newRowList = [...prev];
      newRowList.splice(lastSelectedIndex + 1, 0, ...newRows);
      
      return newRowList;
    });
  }, []);

  const transposeRows = useCallback((rowIds: string[], semitones: number) => {
    if (rowIds.length === 0 || semitones === 0) return;
    
    setRows(prev => {
      return prev.map(row => {
        if (!rowIds.includes(row.id)) return row;
        
        return {
          ...row,
          cells: row.cells.map(cell => ({
            ...cell,
            chord: transposeChord(cell.chord, semitones),
          })),
        };
      });
    });
  }, []);

  return {
    rows,
    selectedCell,
    selectedKey,
    selectedBeats,
    songTitle,
    customChords,
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
    toggleNote,
    setNoteText,
    resetGrid,
    exportToText,
    getSelectedCellData,
    updateCellBeats,
    removeCustomChord,
    duplicateRows,
    transposeRows,
  };
}
