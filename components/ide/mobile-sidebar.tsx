'use client';

import { useIDEStore } from '@/lib/store/ide-store';
import { BoardSelector } from './board-selector';
import { ExamplesPanel } from './examples-panel';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Folder, Upload, X } from 'lucide-react';

export function MobileSidebar() {
  const { mobileMenuOpen, toggleMobileMenu } = useIDEStore();

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={toggleMobileMenu}>
      <SheetContent
        side="left"
        className="w-full sm:w-96 bg-gray-900 border-gray-700 text-white p-0"
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="px-4 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white">Arduino IDE</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>

          <Tabs defaultValue="board" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none bg-gray-800 border-b border-gray-700">
              <TabsTrigger
                value="board"
                className="data-[state=active]:bg-gray-900"
              >
                <Cpu className="w-4 h-4 mr-2" />
                Board
              </TabsTrigger>
              <TabsTrigger
                value="examples"
                className="data-[state=active]:bg-gray-900"
              >
                <Folder className="w-4 h-4 mr-2" />
                Examples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="flex-1 p-4 mt-0">
              <BoardSelector />
            </TabsContent>

            <TabsContent value="examples" className="flex-1 mt-0 overflow-hidden">
              <ExamplesPanel />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
