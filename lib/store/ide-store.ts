import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './auth-store';

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
  serialPort: any;
  serialConnected: boolean;
  isCompiling: boolean;
  isFlashing: boolean;
  mobileMenuOpen: boolean;
  serialMonitorOpen: boolean;
  libraryManagerOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;

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
  setSerialPort: (port: any) => void;
  setSerialConnected: (connected: boolean) => void;
  setIsCompiling: (compiling: boolean) => void;
  setIsFlashing: (flashing: boolean) => void;
  toggleMobileMenu: () => void;
  toggleSerialMonitor: () => void;
  toggleLibraryManager: () => void;
  saveProject: (sketchId: string) => Promise<void>;
  loadUserProjects: () => Promise<void>;
  deleteProject: (sketchId: string) => Promise<void>;
}

import { POPULAR_LIBRARIES } from '@/lib/data/libraries';

export const useIDEStore = create<IDEState>((set) => ({
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
  },
  libraries: POPULAR_LIBRARIES,
  serialMessages: [],
  serialPort: null,
  serialConnected: false,
  isCompiling: false,
  isFlashing: false,
  mobileMenuOpen: false,
  serialMonitorOpen: true,
  libraryManagerOpen: false,
  isSaving: false,
  isLoading: false,

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
    set((state) => ({
      libraries: state.libraries.map((lib) =>
        lib.id === id ? { ...lib, installed: true } : lib
      ),
    })),

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

  setSerialPort: (port) => set({ serialPort: port }),

  setSerialConnected: (connected) => set({ serialConnected: connected }),

  setIsCompiling: (compiling) => set({ isCompiling: compiling }),

  setIsFlashing: (flashing) => set({ isFlashing: flashing }),

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
