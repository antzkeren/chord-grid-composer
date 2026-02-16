import { Music2, FolderOpen, LogOut, LogIn, Save, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  songTitle: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onNew: () => void;
  onOpenLibrary: () => void;
  hasUnsavedChanges?: boolean;
}

export function Header({ songTitle, onTitleChange, onSave, onNew, onOpenLibrary, hasUnsavedChanges }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Music2 size={24} />
          <span className="font-semibold hidden sm:inline">ChordGrid</span>
        </div>

        <input
          type="text"
          value={songTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Judul Lagu..."
          className="flex-1 bg-transparent border-none text-lg font-semibold
                   focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenLibrary}
            variant="outline"
            size="sm"
          >
            <FolderOpen size={16} />
            <span>Library</span>
          </Button>
          <Button
            onClick={onSave}
            size="sm"
            className={cn(
              'bg-primary text-primary-foreground hover:bg-primary/90',
              hasUnsavedChanges && 'animate-pulse'
            )}
          >
            <Save size={16} className="mr-2" />
            Save
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-accent' : ''}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-accent' : ''}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-accent' : ''}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="sm"
            >
              <LogIn size={16} className="mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
