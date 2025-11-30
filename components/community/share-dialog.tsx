'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCommunityStore } from '@/lib/store/community-store';
import { useIDEStore } from '@/lib/store/ide-store';
import { Loader2, Share } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = ['Sensors', 'IoT', 'Display', 'Motors', 'Communication', 'Games', 'Utilities'];

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const { shareProject } = useCommunityStore();
  const { sketches, activeSketchId, selectedBoard } = useIDEStore();

  const activeSketch = sketches.find(s => s.id === activeSketchId);

  const handleShare = async () => {
    if (!activeSketch || !selectedBoard || !title || !category) return;

    setLoading(true);
    try {
      await shareProject({
        title,
        description,
        code: activeSketch.code,
        board_id: selectedBoard.id,
        board_name: selectedBoard.name,
        board_platform: selectedBoard.platform,
        category,
        tags: [],
        is_public: true,
      });

      onOpenChange(false);
      setTitle('');
      setDescription('');
      setCategory('');
    } catch (error) {
      console.error('Error sharing project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            <Share className="w-5 h-5 text-blue-400" />
            Share Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="bg-slate-800/50 border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={3}
              className="bg-slate-800/50 border-slate-600/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedBoard && (
            <div className="text-sm text-gray-500">
              Board: {selectedBoard.name} ({selectedBoard.platform})
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={!title || !category || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}