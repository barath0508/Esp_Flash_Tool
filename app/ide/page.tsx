'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { CodeEditor } from '@/components/ide/code-editor';
import { MobileToolbar } from '@/components/ide/mobile-toolbar';
import { SketchTabs } from '@/components/ide/sketch-tabs';
import { SerialMonitor } from '@/components/ide/serial-monitor';
import { LibraryManager } from '@/components/ide/library-manager';
import { MobileSidebar } from '@/components/ide/mobile-sidebar';
import { DesktopSidebar } from '@/components/ide/desktop-sidebar';
import { useAuthStore } from '@/lib/store/auth-store';
import { useIDEStore } from '@/lib/store/ide-store';

export default function IDEPage() {
  const router = useRouter();
  const { user, loading, initialize } = useAuthStore();
  const { loadUserProjects } = useIDEStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      loadUserProjects();
    }
  }, [user, loading, router, loadUserProjects]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex flex-col">
      <MobileToolbar />
      <MobileSidebar />
      <LibraryManager />

      <div className="flex-1 flex overflow-hidden pt-14 lg:pt-0">
        <DesktopSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <SketchTabs />

          <ResizablePanelGroup
            direction="vertical"
            className="flex-1"
          >
            <ResizablePanel defaultSize={70} minSize={30}>
              <CodeEditor />
            </ResizablePanel>

            <ResizableHandle className="h-1 bg-gray-700 hover:bg-blue-600 transition-colors" />

            <ResizablePanel defaultSize={30} minSize={15}>
              <SerialMonitor />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
