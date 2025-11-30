import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './auth-store';

export interface CommunityProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  code: string;
  board_id: string;
  board_name: string;
  board_platform: string;
  category: string;
  tags: string[];
  likes_count: number;
  downloads_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_email?: string;
  is_liked?: boolean;
}

interface CommunityState {
  projects: CommunityProject[];
  loading: boolean;
  selectedCategory: string;
  searchQuery: string;
  
  loadProjects: () => Promise<void>;
  shareProject: (project: Omit<CommunityProject, 'id' | 'user_id' | 'likes_count' | 'downloads_count' | 'created_at' | 'updated_at'>) => Promise<void>;
  likeProject: (projectId: string) => Promise<void>;
  downloadProject: (projectId: string) => Promise<void>;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  projects: [],
  loading: false,
  selectedCategory: 'All',
  searchQuery: '',

  loadProjects: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('community_projects')
        .select(`
          *,
          community_likes!left(user_id)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const user = useAuthStore.getState().user;
        const projects = data.map(project => ({
          ...project,
          is_liked: user ? project.community_likes?.some((like: any) => like.user_id === user.id) : false,
        }));
        set({ projects });
      }
    } catch (error) {
      console.error('Error loading community projects:', error);
    } finally {
      set({ loading: false });
    }
  },

  shareProject: async (project) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { error } = await supabase.from('community_projects').insert({
        user_id: user.id,
        ...project,
      });

      if (!error) {
        get().loadProjects();
      }
    } catch (error) {
      console.error('Error sharing project:', error);
    }
  },

  likeProject: async (projectId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) return;

      if (project.is_liked) {
        await supabase.from('community_likes').delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId);
        
        await supabase.from('community_projects')
          .update({ likes_count: Math.max(0, project.likes_count - 1) })
          .eq('id', projectId);
      } else {
        await supabase.from('community_likes').insert({
          user_id: user.id,
          project_id: projectId,
        });
        
        await supabase.from('community_projects')
          .update({ likes_count: project.likes_count + 1 })
          .eq('id', projectId);
      }

      get().loadProjects();
    } catch (error) {
      console.error('Error liking project:', error);
    }
  },

  downloadProject: async (projectId) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) return;

      await supabase.from('community_projects')
        .update({ downloads_count: project.downloads_count + 1 })
        .eq('id', projectId);

      get().loadProjects();
    } catch (error) {
      console.error('Error downloading project:', error);
    }
  },

  setCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));