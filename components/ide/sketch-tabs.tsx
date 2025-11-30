'use client';

import { useState } from 'react';
import { useIDEStore } from '@/lib/store/ide-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShareDialog } from '@/components/community/share-dialog';
import { X, Plus, MoreVertical, FileCode, Save, Loader2, Share } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SketchTabs() {
  const {
    sketches,
    activeSketchId,
    setActiveSketch,
    addSketch,
    deleteSketch,
    renameSketch,
    saveProject,
    deleteProject,
    isSaving,
  } = useIDEStore();
  const { user } = useAuthStore();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleAddSketch = () => {
    const newId = `sketch-${Date.now()}`;
    addSketch({
      id: newId,
      name: `Sketch${sketches.length + 1}.ino`,
      code: `void setup() {
  // Initialize
}

void loop() {
  // Main code
}`,
      isActive: true,
    });
  };

  const handleRename = (id: string) => {
    if (newName.trim()) {
      renameSketch(id, newName.trim());
    }
    setRenamingId(null);
    setNewName('');
  };

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setNewName(currentName);
  };

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 overflow-x-auto">
      {sketches.map((sketch) => (
        <div
          key={sketch.id}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-t-lg min-w-fit transition-all duration-200',
            sketch.id === activeSketchId
              ? 'bg-slate-900 text-white shadow-lg border-t-2 border-blue-500'
              : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/70 hover:text-white'
          )}
        >
          {renamingId === sketch.id ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => handleRename(sketch.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(sketch.id);
                if (e.key === 'Escape') {
                  setRenamingId(null);
                  setNewName('');
                }
              }}
              className="h-6 w-32 text-sm bg-slate-800 border-slate-600 focus:border-blue-500"
              autoFocus
            />
          ) : (
            <>
              <button
                onClick={() => setActiveSketch(sketch.id)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <FileCode className="w-3.5 h-3.5" />
                {sketch.name}
                {sketch.saved && (
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm" title="Saved" />
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 hover:bg-slate-800/70 rounded"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => startRename(sketch.id, sketch.name)}
                  >
                    Rename
                  </DropdownMenuItem>
                  {user && (
                    <DropdownMenuItem
                      onClick={() => saveProject(sketch.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3 mr-2" />
                      )}
                      Save
                    </DropdownMenuItem>
                  )}
                  {user && (
                    <DropdownMenuItem
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <Share className="w-3 h-3 mr-2" />
                      Share
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={async () => {
                      if (sketch.saved && user) {
                        await deleteProject(sketch.id);
                      }
                      deleteSketch(sketch.id);
                    }}
                    disabled={sketches.length === 1}
                    className="text-red-400"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {sketches.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSketch(sketch.id)}
                  className="h-5 w-5 p-0 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </>
          )}
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddSketch}
        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-slate-700/70 rounded-lg transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
      </Button>
      
      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} />
    </div>
  );
}
