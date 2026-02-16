import { Music2, FolderOpen, LogOut, LogIn, Save, Sun, Moon, Monitor, Menu, X, Plus, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-card border-b border-border px-2 sm:px-4 py-2 sm:py-3 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Music2 className="text-primary" />
                ChordGrid
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              {/* Mobile Title Input */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Judul Lagu</label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Judul Lagu..."
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    onOpenLibrary();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FolderOpen size={16} className="mr-2" />
                  Library
                </Button>
                <Button
                  onClick={() => {
                    onSave();
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    'w-full justify-start',
                    hasUnsavedChanges && 'animate-pulse'
                  )}
                >
                  <Save size={16} className="mr-2" />
                  Simpan
                </Button>
                <Button
                  onClick={() => {
                    onNew();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus size={16} className="mr-2" />
                  Baru
                </Button>
              </div>

              {/* Mobile Theme Switcher */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Tema</label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex-1"
                  >
                    <Sun size={14} className="mr-1" /> Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex-1"
                  >
                    <Moon size={14} className="mr-1" /> Dark
                  </Button>
                </div>
              </div>

              {/* Mobile User Section */}
              {user ? (
                <div className="border-t pt-4 mt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <LogIn size={16} className="mr-2" />
                  Login
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo - Hidden on mobile when menu is shown */}
        <div className="hidden md:flex items-center gap-2 text-primary flex-shrink-0">
          <Music2 size={24} />
          <span className="font-semibold">ChordGrid</span>
        </div>

        {/* Desktop Title Input - Hidden on mobile */}
        <input
          type="text"
          value={songTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Judul Lagu..."
          className="hidden md:block flex-1 bg-transparent border-none text-lg font-semibold
                   focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
        />

        {/* Mobile: Compact title display */}
        <div className="md:hidden flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{songTitle || 'Lagu Baru'}</p>
        </div>

        {/* Desktop Actions - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            onClick={onOpenLibrary}
            variant="outline"
            size="sm"
          >
            <FolderOpen size={16} />
            <span className="ml-2">Library</span>
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
                    <span className="max-w-[100px] truncate">
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

        {/* Mobile: Quick Save Button */}
        <Button
          onClick={onSave}
          size="icon"
          className={cn(
            'md:hidden flex-shrink-0',
            hasUnsavedChanges && 'animate-pulse'
          )}
        >
          <Save size={16} />
        </Button>
      </div>
    </header>
  );
}
