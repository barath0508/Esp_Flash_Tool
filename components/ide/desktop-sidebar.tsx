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
    <div className="hidden lg:flex flex-col w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50">
      <Tabs defaultValue="board" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none bg-slate-800/50 border-b border-slate-700/50">
          <TabsTrigger value="board" className="data-[state=active]:bg-slate-900 data-[state=active]:text-blue-400">
            <Cpu className="w-4 h-4 mr-2" />
            Board
          </TabsTrigger>
          <TabsTrigger
            value="examples"
            className="data-[state=active]:bg-slate-900 data-[state=active]:text-purple-400"
          >
            <Folder className="w-4 h-4 mr-2" />
            Examples
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="data-[state=active]:bg-slate-900 data-[state=active]:text-green-400"
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
      
      <div className="p-4 border-t border-slate-700/50">
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
