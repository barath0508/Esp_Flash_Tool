'use client';

import { useState, useEffect } from 'react';
import { useIDEStore } from '@/lib/store/ide-store';
import { POPULAR_LIBRARIES, LIBRARY_CATEGORIES } from '@/lib/data/libraries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, Check, X, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LibraryManager() {
  const { libraries, libraryManagerOpen, toggleLibraryManager, installLibrary, uninstallLibrary } = useIDEStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredLibs, setFilteredLibs] = useState(POPULAR_LIBRARIES);

  useEffect(() => {
    if (libraries.length === 0) {
      useIDEStore.setState({ libraries: POPULAR_LIBRARIES });
    }
  }, []);

  useEffect(() => {
    let result = libraries.length > 0 ? libraries : POPULAR_LIBRARIES;

    if (selectedCategory !== 'All') {
      result = result.filter((lib) => lib.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lib) =>
          lib.name.toLowerCase().includes(query) ||
          lib.description.toLowerCase().includes(query)
      );
    }

    setFilteredLibs(result);
  }, [searchQuery, selectedCategory, libraries]);

  return (
    <Dialog open={libraryManagerOpen} onOpenChange={toggleLibraryManager}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Library Manager
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Search and install Arduino libraries for your project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search libraries..."
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {LIBRARY_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'text-xs',
                  selectedCategory === category
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-4">
              {filteredLibs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No libraries found matching your search
                </div>
              ) : (
                filteredLibs.map((lib) => (
                  <div
                    key={lib.id}
                    className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">
                            {lib.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-600 text-gray-400"
                          >
                            v{lib.version}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {lib.description}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-700 text-gray-300"
                        >
                          {lib.category}
                        </Badge>
                      </div>

                      <div className="flex-shrink-0">
                        {lib.installed ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => uninstallLibrary(lib.id)}
                            className="border-red-600 text-red-400 hover:bg-red-950 hover:text-red-300"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => installLibrary(lib.id)}
                            className="border-green-600 text-green-400 hover:bg-green-950 hover:text-green-300"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Install
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                {filteredLibs.filter((lib) => lib.installed).length} installed
              </span>
              <span>{filteredLibs.length} libraries</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
