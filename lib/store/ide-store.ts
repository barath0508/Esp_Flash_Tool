import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './auth-store';
// @ts-ignore
import { ESPLoader, Transport } from 'esptool-js';

// Web Serial API types
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
}

interface NavigatorSerial {
  requestPort(options?: { filters: any[] }): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
}

declare global {
  interface Navigator {
    serial: NavigatorSerial;
  }
}

export interface Sketch {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  saved?: boolean;
  userId?: string;
}

export interface Board {
  id: string;
  name: string;
  fqbn: string;
  platform: string;
  chipId?: string;
}

export interface Library {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  installed: boolean;
}

export interface SerialMessage {
  timestamp: Date;
  message: string;
  type: 'sent' | 'received' | 'error' | 'info';
}

interface IDEState {
  sketches: Sketch[];
  activeSketchId: string | null;
  selectedBoard: Board | null;
  libraries: Library[];
  serialMessages: SerialMessage[];
  serialPort: SerialPort | null;
  serialReader: ReadableStreamDefaultReader<Uint8Array> | null;
  serialConnected: boolean;
  isCompiling: boolean;
  isFlashing: boolean;
  mobileMenuOpen: boolean;
  serialMonitorOpen: boolean;
  libraryManagerOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;
  baudRate: number;

  setActiveSketch: (id: string) => void;
  addSketch: (sketch: Sketch) => void;
  updateSketchCode: (id: string, code: string) => void;
  renameSketch: (id: string, name: string) => void;
  deleteSketch: (id: string) => void;
  setSelectedBoard: (board: Board) => void;
  installLibrary: (id: string) => void;
  uninstallLibrary: (id: string) => void;
  addSerialMessage: (message: SerialMessage) => void;
  clearSerialMessages: () => void;
  connectSerial: () => Promise<void>;
  disconnectSerial: () => Promise<void>;
  setBaudRate: (rate: number) => void;
  setIsCompiling: (compiling: boolean) => void;
  setIsFlashing: (flashing: boolean) => void;
  flashSketch: () => Promise<void>;
  toggleMobileMenu: () => void;
  toggleSerialMonitor: () => void;
  toggleLibraryManager: () => void;
  saveProject: (sketchId: string) => Promise<void>;
  loadUserProjects: () => Promise<void>;
  deleteProject: (sketchId: string) => Promise<void>;
}

import { POPULAR_LIBRARIES } from '@/lib/data/libraries';

// Mock compiled binary for Blink (ESP32)
// In a real app, this would come from a backend compiler service
const MOCK_BINARY_URL = 'https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/sdk/esp32/bin/bootloader_dio_40m.bin'; // Using a real bin for testing, though it's a bootloader

export const useIDEStore = create<IDEState>((set, get) => ({
  sketches: [
    {
      id: '1',
      name: 'Blink.ino',
      code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}`,
      isActive: true,
    },
  ],
  activeSketchId: '1',
  selectedBoard: {
    id: 'esp32',
    name: 'ESP32 Dev Module',
    fqbn: 'esp32:esp32:esp32',
    platform: 'ESP32',
    chipId: 'ESP32',
  },
  libraries: POPULAR_LIBRARIES,
  serialMessages: [],
  serialPort: null,
  serialReader: null,
  serialConnected: false,
  isCompiling: false,
  isFlashing: false,
  mobileMenuOpen: false,
  serialMonitorOpen: true,
  libraryManagerOpen: false,
  isSaving: false,
  isLoading: false,
  baudRate: 115200,

  setActiveSketch: (id) =>
    set((state) => ({
      sketches: state.sketches.map((s) => ({ ...s, isActive: s.id === id })),
      activeSketchId: id,
    })),

  addSketch: (sketch) =>
    set((state) => ({
      sketches: [...state.sketches.map((s) => ({ ...s, isActive: false })), sketch],
      activeSketchId: sketch.id,
    })),

  updateSketchCode: (id, code) =>
    set((state) => {
      const updatedSketches = state.sketches.map((s) =>
        s.id === id ? { ...s, code, saved: false } : s
      );

      // Auto-save after 2 seconds of inactivity
      const sketch = updatedSketches.find(s => s.id === id);
      if (sketch?.userId) {
        setTimeout(() => {
          const currentState = useIDEStore.getState();
          const currentSketch = currentState.sketches.find(s => s.id === id);
          if (currentSketch && !currentSketch.saved) {
            currentState.saveProject(id);
          }
        }, 2000);
      }

      return { sketches: updatedSketches };
    }),

  renameSketch: (id, name) =>
    set((state) => ({
      sketches: state.sketches.map((s) => (s.id === id ? { ...s, name } : s)),
    })),

  deleteSketch: (id) =>
    set((state) => {
      const filtered = state.sketches.filter((s) => s.id !== id);
      const newActive = filtered.length > 0 ? filtered[0].id : null;
      return {
        sketches: filtered.map((s, i) => ({ ...s, isActive: i === 0 })),
        activeSketchId: newActive,
      };
    }),

  setSelectedBoard: (board) => set({ selectedBoard: board }),

  installLibrary: (id) =>
    set((state) => {
      // "Use without installing" - we just mark it as installed for UI feedback
      // In a real app, this might insert #include <Library.h> into the code
      const lib = state.libraries.find(l => l.id === id);
      if (lib && state.activeSketchId) {
        const activeSketch = state.sketches.find(s => s.id === state.activeSketchId);
        if (activeSketch) {
          // Optional: Insert include header
          // const includeLine = `#include <${lib.name}.h>\n`;
          // if (!activeSketch.code.includes(includeLine)) {
          //   get().updateSketchCode(activeSketch.id, includeLine + activeSketch.code);
          // }
        }
      }
      return {
        libraries: state.libraries.map((lib) =>
          lib.id === id ? { ...lib, installed: true } : lib
        ),
      };
    }),

  uninstallLibrary: (id) =>
    set((state) => ({
      libraries: state.libraries.map((lib) =>
        lib.id === id ? { ...lib, installed: false } : lib
      ),
    })),

  addSerialMessage: (message) =>
    set((state) => ({
      serialMessages: [...state.serialMessages, message],
    })),

  clearSerialMessages: () => set({ serialMessages: [] }),

  setBaudRate: (rate) => set({ baudRate: rate }),

  connectSerial: async () => {
    try {
      if (!('serial' in navigator)) {
        alert('Web Serial API not supported in this browser.');
        return;
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: get().baudRate });

      const reader = port.readable?.getReader();
      set({ serialPort: port, serialReader: reader, serialConnected: true });

      get().addSerialMessage({
        timestamp: new Date(),
        message: 'Connected to serial port',
        type: 'info',
      });

      if (!reader) return;

      // Start reading loop
      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              break;
            }
            if (value) {
              const text = new TextDecoder().decode(value);
              get().addSerialMessage({
                timestamp: new Date(),
                message: text,
                type: 'received',
              });
            }
          }
        } catch (error) {
          console.error('Serial read error:', error);
        }
      };

      readLoop();

    } catch (error) {
      console.error('Error connecting to serial:', error);
      get().addSerialMessage({
        timestamp: new Date(),
        message: 'Failed to connect to serial port',
        type: 'error',
      });
    }
  },

  disconnectSerial: async () => {
    const { serialPort, serialReader } = get();
    if (serialPort) {
      try {
        if (serialReader) {
          await serialReader.cancel();
          // reader.releaseLock() is called implicitly when stream is cancelled/closed usually,
          // but we might need to wait for the loop to exit.
        }
        await serialPort.close();
        set({ serialPort: null, serialReader: null, serialConnected: false });
        get().addSerialMessage({
          timestamp: new Date(),
          message: 'Disconnected from serial port',
          type: 'info',
        });
      } catch (error) {
        console.error('Error closing serial port:', error);
      }
    }
  },

  setIsCompiling: (compiling) => set({ isCompiling: compiling }),

  setIsFlashing: (flashing) => set({ isFlashing: flashing }),

  flashSketch: async () => {
    const { setIsCompiling, setIsFlashing, addSerialMessage, disconnectSerial, serialConnected, serialPort: existingPort } = get();

    // 1. Simulate Compilation
    setIsCompiling(true);
    addSerialMessage({ timestamp: new Date(), message: 'Compiling sketch...', type: 'info' });

    await new Promise(resolve => setTimeout(resolve, 2000)); // Mock compilation time

    setIsCompiling(false);
    addSerialMessage({ timestamp: new Date(), message: 'Compilation complete.', type: 'info' });

    // 2. Flash
    setIsFlashing(true);
    addSerialMessage({ timestamp: new Date(), message: 'Starting flash process...', type: 'info' });

    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API not supported');
      }

      let port = existingPort;

      // If we are already connected, we need to close the connection to let esptool-js take over
      if (serialConnected && existingPort) {
        addSerialMessage({ timestamp: new Date(), message: 'Closing serial monitor for flashing...', type: 'info' });

        // We must disconnect properly
        await disconnectSerial();

        // Wait a bit for the port to fully close and lock to be released
        await new Promise(r => setTimeout(r, 1000));

        // Reuse the same port object
        port = existingPort;
      } else {
        // Request port if not connected
        port = await navigator.serial.requestPort();
      }

      if (!port) {
        throw new Error('No serial port selected');
      }

      // Final check: ensure port is closed before passing to esptool-js
      // esptool-js needs to open the port itself
      if (port.readable || port.writable) {
        console.log('Port appears open, attempting to close...');
        try {
          // If locked, we can't close easily without the reader. 
          // But if we just called disconnectSerial, it should be free.
          await port.close();
        } catch (e) {
          console.warn('Failed to close port:', e);
          addSerialMessage({
            timestamp: new Date(),
            message: 'Warning: Port might be busy. If flashing fails, please unplug and replug the device.',
            type: 'error'
          });
        }
      }

      const transport = new Transport(port);

      // Mock terminal for esptool-js
      const terminal = {
        clean: () => { },
        writeLine: (data: string) => {
          addSerialMessage({ timestamp: new Date(), message: data, type: 'info' });
        },
        write: (data: string) => {
          addSerialMessage({ timestamp: new Date(), message: data, type: 'info' });
        }
      };

      const loader = new ESPLoader({
        transport,
        baudrate: 115200,
        terminal,
        romBaudrate: 115200
      });

      addSerialMessage({ timestamp: new Date(), message: 'Connecting to bootloader...', type: 'info' });

      await loader.main('default_reset');
      await loader.flashId();

      addSerialMessage({ timestamp: new Date(), message: 'Erasing flash...', type: 'info' });
      await loader.eraseFlash();

      addSerialMessage({ timestamp: new Date(), message: 'Writing firmware...', type: 'info' });

      // Create a mock binary string (magic byte 0xE9 + random data)
      // esptool-js expects a binary string, not Uint8Array
      const magicByte = String.fromCharCode(0xE9);
      const mockData = magicByte + Array(1024).fill(0).map(() => String.fromCharCode(Math.floor(Math.random() * 256))).join('');

      await loader.writeFlash({
        fileArray: [{ data: mockData, address: 0x1000 }],
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex: number, written: number, total: number) => {
          console.log(`Progress: ${written}/${total}`);
        }
      } as any);

      addSerialMessage({ timestamp: new Date(), message: 'Flashing complete! Resetting board...', type: 'info' });
      await transport.setDTR(false);
      await transport.setRTS(true); // Reset
      await new Promise(r => setTimeout(r, 100));
      await transport.setRTS(false);

    } catch (error: any) {
      console.error('Flashing error:', error);
      addSerialMessage({
        timestamp: new Date(),
        message: `Flashing failed: ${error.message || 'Unknown error'}. Try unplugging the device.`,
        type: 'error'
      });
    } finally {
      set({ isFlashing: false });
    }
  },

  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  toggleSerialMonitor: () =>
    set((state) => ({ serialMonitorOpen: !state.serialMonitorOpen })),

  toggleLibraryManager: () =>
    set((state) => ({ libraryManagerOpen: !state.libraryManagerOpen })),

  saveProject: async (sketchId) => {
    const state = useIDEStore.getState();
    const sketch = state.sketches.find(s => s.id === sketchId);
    const user = useAuthStore.getState().user;

    if (!sketch || !user || !state.selectedBoard) return;

    set({ isSaving: true });

    try {
      const { error } = await supabase.from('projects').upsert({
        id: sketch.id,
        user_id: user.id,
        name: sketch.name,
        code: sketch.code,
        board_id: state.selectedBoard.id,
        board_name: state.selectedBoard.name,
        board_fqbn: state.selectedBoard.fqbn,
        board_platform: state.selectedBoard.platform,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        set((state) => ({
          sketches: state.sketches.map(s =>
            s.id === sketchId ? { ...s, saved: true, userId: user.id } : s
          )
        }));
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  loadUserProjects: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        const sketches = data.map(project => ({
          id: project.id,
          name: project.name,
          code: project.code,
          isActive: false,
          saved: true,
          userId: project.user_id,
        }));

        set((state) => {
          const newSketches = [...sketches];
          if (newSketches.length > 0) {
            newSketches[0].isActive = true;
          }
          return {
            sketches: newSketches,
            activeSketchId: newSketches.length > 0 ? newSketches[0].id : null,
            selectedBoard: data[0] ? {
              id: data[0].board_id,
              name: data[0].board_name,
              fqbn: data[0].board_fqbn,
              platform: data[0].board_platform,
            } : state.selectedBoard,
          };
        });
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (sketchId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      await supabase.from('projects').delete().eq('id', sketchId).eq('user_id', user.id);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  },
}));
