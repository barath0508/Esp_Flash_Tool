'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code2, Cpu, Zap, Terminal, Package, BookOpen, User, LogOut, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-cosmic-blue text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-cosmic-purple/30">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cosmic-blue/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cosmic-purple/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-24 pt-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cosmic-blue to-cosmic-purple flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">FlashESP</span>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-400 text-sm hidden sm:inline-block">{user.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="rounded-full px-6"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cosmic-cyan" />
            <span className="text-sm text-gray-300">Next-Gen Web IDE for Makers</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight animate-fade-in [animation-delay:200ms]">
            Code. Compile. <br />
            <span className="bg-cosmic-gradient bg-clip-text text-transparent">Flash.</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms]">
            Professional Arduino & ESP32 development environment in your browser.
            Zero installation, instant compilation, and seamless flashing.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in [animation-delay:600ms]">
            {user ? (
              <Link href="/ide">
                <Button size="lg" variant="cosmic" className="w-full sm:w-auto text-lg px-8 h-14 rounded-xl">
                  Launch IDE
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                variant="cosmic"
                className="w-full sm:w-auto text-lg px-8 h-14 rounded-xl"
                onClick={() => setAuthDialogOpen(true)}
              >
                Start Coding Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 h-14 rounded-xl border-white/10 hover:bg-white/5"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </Button>
          </div>
        </div>

        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {[
            {
              icon: Code2,
              title: "Monaco Editor",
              desc: "Professional code editor with syntax highlighting, autocomplete, and C++ support.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Cpu,
              title: "Multi-Board Support",
              desc: "ESP32, ESP8266, Arduino Uno, Mega, Nano, and more boards supported.",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Zap,
              title: "Instant Flash",
              desc: "Build and upload your code directly to hardware via USB or OTA.",
              color: "from-yellow-500 to-orange-500"
            },
            {
              icon: Terminal,
              title: "Serial Monitor",
              desc: "Real-time communication with your device using Web Serial API.",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Package,
              title: "Library Manager",
              desc: "Browse and install 5000+ Arduino libraries with one click.",
              color: "from-red-500 to-rose-500"
            },
            {
              icon: BookOpen,
              title: "Examples",
              desc: "100+ ready-to-use examples for WiFi, Bluetooth, sensors, and more.",
              color: "from-indigo-500 to-violet-500"
            }
          ].map((feature, i) => (
            <Card key={i} className="group hover:bg-white/10 transition-all duration-500 border-white/5 hover:border-white/20">
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-cosmic-blue transition-colors">{feature.title}</CardTitle>
                <CardDescription className="text-gray-400 group-hover:text-gray-300">
                  {feature.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-1 bg-white/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-blue/20 to-cosmic-purple/20 blur-3xl -z-10" />
          <div className="bg-background/80 rounded-[20px] p-12 text-center backdrop-blur-xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              Code Anywhere, Anytime
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
              Optimized for touch interfaces and all screen sizes. Develop on your phone,
              tablet, or desktop with the same powerful features.
            </p>
            <Link href="/ide">
              <Button size="lg" variant="cosmic" className="rounded-xl px-8">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>

        <footer className="mt-24 text-center text-gray-600 text-sm pb-8">
          <p>© 2024 FlashESP. Built with Next.js & Web Serial API.</p>
        </footer>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}
