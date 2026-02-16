export type ChordType = 'major' | 'minor' | 'dim' | '7' | 'maj7' | 'sus4' | 'sus2';

export interface ChordCell {
  id: string;
  chord: string | null;
  beats: number; // 1-4 beats
  isNote: boolean;
  noteText?: string;
}

export interface ChordRow {
  id: string;
  cells: ChordCell[];
  sectionName?: string;
  noteText?: string;
}

export interface KeyFamily {
  key: string;
  doName: string;
  chords: string[];
}

export const KEY_FAMILIES: KeyFamily[] = [
  { key: 'C', doName: 'Do=C', chords: ['C', 'Dmin', 'Emin', 'F', 'G', 'Amin', 'G/B'] },
  { key: 'D', doName: 'Do=D', chords: ['D', 'Emin', 'F#min', 'G', 'A', 'Bmin', 'A/C#'] },
  { key: 'E', doName: 'Do=E', chords: ['E', 'F#min', 'G#min', 'A', 'B', 'C#min', 'B/D#'] },
  { key: 'F', doName: 'Do=F', chords: ['F', 'Gmin', 'Amin', 'Bb', 'C', 'Dmin', 'C/E'] },
  { key: 'G', doName: 'Do=G', chords: ['G', 'Amin', 'Bmin', 'C', 'D', 'Emin', 'D/F#'] },
  { key: 'A', doName: 'Do=A', chords: ['A', 'Bmin', 'C#min', 'D', 'E', 'F#min', 'E/G#'] },
  { key: 'Bb', doName: 'Do=Bb', chords: ['Bb', 'Cmin', 'Dmin', 'Eb', 'F', 'Gmin', 'F/A'] },
  { key: 'Eb', doName: 'Do=Eb', chords: ['Eb', 'Fmin', 'Gmin', 'Ab', 'Bb', 'Cmin', 'Bb/D'] },
];

export const EXTRA_CHORDS = ['min', 'maj', 'min7', 'maj7', 'sus4', 'min7b5', '7', 'sus2', 'add9', '6', 'dim7'];

export const BASS_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

export const generateId = () => Math.random().toString(36).substring(2, 9);

// All notes in chromatic order
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

// Transpose a chord by semitones
// Returns the transposed chord string
function transposeNote(note: string, semitones: number): string {
  // Handle flats by converting to sharp
  const flatToSharp: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
  };
  
  // Convert flats to sharps
  let normalizedNote = note;
  if (flatToSharp[note]) {
    normalizedNote = flatToSharp[note];
  }
  
  // Handle notes with bass (e.g., "G/B")
  const parts = normalizedNote.split('/');
  const transposedParts = parts.map(part => {
    // Extract root note (e.g., "G" from "Gmaj7")
    const rootMatch = part.match(/^([A-G][#b]?)/);
    if (!rootMatch) return part;
    
    const rootNote = rootMatch[1];
    const suffix = part.slice(rootNote.length);
    
    // Convert flats to sharps for root
    let normalizedRoot = rootNote;
    if (flatToSharp[rootNote]) {
      normalizedRoot = flatToSharp[rootNote];
    }
    
    const currentIndex = NOTES.indexOf(normalizedRoot);
    if (currentIndex === -1) return part;
    
    // Calculate new index with wraparound
    const newIndex = (currentIndex + semitones + 12) % 12;
    const newNote = NOTES[newIndex];
    
    return newNote + suffix;
  });
  
  return transposedParts.join('/');
}

export function transposeChord(chord: string | null, semitones: number): string | null {
  if (!chord) return null;
  
  // Handle special cases
  if (chord === '—' || chord === '-') return chord;
  
  return transposeNote(chord, semitones);
}
