'use client';

import { useState } from 'react';
import { useIDEStore } from '@/lib/store/ide-store';
import { EXAMPLES, EXAMPLE_CATEGORIES } from '@/lib/data/examples';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileCode, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ExamplesPanel() {
  const { addSketch } = useIDEStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExamples = EXAMPLES.filter((example) => {
    const matchesCategory =
      selectedCategory === 'All' || example.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      example.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLoadExample = (example: typeof EXAMPLES[0]) => {
    addSketch({
      id: `example-${Date.now()}`,
      name: `${example.name}.ino`,
      code: example.code,
      isActive: true,
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Examples
        </h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search examples..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {EXAMPLE_CATEGORIES.map((category) => (
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
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredExamples.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No examples found
            </div>
          ) : (
            filteredExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => handleLoadExample(example)}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-600 hover:bg-gray-750 transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  <FileCode className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {example.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {example.description}
                    </p>
                    <div className="mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                        {example.category}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
