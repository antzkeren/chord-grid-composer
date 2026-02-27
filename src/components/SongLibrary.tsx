import { useState } from 'react';
import { Search, Star, Trash2, FolderOpen, Share2, Link as LinkIcon, Check, Eye } from 'lucide-react';
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
}: SongLibraryProps) {
  const [activeTab, setActiveTab] = useState<'public' | 'yours' | 'bookmarks'>('public');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [songToShare, setSongToShare] = useState<Song | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();

  const displayedSongs = (() => {
    let list: Song[];
    switch (activeTab) {
      case 'public':
        list = songs.filter((s) => s.visibility === 'public');
        break;
      case 'yours':
        list = songs.filter((s) => {
          if (!user) return false;
          if (typeof s.owner === 'object') return s.owner.id === user.id;
          return s.owner === user.name;
        });
        break;
      case 'bookmarks':
        list = filteredSongs(true);
        break;
      default:
        list = songs;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => s.title?.toLowerCase().includes(q));
    }
    return list;
  })();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('id-ID', {
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
      
      // backend may return its own base url (localhost:8000); use frontend origin instead
      const link = `${window.location.origin}/shared/${response.share_id}`;
      setShareUrl(link);
      setSongToShare(song);
      setShareDialogOpen(true);
      setCopied(false);
    } catch (error) {
      console.error('Error sharing song:', error);
      toast.error('Failed to share song');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col w-[95vw] sm:w-full">
          <DialogHeader className="px-1 sm:px-0">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FolderOpen className="h-5 w-5" />
              Song Library
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search songs..."
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'public' | 'yours' | 'bookmarks')}>
            <TabsList className="grid w-full grid-cols-3 mb-3 sm:mb-4">
              <TabsTrigger value="public" className="text-xs sm:text-sm">
                Public ({songs.filter(s=>s.visibility==='public').length})
              </TabsTrigger>
              <TabsTrigger value="yours" className="text-xs sm:text-sm">
                Your Songs ({songs.filter(s=>{
                  if (!user) return false;
                  if (typeof s.owner === 'object') return s.owner.id === user.id;
                  return s.owner === user.name;
                }).length})
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
                      ? 'No songs bookmarked yet' 
                      : searchQuery 
                        ? 'No songs found'
                        : 'No saved songs'}
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
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{formatDate(song.updatedAt)}</span>
                            {activeTab === 'yours' && (
                              <span className="text-xs font-medium text-foreground">
                                • {song.visibility === 'public' ? 'Public' : 'Private'}
                              </span>
                            )}
                            {activeTab === 'public' && song.owner ? (
                              <span className="text-xs italic">
                                by {typeof song.owner === 'object' ? song.owner.name : song.owner}
                              </span>
                            ) : null}
                          </div>
                        </button>

                        <button
                          onClick={() => handleShare(song)}
                          className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                          title="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete "${song.title}"?`)) {
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

        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Song
            </DialogTitle>
            <DialogDescription>
              Share this link with others so they can view "{songToShare?.title || 'Untitled'}"
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
              <span>Recipient can only view and bookmark</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
