'use client';

import { useIDEStore } from '@/lib/store/ide-store';
import { BOARDS } from '@/lib/data/boards';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cpu } from 'lucide-react';

export function BoardSelector() {
  const { selectedBoard, setSelectedBoard } = useIDEStore();

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <Cpu className="w-4 h-4" />
        Board
      </label>
      <Select
        value={selectedBoard?.id}
        onValueChange={(value) => {
          const board = BOARDS.find((b) => b.id === value);
          if (board) setSelectedBoard(board);
        }}
      >
        <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BOARDS.map((board) => (
            <SelectItem key={board.id} value={board.id}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{board.name}</span>
                <span className="text-xs text-gray-500">{board.platform}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedBoard && (
        <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded">
          <div>
            <span className="text-gray-400">FQBN:</span> {selectedBoard.fqbn}
          </div>
          <div>
            <span className="text-gray-400">Platform:</span>{' '}
            {selectedBoard.platform}
          </div>
        </div>
      )}
    </div>
  );
}
