import React from 'react';
import { ArrowUpRight, Box, Terminal, Cpu, Mic, Layers, Zap, Anchor, Globe, Command, ArrowRight } from 'lucide-react';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800">
    <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white flex items-center justify-center">
          <Command size={16} className="text-black" strokeWidth={3} />
        </div>
        <span className="font-sans font-bold text-lg tracking-tighter text-white">JDI.SH</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Est. 2024</span>
        <div className="h-4 w-[1px] bg-zinc-800"></div>
        <a href="mailto:hello@jdi.sh" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest">Contact</span>
        </a>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-40 pb-32 px-6 max-w-[1400px] mx-auto border-b border-zinc-800">
    <div className="max-w-4xl">
      <div className="inline-flex items-center gap-2 mb-8 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900/50">
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Software Holdings</span>
      </div>
      
      <h1 className="text-6xl md:text-9xl font-bold text-white mb-10 tracking-tighter leading-[0.85] font-sans">
        JUST DO IT.
      </h1>
      
      <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-light font-sans border-l-2 border-orange-500 pl-6">
        We build and ship cool software to improve life one thing at a time. 
        No bloat. No bureaucracy. Just shipping.
      </p>
    </div>
  </section>
);

const ManifestoItem = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="group border-b border-zinc-800 py-12 hover:bg-zinc-900/20 transition-colors">
    <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-2 text-zinc-600 font-mono text-xs uppercase tracking-widest pt-2">
        {number}
      </div>
      <div className="md:col-span-4">
        <h3 className="text-2xl font-bold text-white font-sans uppercase tracking-tight group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
      </div>
      <div className="md:col-span-6">
        <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-lg">
          {desc}
        </p>
      </div>
    </div>
  </div>
);

const Manifesto = () => (
  <section className="border-b border-zinc-800">
    <ManifestoItem 
      number="01" 
      title="Ship Fast" 
      desc="Speed is a feature. We believe in getting ideas out of the notebook and into the world as quickly as possible." 
    />
    <ManifestoItem 
      number="02" 
      title="Craft Matters" 
      desc="Just because it's fast doesn't mean it's broken. We sweat the details on interaction, performance, and aesthetic." 
    />
    <ManifestoItem 
      number="03" 
      title="Compound Value" 
      desc="We build tools that build other tools. Our infrastructure libraries power our consumer apps." 
    />
  </section>
);

const ProjectCard = ({ 
  title, 
  desc, 
  tags, 
  featured = false,
  links = [],
  children
}: { 
  title: string, 
  desc: string, 
  tags: string[], 
  featured?: boolean,
  links?: { label: string, url: string }[],
  children?: React.ReactNode 
}) => (
  <div className={`group relative border border-zinc-800 bg-[#0c0c0e] overflow-hidden ${featured ? 'md:col-span-2 min-h-[500px]' : 'min-h-[400px]'}`}>
    
    {/* Background Grid */}
    <div className="absolute inset-0 opacity-20 pointer-events-none" 
         style={{ backgroundImage: 'linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
    </div>

    <div className="relative h-full flex flex-col justify-between p-8 z-10">
      <div>
        <div className="flex items-center gap-3 mb-6">
          {tags.map(t => (
            <span key={t} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-400 font-bold rounded-sm">
              {t}
            </span>
          ))}
        </div>
        
        <h3 className={`font-bold text-white font-sans mb-4 tracking-tight ${featured ? 'text-4xl' : 'text-2xl'}`}>
          {title}
        </h3>
        
        <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-md">
          {desc}
        </p>

        {links.length > 0 && (
          <div className="flex gap-4 mt-6">
            {links.map(link => (
              <a key={link.label} href={link.url} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-orange-500 transition-colors">
                {link.label} <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Visual Content Area */}
      <div className="mt-12 relative flex-1">
         {children}
      </div>
    </div>
  </div>
);

const Holdings = () => (
  <section className="py-32 px-6 max-w-[1400px] mx-auto">
    <div className="flex items-end justify-between mb-16">
      <h2 className="text-4xl font-bold text-white font-sans tracking-tight">HOLDINGS</h2>
      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
        <Anchor size={14} />
        <span>PORTFOLIO_INDEX_V1</span>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      {/* TALKIE (Flagship) */}
      <ProjectCard 
        featured 
        title="Talkie" 
        desc="The next-generation voice interface for human-computer interaction. Talkie removes the friction of typing, creating a fluid, natural conversation loop with your AI agents."
        tags={['Consumer', 'AI', 'Voice']}
        links={[{ label: 'Visit Site', url: 'https://usetalkie.com' }]}
      >
        <div className="absolute right-0 bottom-0 w-[80%] h-[90%] bg-zinc-900/50 border-t border-l border-zinc-800 rounded-tl-2xl p-6 overflow-hidden group-hover:bg-zinc-900 transition-colors">
          {/* Abstract Voice UI */}
          <div className="flex flex-col h-full justify-center items-center gap-6">
             <div className="flex gap-2 items-center justify-center">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-3 bg-white rounded-full animate-pulse`} style={{ height: `${Math.random() * 40 + 20}px`, animationDuration: `${Math.random() * 0.5 + 0.5}s` }}></div>
                ))}
             </div>
             <div className="text-center">
                <p className="text-lg text-white font-sans font-medium">"Create a reminder for tomorrow"</p>
                <p className="text-sm text-zinc-500 font-mono mt-2">Processing...</p>
             </div>
          </div>
        </div>
      </ProjectCard>

      {/* WFKit */}
      <ProjectCard 
        title="WFKit" 
        desc="A high-performance workflow graph engine for Swift. Brings React Flow-style node editing to native macOS & iOS apps with zero dependencies."
        tags={['Open Source', 'Library', 'Swift']}
        links={[{ label: 'View Docs', url: '#' }]}
      >
        <div className="absolute right-[-20px] bottom-[-20px] p-6 opacity-40 group-hover:opacity-100 transition-opacity">
           <Layers size={140} strokeWidth={0.5} className="text-zinc-600" />
        </div>
      </ProjectCard>

      {/* DebugKit */}
      <ProjectCard 
        title="DebugKit" 
        desc="Instant developer tools for SwiftUI. Inject a powerful debug toolbar into any view hierarchy with a single line of code."
        tags={['Open Source', 'Library', 'Swift']}
        links={[{ label: 'View Docs', url: '#' }]}
      >
        <div className="absolute right-[-20px] bottom-[-20px] p-6 opacity-40 group-hover:opacity-100 transition-opacity">
           <Terminal size={140} strokeWidth={0.5} className="text-zinc-600" />
        </div>
      </ProjectCard>

    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-zinc-800 bg-[#050505] py-20">
    <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-white flex items-center justify-center">
            <Command size={12} className="text-black" strokeWidth={3} />
          </div>
          <span className="font-sans font-bold text-sm tracking-tighter text-white">JDI.SH</span>
        </div>
        <p className="text-zinc-600 text-xs font-mono max-w-xs">
          © 2024 Just Do It Software Holdings.<br/>
          Shipping from somewhere on the internet.
        </p>
      </div>
      
      <div className="flex gap-12">
        <a href="#" className="text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Twitter</a>
        <a href="#" className="text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">GitHub</a>
        <a href="mailto:hello@jdi.sh" className="text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Email</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-orange-500/30 selection:text-orange-200 font-mono">
      <Navbar />
      <Hero />
      <Manifesto />
      <Holdings />
      <Footer />
    </div>
  );
}