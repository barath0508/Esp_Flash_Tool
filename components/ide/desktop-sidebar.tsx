'use client';

import { useState } from 'react';
import { BoardSelector } from './board-selector';
import { ExamplesPanel } from './examples-panel';
import { CommunityPanel } from '@/components/community/community-panel';
import { ShareDialog } from '@/components/community/share-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Cpu, Folder, Users, Share } from 'lucide-react';

export function DesktopSidebar() {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <div className="hidden lg:flex flex-col w-80 glass border-r border-white/10">
      <Tabs defaultValue="board" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none bg-white/5 border-b border-white/10">
          <TabsTrigger value="board" className="data-[state=active]:bg-white/10 data-[state=active]:text-cosmic-blue hover:text-white transition-colors">
            <Cpu className="w-4 h-4 mr-2" />
            Board
          </TabsTrigger>
          <TabsTrigger
            value="examples"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-cosmic-purple hover:text-white transition-colors"
          >
            <Folder className="w-4 h-4 mr-2" />
            Examples
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-cosmic-cyan hover:text-white transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="flex-1 p-4 mt-0">
          <BoardSelector />
        </TabsContent>

        <TabsContent value="examples" className="flex-1 mt-0 overflow-hidden">
          <ExamplesPanel />
        </TabsContent>

        <TabsContent value="community" className="flex-1 mt-0 overflow-hidden">
          <CommunityPanel />
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t border-white/10">
        <Button
          onClick={() => setShareDialogOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
          size="sm"
        >
          <Share className="w-4 h-4 mr-2" />
          Share Project
        </Button>
      </div>

      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} />
    </div>
  );
}
