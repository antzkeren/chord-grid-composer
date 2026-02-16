import { useState } from 'react';
import { Search, Star, Trash2, FolderOpen, Save, Share2, Link as LinkIcon, Check, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Song } from '@/types/song';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { shareService } from '@/services/shareService';
import { useAuth } from '@/contexts/AuthContext';

interface SongLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  bookmarks: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoadSong: (song: Song) => void;
  onDeleteSong: (songId: string) => void;
  onToggleBookmark: (songId: string) => void;
  filteredSongs: (bookmarksOnly: boolean) => Song[];
  currentSongTitle: string;
  onSaveCurrent: () => void;
}

export function SongLibrary({
  isOpen,
  onClose,
  songs,
  bookmarks,
  searchQuery,
  onSearchChange,
  onLoadSong,
  onDeleteSong,
  onToggleBookmark,
  filteredSongs,
  currentSongTitle,
  onSaveCurrent,
}: SongLibraryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks'>('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [songToShare, setSongToShare] = useState<Song | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();

  const displayedSongs = filteredSongs(activeTab === 'bookmarks');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleLoad = (song: Song) => {
    onLoadSong(song);
    onClose();
  };

  const handleShare = async (song: Song) => {
    setIsSharing(true);
    try {
      const response = await shareService.shareSong({
        title: song.title,
        rows: song.rows,
        owner_name: song.owner || user?.name || 'Unknown',
      });
      
      setShareUrl(response.url);
      setSongToShare(song);
      setShareDialogOpen(true);
      setCopied(false);
    } catch (error) {
      console.error('Error sharing song:', error);
      toast.error('Gagal membagikan lagu');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link berhasil disalin!');
    } catch {
      toast.error('Gagal menyalin link');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col w-[95vw] sm:w-full">
          <DialogHeader className="px-1 sm:px-0">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FolderOpen className="h-5 w-5" />
              Library Lagu
            </DialogTitle>
          </DialogHeader>

          {/* Save current song button */}
          <Button 
            onClick={onSaveCurrent} 
            className="w-full text-sm"
            size="sm"
            variant="outline"
          >
            <Save className="h-4 w-4 mr-2" />
            <span className="truncate">{currentSongTitle || 'Untitled'}</span>
          </Button>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari lagu..."
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'bookmarks')}>
            <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                Semua ({songs.length})
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="text-xs sm:text-sm">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Bookmark</span> ({bookmarks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="h-[250px] sm:h-[300px] pr-2 sm:pr-4">
                {displayedSongs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {activeTab === 'bookmarks' 
                      ? 'Belum ada lagu di bookmark' 
                      : searchQuery 
                        ? 'Tidak ada lagu ditemukan'
                        : 'Belum ada lagu tersimpan'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayedSongs.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <button
                          onClick={() => onToggleBookmark(song.id)}
                          className="shrink-0"
                        >
                          <Star
                            className={cn(
                              "h-5 w-5 transition-colors",
                              bookmarks.includes(song.id)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground hover:text-primary"
                            )}
                          />
                        </button>

                        <button
                          onClick={() => handleLoad(song)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="font-medium truncate">
                            {song.title || 'Untitled'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(song.updatedAt)}
                          </div>
                        </button>

                        <button
                          onClick={() => handleShare(song)}
                          className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                          title="Bagikan"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus "${song.title}"?`)) {
                              onDeleteSong(song.id);
                            }
                          }}
                          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Data tersimpan di browser (localStorage). 
            Untuk sync antar device, perlu backend database.
          </p>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Bagikan Lagu
            </DialogTitle>
            <DialogDescription>
              Bagikan link ini kepada orang lain untuk melihat lagu "{songToShare?.title || 'Untitled'}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline" size="icon">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <Eye className="h-4 w-4 shrink-0" />
              <span>Penerima hanya bisa melihat dan menyimpan ke bookmark</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
