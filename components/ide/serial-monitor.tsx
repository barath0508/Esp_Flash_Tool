'use client';

import { useState, useRef, useEffect } from 'react';
import { useIDEStore } from '@/lib/store/ide-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plug,
  Unplug,
  Trash2,
  Send,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BAUD_RATES = [
  '9600',
  '19200',
  '38400',
  '57600',
  '115200',
  '230400',
  '460800',
  '921600',
];

export function SerialMonitor() {
  const {
    serialMessages,
    serialConnected,
    serialMonitorOpen,
    addSerialMessage,
    clearSerialMessages,
    setSerialConnected,
    toggleSerialMonitor,
  } = useIDEStore();

  const [baudRate, setBaudRate] = useState('115200');
  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialMessages]);

  const handleConnect = async () => {
    if ('serial' in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: parseInt(baudRate) });
        setSerialConnected(true);

        addSerialMessage({
          timestamp: new Date(),
          message: `Connected at ${baudRate} baud`,
          type: 'info',
        });

        const reader = port.readable.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          addSerialMessage({
            timestamp: new Date(),
            message: text,
            type: 'received',
          });
        }
      } catch (error) {
        addSerialMessage({
          timestamp: new Date(),
          message: `Connection failed: ${error}`,
          type: 'error',
        });
      }
    } else {
      addSerialMessage({
        timestamp: new Date(),
        message: 'Web Serial API not supported in this browser',
        type: 'error',
      });
    }
  };

  const handleDisconnect = () => {
    setSerialConnected(false);
    addSerialMessage({
      timestamp: new Date(),
      message: 'Disconnected',
      type: 'info',
    });
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      addSerialMessage({
        timestamp: new Date(),
        message: inputMessage,
        type: 'sent',
      });
      setInputMessage('');
    }
  };

  if (!serialMonitorOpen) return null;

  return (
    <div
      className={cn(
        'border-t border-gray-700 bg-gray-900 flex flex-col',
        isExpanded ? 'h-96' : 'h-48',
        'lg:h-auto lg:min-h-[200px]'
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">Serial Monitor</span>
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              serialConnected ? 'bg-green-500' : 'bg-gray-500'
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={baudRate} onValueChange={setBaudRate}>
            <SelectTrigger className="w-24 h-7 text-xs bg-gray-900 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BAUD_RATES.map((rate) => (
                <SelectItem key={rate} value={rate}>
                  {rate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {serialConnected ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDisconnect}
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-950"
            >
              <Unplug className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleConnect}
              className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-green-950"
            >
              <Plug className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={clearSerialMessages}
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700 lg:hidden"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSerialMonitor}
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
        {serialMessages.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No messages yet. Connect to start monitoring.
          </div>
        ) : (
          serialMessages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-2',
                msg.type === 'sent' && 'text-blue-400',
                msg.type === 'received' && 'text-green-400',
                msg.type === 'error' && 'text-red-400',
                msg.type === 'info' && 'text-yellow-400'
              )}
            >
              <span className="text-gray-500">
                {msg.timestamp.toLocaleTimeString()}
              </span>
              <span className="flex-1 break-all">{msg.message}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Send message..."
            disabled={!serialConnected}
            className="flex-1 h-8 text-sm bg-gray-800 border-gray-600"
          />
          <Button
            onClick={handleSend}
            disabled={!serialConnected || !inputMessage.trim()}
            size="sm"
            className="h-8 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
