'use client';

import { useEffect } from 'react';
import { useCommunityStore } from '@/lib/store/community-store';
import { useIDEStore } from '@/lib/store/ide-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Download, Search, Code2, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Sensors', 'IoT', 'Display', 'Motors', 'Communication', 'Games', 'Utilities'];

export function CommunityPanel() {
  const { projects, loading, selectedCategory, searchQuery, loadProjects, likeProject, downloadProject, setCategory, setSearchQuery } = useCommunityStore();
  const { addSketch } = useIDEStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = async (project: any) => {
    await downloadProject(project.id);
    addSketch({
      id: `community-${Date.now()}`,
      name: project.title,
      code: project.code,
      isActive: true,
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-gray-900">
      <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
        <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">Community Projects</h2>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600/50 text-white backdrop-blur-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setCategory}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 py-12 animate-pulse">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No projects found</div>
        ) : (
          filteredProjects.map(project => (
            <Card key={project.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-sm font-medium">{project.title}</CardTitle>
                    <CardDescription className="text-xs text-gray-400 mt-1">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {project.category}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Anonymous
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {project.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {project.downloads_count}
                    </span>
                    <Badge variant="outline" className="text-xs border-slate-600/50 text-slate-300">
                      {project.board_platform}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => likeProject(project.id)}
                      className={cn(
                        "h-7 px-2 text-xs",
                        project.is_liked ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-white"
                      )}
                    >
                      <Heart className={cn("w-3 h-3", project.is_liked && "fill-current")} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(project)}
                      className="h-7 px-3 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                    >
                      <Code2 className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}