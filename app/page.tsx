'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code2, Cpu, Zap, Terminal, Package, BookOpen, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { AuthDialog } from '@/components/auth/auth-dialog';

export default function Home() {
  const { user, loading, signOut, initialize } = useAuthStore();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-between mb-8">
            <div />
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <Code2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FlashESP IDE
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-white text-sm">{user.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="text-white hover:bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional Arduino & ESP32 development environment in your browser.
            <span className="block mt-2 text-lg text-purple-300">Write, compile, and flash firmware with zero installation.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/ide">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
                  Launch IDE
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                onClick={() => setAuthDialogOpen(true)}
              >
                Sign In to Launch IDE
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>

        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Monaco Editor</CardTitle>
              <CardDescription className="text-gray-400">
                Professional code editor with syntax highlighting, autocomplete, and C++ support
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Multi-Board Support</CardTitle>
              <CardDescription className="text-gray-400">
                ESP32, ESP8266, Arduino Uno, Mega, Nano, and more boards supported
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Compile & Flash</CardTitle>
              <CardDescription className="text-gray-400">
                Build and upload your code directly to hardware via USB or OTA
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Serial Monitor</CardTitle>
              <CardDescription className="text-gray-400">
                Real-time communication with your device using Web Serial API
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Library Manager</CardTitle>
              <CardDescription className="text-gray-400">
                Browse and install 5000+ Arduino libraries with one click
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Example Library</CardTitle>
              <CardDescription className="text-gray-400">
                100+ ready-to-use examples for WiFi, Bluetooth, sensors, and more
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Mobile-First Design
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Optimized for touch interfaces and all screen sizes. Develop on your phone,
            tablet, or desktop with the same powerful features.
          </p>
          <Link href="/ide">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with Next.js, Monaco Editor, and Web Serial API</p>
        </footer>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}
