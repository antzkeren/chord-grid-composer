import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface NoteInputProps {
  isOpen: boolean;
  initialValue: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

export function NoteInput({ isOpen, initialValue, onSave, onClose }: NoteInputProps) {
  const [note, setNote] = useState(initialValue);

  useEffect(() => {
    setNote(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl p-4 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Tambah Catatan</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tulis catatan... (contoh: unisound A-B-C, fill drum, dsb)"
          className="w-full h-24 bg-secondary border border-border rounded-lg p-3 
                   text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={() => { onSave(note); onClose(); }}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
