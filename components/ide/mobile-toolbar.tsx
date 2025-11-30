'use client';

import { useIDEStore } from '@/lib/store/ide-store';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Play,
  Upload,
  Terminal,
  BookOpen,
  Package,
  Cpu,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileToolbar() {
  const {
    toggleMobileMenu,
    toggleSerialMonitor,
    toggleLibraryManager,
    isCompiling,
    isFlashing,
    serialConnected,
    setIsCompiling,
    flashSketch,
  } = useIDEStore();

  const handleCompile = () => {
    setIsCompiling(true);
    // Simulate compilation
    setTimeout(() => {
      setIsCompiling(false);
    }, 2000);
  };

  const handleFlash = async () => {
    await flashSketch();
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 px-4 py-2 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCompile}
            disabled={isCompiling || isFlashing}
            className="text-green-400 hover:text-green-300 hover:bg-green-950/30"
          >
            {isCompiling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span className="hidden sm:inline ml-1">Compile</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlash}
            disabled={isCompiling || isFlashing}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
          >
            {isFlashing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="hidden sm:inline ml-1">Flash</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSerialMonitor}
            className={cn(
              'hover:bg-white/10',
              serialConnected ? 'text-green-400' : 'text-gray-400'
            )}
          >
            <Terminal className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLibraryManager}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Package className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 px-4 py-2 glass border-b border-white/10">
        <Button
          variant="default"
          size="sm"
          onClick={handleCompile}
          disabled={isCompiling || isFlashing}
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
        >
          {isCompiling ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Compile
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleFlash}
          disabled={isCompiling || isFlashing}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
        >
          {isFlashing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Flash
        </Button>

        <div className="h-6 w-px bg-white/10 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSerialMonitor}
          className={cn(
            'hover:bg-white/10',
            serialConnected ? 'text-green-400' : 'text-gray-400'
          )}
        >
          <Terminal className="w-4 h-4 mr-2" />
          Serial Monitor
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLibraryManager}
          className="text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Package className="w-4 h-4 mr-2" />
          Libraries
        </Button>
      </div>
    </>
  );
}
