import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Box, Terminal, Cpu, Mic, Layers, Zap, Anchor, Globe, Command, ArrowRight, X, ChevronRight, RefreshCw, Hash, AlignLeft, Type, ChevronDown, Clock, BookOpen, Languages, Play, MousePointer, Volume2, CheckCircle, Chrome } from 'lucide-react';

// --- Acronym Data (Mode 1) ---

const JDI_PHRASES = [
  "Just Do It",
  "Just Deploy It",
  "Joint Design Initiative",
  "Jedi Defense Institute",
  "Javascript Domination Institute",
  "Joyful Digital Interfaces",
  "Junior Developer Issues",
  "Juicy Data Insights",
  "Jet Driven Ignition",
  "Just Debug It",
  "Jazz Duo Improv",
  "Jumbo Dumpling Index",
  "Java Developers Incorporated",
  "Jupiter Defense Initiative",
  "Just Download It"
];

const SH_PHRASES = [
  "Software Holdings",
  "Software House",
  "Ship Hard",
  "Super Heroes",
  "System Hackers",
  "Shell Host",
  "Source Hub",
  "Syntax Highlighters",
  "Silicon Harbor",
  "Stack Heaps",
  "Self Hosting",
  "Server Health",
  "Static HTML",
  "Secure Hash",
  "System Halt"
];

// --- Sentence Data (Mode 2 - Initials) ---
const JDI_SENTENCES = [
  "Just Design Interfaces So Human",
  "Join Digital Innovators Shipping Hardware",
  "JavaScript Developers In Silicon Hills",
  "Journey Deep Inside System Heaps",
  "Judge Data In Safe Hands",
  "Just Deploy It, Stay Hungry",
  "Jet Dreams Ignite Sky High",
  "Junior Devs Ignore Safe Hooks",
  "Just Do It, Ship Hard",
  "Joyful Design Is Super Hard",
  "Jason Dropped Into Shell Hell",
  "Jupiter Density Is So Heavy"
];

// --- Stream Data (Mode 3 - Embedded) ---
const JDI_STREAMS = [
  "The trajectory of modern software is to abstract the machine, but we reject the dogma that complication is helpful.",
  "Subjective code quality often vanishes when you ship hard deadlines.",
  "Objects in modern Swift can crash hard if not handled with care.",
  "Major paradigm shifts cause chaos, but judging distance is how we survive.",
  "Project adaption was hard, but the result justified the struggle.",
  "We inject dependencies into systems holding critical user data.",
  "Adjusting the display is a harsh reality of frontend engineering.",
  "Trajectory data is showing high latency across the cluster.",
  "Subjecting digital infrastructure to standard heuristics is mandatory."
];

// --- Secret Components ---

type TerminalMode = 'ACRONYM' | 'SENTENCE' | 'STREAM';

interface HistoryItem {
  id: string;
  mode: TerminalMode;
  content: React.ReactNode;
  timestamp: string;
}

// Universal Highlighter handles both Acronym Initials and Distributed Sequences
const UniversalHighlighter = ({ text, mode, subType }: { text: string, mode: TerminalMode, subType?: 'PREFIX' | 'SUFFIX' }) => {
  const elements: React.ReactNode[] = [];
  
  // LOGIC 1: ACRONYM INITIALS
  if (mode === 'ACRONYM') {
    // If Prefix (JDI), highlight J, D, I initials
    // If Suffix (SH), highlight S, H initials
    const words = text.split(' ');
    let targetIndex = 0;
    const targets = subType === 'PREFIX' ? ['j','d','i'] : ['s','h'];
    const highlightColor = subType === 'PREFIX' ? 'text-orange-500' : 'text-blue-500';
    
    words.forEach((word, wordIdx) => {
      const firstChar = word.charAt(0);
      const rest = word.slice(1);
      
      const isTarget = targetIndex < targets.length && firstChar.toLowerCase() === targets[targetIndex];
      if (isTarget) targetIndex++;

      elements.push(
        <span key={`word-${wordIdx}`} className="mr-2 inline-block">
          <span className={`${isTarget ? `${highlightColor} font-bold glow-text` : 'text-zinc-400'}`}>{firstChar}</span>
          <span className="text-zinc-500">{rest}</span>
        </span>
      );
    });
    
    return <>{elements}</>;
  }

  // LOGIC 2: DISTRIBUTED SEQUENCE (J...D...I...S...H)
  const targetChars = ['j', 'd', 'i', 's', 'h'];
  let searchIdx = 0; 
  let lastIdx = 0;

  for (let i = 0; i < text.length; i++) {
    if (searchIdx < targetChars.length && text[i].toLowerCase() === targetChars[searchIdx]) {
      // Match found
      if (i > lastIdx) {
        elements.push(<span key={`text-${i}`} className="text-zinc-600 transition-colors">{text.slice(lastIdx, i)}</span>);
      }
      elements.push(
        <span key={`char-${i}`} className="text-orange-500 font-bold glow-text bg-orange-500/10 rounded-sm px-0.5 mx-[-1px]">
          {text[i]}
        </span>
      );
      lastIdx = i + 1;
      searchIdx++;
    }
  }
  
  if (lastIdx < text.length) {
    elements.push(<span key="text-end" className="text-zinc-600">{text.slice(lastIdx)}</span>);
  }

  return <>{elements}</>;
};

const SecretTerminal = ({ onClose }: { onClose: () => void }) => {
  const [mode, setMode] = useState<TerminalMode>('ACRONYM');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Current Active State
  const [activeContent, setActiveContent] = useState<React.ReactNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Layout State
  const [height, setHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Resize Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY;
      // Constraints: Min 200px, Max 80% of screen
      if (newHeight >= 200 && newHeight <= window.innerHeight * 0.8) {
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while resizing
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, activeContent]);

  const addToHistory = (content: React.ReactNode, m: TerminalMode) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + "." + Math.floor(Math.random() * 999).toString().padStart(3, '0');
    setHistory(prev => [...prev.slice(-20), { id: Math.random().toString(36), mode: m, content, timestamp }]);
  };

  const generate = () => {
    if (isGenerating) return;
    
    // If we have existing content, push it to history before generating new
    if (activeContent) {
      addToHistory(activeContent, mode);
    }

    setIsGenerating(true);
    let count = 0;
    const max = 8; // Faster roll for snappiness

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      count++;
      
      let newContent: React.ReactNode;

      if (mode === 'ACRONYM') {
        const jPhrase = JDI_PHRASES[Math.floor(Math.random() * JDI_PHRASES.length)];
        const sPhrase = SH_PHRASES[Math.floor(Math.random() * SH_PHRASES.length)];
        
        newContent = (
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-baseline">
             <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-widest text-orange-500/50 select-none">PREFIX</span>
                <span className="text-xl font-bold tracking-tight">
                  <UniversalHighlighter text={jPhrase} mode="ACRONYM" subType="PREFIX" />
                </span>
             </div>
             <div className="hidden md:block text-zinc-800">/</div>
             <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-widest text-blue-500/50 select-none">SUFFIX</span>
                <span className="text-xl font-bold tracking-tight">
                  <UniversalHighlighter text={sPhrase} mode="ACRONYM" subType="SUFFIX" />
                </span>
             </div>
          </div>
        );
      } else {
        const rawText = mode === 'SENTENCE' 
          ? JDI_SENTENCES[Math.floor(Math.random() * JDI_SENTENCES.length)]
          : JDI_STREAMS[Math.floor(Math.random() * JDI_STREAMS.length)];
          
        newContent = (
          <div className="text-lg md:text-xl font-medium leading-relaxed">
            <UniversalHighlighter text={rawText} mode={mode} />
          </div>
        );
      }

      setActiveContent(newContent);

      if (count >= max) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsGenerating(false);
      }
    }, 60);
  };

  // Initial generation on mount
  useEffect(() => {
    generate();
    return () => {
       if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // Run once

  // Reset active content when mode changes so we don't push wrong mode to history
  useEffect(() => {
     setActiveContent(null);
     generate();
  }, [mode]);

  return (
    <div 
      style={{ height: `${height}px` }}
      className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0c0c0e] border-t border-zinc-800 shadow-[0_-20px_50px_rgba(0,0,0,0.7)] flex flex-col font-mono animate-in slide-in-from-bottom duration-500 ease-out"
    >
      {/* Resize Handle */}
      <div 
        onMouseDown={() => setIsResizing(true)}
        className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize z-50 hover:bg-orange-500/50 transition-colors flex justify-center items-center group"
      >
        <div className="w-12 h-0.5 bg-zinc-700 group-hover:bg-white rounded-full transition-colors opacity-0 group-hover:opacity-100" />
      </div>

      {/* Console Toolbar */}
      <div className="bg-[#09090b] border-b border-zinc-800 h-10 flex items-center justify-between px-4 select-none flex-shrink-0">
         <div className="flex items-center gap-6">
           <div 
             className="flex items-center gap-2 text-zinc-500 hover:text-white cursor-pointer transition-colors group" 
             onClick={onClose}
           >
              <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-red-400"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Close Terminal</span>
           </div>
           
           <div className="h-4 w-[1px] bg-zinc-800"></div>
           
           {/* Mode Switcher */}
           <div className="flex bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800">
              {(['ACRONYM', 'SENTENCE', 'STREAM'] as TerminalMode[]).map((m) => (
                <button 
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-[4px] transition-all ${mode === m ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  {m}
                </button>
              ))}
           </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500">{isGenerating ? 'PROCESSING' : 'READY'}</span>
            </div>
            
            <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors p-1">
               <X size={14} />
            </button>
         </div>
      </div>

      {/* Console Output Area */}
      <div className="flex-1 p-6 relative bg-[#050505] overflow-hidden flex flex-col">
         {/* Scanline & Grid */}
         <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-0"></div>
         <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

         {/* Scrollable Log */}
         <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar mb-4 pr-2 space-y-2 z-10 min-h-0">
            {history.length === 0 && (
              <div className="text-zinc-700 text-xs italic opacity-50 pt-10 text-center">
                 {'>'} SEQUENCE_LOG_INITIALIZED...
              </div>
            )}
            
            {history.map((item) => (
              <div key={item.id} className="flex items-baseline gap-4 text-xs group opacity-60 hover:opacity-100 transition-opacity">
                 <div className="w-24 flex-shrink-0 text-zinc-600 font-mono text-[10px] flex items-center gap-2">
                    <span>{item.timestamp}</span>
                    <span className="text-zinc-700">|</span>
                 </div>
                 <div className="flex-1">
                    {/* Render content but force smaller text for history */}
                    {/* Remove grayscale so colors persist, just reduce opacity */}
                    <div className="scale-90 origin-left transition-all">
                      {item.content}
                    </div>
                 </div>
              </div>
            ))}
         </div>

         {/* Active Generation Row (Sticky Bottom) */}
         <div className="border-t border-zinc-800/50 pt-4 mt-auto z-10 flex-shrink-0 bg-[#050505]/95 backdrop-blur-sm">
             <div className="flex items-center gap-4 mb-2">
                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2">
                  <ChevronRight size={12} className="text-orange-500" />
                  CURRENT_SEQUENCE
                </div>
             </div>
             
             <div className="min-h-[60px] flex items-center">
               {activeContent ? (
                 <div className="w-full animate-in fade-in duration-300">
                   {activeContent}
                 </div>
               ) : (
                 <span className="text-zinc-700 animate-pulse text-sm">Waiting for input...</span>
               )}
             </div>

             <div className="flex justify-between items-center mt-4">
               <div className="text-[10px] text-zinc-600 font-mono">
                 ID: {Math.floor(Math.random() * 9999).toString().padStart(4, '0')} // MODE: {mode}
               </div>
               
               <button 
                 onClick={generate}
                 disabled={isGenerating}
                 className="flex items-center gap-2 px-6 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-all rounded-sm group shadow-lg"
               >
                 <RefreshCw size={12} className={`group-hover:rotate-180 transition-transform duration-500 ${isGenerating ? 'animate-spin text-orange-500' : ''}`} />
                 Reroll Sequence
               </button>
             </div>
         </div>
      </div>
    </div>
  );
};

// --- Navigation ---

const Navbar = ({ onViewChange, currentView }: { onViewChange: (view: 'home' | 'manifesto' | 'sidecap') => void, currentView: string }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800">
    <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => onViewChange('home')}
      >
        <div className="w-8 h-8 bg-white flex items-center justify-center group-hover:bg-orange-500 transition-colors">
          <Command size={16} className="text-black" strokeWidth={3} />
        </div>
        <span className="font-sans font-bold text-lg tracking-tighter text-white">JDI.SH</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <button
          onClick={() => onViewChange('sidecap')}
          className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentView === 'sidecap' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}
        >
          SideCap
        </button>
        <button
          onClick={() => onViewChange('manifesto')}
          className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentView === 'manifesto' ? 'text-orange-500' : 'text-zinc-500 hover:text-white'}`}
        >
          Manifesto
        </button>
        <div className="h-4 w-[1px] bg-zinc-800"></div>
        <a href="mailto:hello@jdi.sh" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest">Contact</span>
        </a>
      </div>
    </div>
  </nav>
);

// --- Home View Components ---

const Hero = ({ onViewChange }: { onViewChange: (view: 'manifesto') => void }) => (
  <section className="pt-40 pb-32 px-6 max-w-[1400px] mx-auto border-b border-zinc-800">
    <div className="max-w-4xl">
      <div className="inline-flex items-center gap-2 mb-8 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900/50">
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Software Holdings</span>
      </div>
      
      <h1 className="text-6xl md:text-9xl font-bold text-white mb-10 tracking-tighter leading-[0.85] font-sans">
        JUST DO IT.
      </h1>
      
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-light font-sans border-l-2 border-orange-500 pl-6">
          We build and ship cool software to improve life one thing at a time. 
          No bloat. No bureaucracy. Just shipping.
        </p>
        
        <button 
          onClick={() => onViewChange('manifesto')}
          className="group flex items-center gap-3 px-6 py-4 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-orange-500 hover:text-white transition-all"
        >
          Read The Protocol <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
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

const Holdings = ({ onViewChange }: { onViewChange: (view: 'sidecap') => void }) => (
  <section className="py-32 px-6 max-w-[1400px] mx-auto border-t border-zinc-800">
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
             <div className="flex gap-2 items-center justify-center h-20">
                {[35, 60, 45, 65, 40].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-3 bg-white rounded-full group-hover:animate-pulse transition-all duration-300" 
                    style={{ 
                        height: `${h}px`, 
                        animationDuration: `${0.6 + (i * 0.1)}s` 
                    }}
                  ></div>
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
           <Layers size={140} strokeWidth={0.5} className="text-zinc-600 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
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
           <Terminal size={140} strokeWidth={0.5} className="text-zinc-600 group-hover:-translate-y-2 transition-transform duration-500" />
        </div>
      </ProjectCard>

      {/* SideCap */}
      <div onClick={() => onViewChange('sidecap')} className="cursor-pointer">
        <ProjectCard
          title="SideCap"
          desc="Learn languages while watching YouTube. Click any word in captions to instantly see definitions, pronunciations, and translations—all without leaving your video."
          tags={['Consumer', 'Chrome Extension', 'Language Learning']}
          links={[]}
        >
          <div className="absolute right-[-20px] bottom-[-20px] p-6 opacity-40 group-hover:opacity-100 transition-opacity">
             <Languages size={140} strokeWidth={0.5} className="text-zinc-600 group-hover:rotate-6 transition-transform duration-500" />
          </div>
          <div className="absolute bottom-8 left-8">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-blue-400 transition-colors">
              Learn More <ArrowUpRight size={12} />
            </span>
          </div>
        </ProjectCard>
      </div>

    </div>
  </section>
);

const Footer = ({ onTriggerSecret }: { onTriggerSecret: () => void }) => (
  <footer className="border-t border-zinc-800 bg-[#050505] py-20">
    <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
      <div>
        <div className="flex items-center gap-3 mb-6">
          {/* Secret Trigger: The Footer Logo Icon */}
          <button 
            onClick={onTriggerSecret}
            className="w-6 h-6 bg-white flex items-center justify-center hover:bg-orange-500 transition-colors"
            title="Open Console"
          >
            <Command size={12} className="text-black" strokeWidth={3} />
          </button>
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

// --- Manifesto View ---

const Law = ({ number, title, content }: { number: string, title: string, content: string }) => (
  <div className="grid md:grid-cols-12 gap-6 py-12 border-b border-zinc-800">
     <div className="md:col-span-2 text-zinc-600 font-mono text-xs uppercase tracking-widest pt-2">
       LAW_{number}
     </div>
     <div className="md:col-span-10">
       <h3 className="text-3xl text-white font-sans font-bold mb-6 uppercase tracking-tight">{title}</h3>
       <p className="text-zinc-400 font-mono text-sm leading-7 max-w-2xl">{content}</p>
     </div>
  </div>
);

const ManifestoPage = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Header */}
        <div className="mb-24">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter font-sans">
            THE PROTOCOL
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-sans font-light leading-relaxed max-w-3xl border-l-2 border-white pl-8">
            Software has become bloated, slow, and overly bureaucratic. 
            We are returning to the fundamentals of craft, utility, and speed.
            Here is how we operate.
          </p>
        </div>

        {/* Laws */}
        <div className="border-t border-zinc-800">
          <Law 
            number="01" 
            title="Default to Action" 
            content="Analysis paralysis is the death of innovation. We do not spend weeks in meetings discussing hypothetical problems. We build the prototype. We ship the beta. We learn from reality, not from documentation."
          />
          <Law 
            number="02" 
            title="Subtraction over Addition" 
            content="Every feature adds weight. Every line of code adds liability. We strive to solve problems with the minimum viable surface area. Good software is defined by what it leaves out, not what it packs in."
          />
          <Law 
            number="03" 
            title="Craft is Marketing" 
            content="We do not rely on aggressive sales tactics or dark patterns. We believe that if you build something truly excellent—something that respects the user's intelligence and time—the growth will take care of itself."
          />
          <Law 
            number="04" 
            title="Speed is a Feature" 
            content="Slow software is disrespectful. We optimize for 60fps (or 120fps) interfaces, instant load times, and low latency. If it feels slow, it is broken."
          />
          <Law 
            number="05" 
            title="Build Levers" 
            content="We focus on building tools that give users leverage. Whether it's a developer library or a consumer productivity app, the goal is always the same: allow the human to do more with less effort."
          />
           <Law 
            number="06" 
            title="Compound Value" 
            content="We play long-term games. We build infrastructure that we can reuse across projects. We invest in distinct, ownable IP. We are not here for a quick flip; we are here to build a legacy of useful software."
          />
        </div>

        {/* Footer / Signature */}
        <div className="mt-24 pt-12 border-t border-zinc-800 flex justify-between items-end opacity-50 font-mono text-xs">
           <div>
             <div className="uppercase tracking-widest text-zinc-500 mb-2">Executed By</div>
             <div className="text-white">Just Do It Software Holdings</div>
           </div>
           <div className="text-right">
             <div className="uppercase tracking-widest text-zinc-500 mb-2">Timestamp</div>
             <div className="text-zinc-400">{date.toISOString()}</div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SideCap Landing Page ---

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg group hover:border-zinc-700 transition-colors">
    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
      <Icon size={20} className="text-blue-400" />
    </div>
    <h3 className="text-lg font-bold text-white font-sans mb-2">{title}</h3>
    <p className="text-zinc-500 text-sm font-mono leading-relaxed">{desc}</p>
  </div>
);

const SideCapPage = ({ onBack, onPrivacy }: { onBack: () => void, onPrivacy: () => void }) => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-12"
        >
          <ArrowRight size={14} className="rotate-180" /> Back to Holdings
        </button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <img src="/sidecap/icon.png" alt="SideCap" className="w-12 h-12 rounded-xl" />
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Chrome size={12} className="text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Chrome Extension</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter font-sans leading-[1.1]">
              Learn languages while watching YouTube
            </h1>

            <p className="text-xl text-zinc-400 font-sans font-light leading-relaxed mb-8">
              Turn any YouTube video into an interactive language lesson. Click words in captions to instantly see definitions, pronunciations, and translations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <a
                href="#"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-blue-500 text-white font-bold font-mono text-sm uppercase tracking-wider hover:bg-blue-400 transition-all rounded-lg"
              >
                <Chrome size={18} />
                Add to Chrome
                <span className="text-blue-200 text-xs font-normal">— Free</span>
              </a>
              <a
                href="#features"
                className="flex items-center justify-center gap-2 px-6 py-4 border border-zinc-700 text-zinc-300 font-bold font-mono text-sm uppercase tracking-wider hover:border-zinc-500 hover:text-white transition-all rounded-lg"
              >
                See How It Works
              </a>
            </div>
            <button
              onClick={onPrivacy}
              className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors"
            >
              Privacy Policy
            </button>
          </div>

          {/* Hero Screenshot */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-30 rounded-3xl"></div>
            <img
              src="/sidecap/hero.png"
              alt="SideCap in action"
              className="relative rounded-xl border border-zinc-800 shadow-2xl shadow-black/50"
            />
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-sans tracking-tight mb-4">
              Everything you need to learn while you watch
            </h2>
            <p className="text-zinc-500 font-mono text-sm max-w-xl mx-auto">
              SideCap enhances YouTube's native captions with powerful language learning tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={MousePointer}
              title="Click Any Word"
              desc="Simply click on any word in the captions to instantly see its definition, part of speech, and pronunciation."
            />
            <FeatureCard
              icon={Volume2}
              title="Hear Pronunciation"
              desc="Listen to words spoken aloud with the built-in text-to-speech feature. Perfect your accent as you learn."
            />
            <FeatureCard
              icon={Languages}
              title="Translations"
              desc="See translations in your native language to understand unfamiliar words in context."
            />
            <FeatureCard
              icon={Clock}
              title="Caption History"
              desc="Never miss a word. Scroll through timestamped caption history in the sidebar and jump to any moment."
            />
            <FeatureCard
              icon={Play}
              title="Video Sync"
              desc="Click the Video Sync button to jump back to exactly where a word was spoken in the video."
            />
            <FeatureCard
              icon={BookOpen}
              title="Learn in Context"
              desc="See example sentences and usage notes to understand how words are used naturally."
            />
          </div>
        </section>

        {/* Screenshot Showcase */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white font-sans tracking-tight mb-6">
                Instant Word Analysis
              </h2>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6">
                Click any word and get a clean popup with everything you need: definition, phonetic pronunciation, context, and a button to hear it spoken aloud.
              </p>
              <ul className="space-y-3">
                {[
                  'Phonetic transcription (IPA)',
                  'Clear, concise definitions',
                  'Example sentences in context',
                  'One-click audio pronunciation'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm font-mono">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-2xl opacity-50 rounded-3xl"></div>
              <img
                src="/sidecap/word-analysis.png"
                alt="Word Analysis Feature"
                className="relative rounded-xl border border-zinc-800 shadow-xl mx-auto"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 px-8 bg-gradient-to-b from-zinc-900/50 to-zinc-900/0 border border-zinc-800 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sans tracking-tight mb-4">
            Start learning today
          </h2>
          <p className="text-zinc-500 font-mono text-sm max-w-lg mx-auto mb-8">
            SideCap is free to use. Install it now and transform your YouTube watching into language learning time.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold font-mono text-sm uppercase tracking-wider hover:bg-zinc-200 transition-all rounded-lg"
          >
            <Chrome size={18} />
            Add to Chrome — It's Free
          </a>
        </section>

      </div>
    </div>
  );
};

// --- SideCap Privacy Policy Page ---

const SideCapPrivacyPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[800px] mx-auto px-6">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-12"
        >
          <ArrowRight size={14} className="rotate-180" /> Back to SideCap
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <img src="/sidecap/icon.png" alt="SideCap" className="w-10 h-10 rounded-lg" />
            <span className="text-zinc-500 font-mono text-sm">SideCap</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter font-sans">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-sm font-mono">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-zinc-400 font-mono text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Overview</h2>
            <p>
              SideCap is a browser extension that enhances YouTube captions with language learning features.
              We are committed to protecting your privacy and being transparent about our data practices.
            </p>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Data We Collect</h2>
            <p className="mb-4">
              <strong className="text-zinc-200">SideCap does not collect any personal data.</strong>
            </p>
            <p>
              The extension operates entirely on your device and does not transmit any personal information,
              browsing history, or viewing habits to external servers.
            </p>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Local Storage</h2>
            <p className="mb-4">
              SideCap uses Chrome's local storage API to save your preferences, such as:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
              <li>UI settings and display preferences</li>
              <li>Caption history within a viewing session</li>
            </ul>
            <p>
              This data is stored locally on your device and is never transmitted elsewhere.
              You can clear this data at any time by removing the extension or clearing your browser's storage.
            </p>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Permissions</h2>
            <p className="mb-4">The extension requests the following permissions:</p>
            <ul className="space-y-4 ml-2">
              <li>
                <span className="text-zinc-200 font-bold">Storage Permission</span>
                <p className="mt-1">Used to save your preferences locally on your device.</p>
              </li>
              <li>
                <span className="text-zinc-200 font-bold">YouTube Site Access</span>
                <p className="mt-1">
                  Required to inject the caption enhancement features on youtube.com and m.youtube.com.
                  The extension only runs on YouTube pages.
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Third-Party Services</h2>
            <p className="mb-4">
              SideCap uses dictionary APIs to fetch word definitions and pronunciations when you click on a word.
            </p>
            <p>
              These requests contain only the word being looked up—no personal information,
              browsing history, or context is shared with these services.
            </p>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Data Security</h2>
            <p>
              Since we don't collect personal data, there is no personal data to secure on our end.
              All user preferences are stored locally in your browser using Chrome's secure storage APIs.
            </p>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Children's Privacy</h2>
            <p>
              SideCap does not knowingly collect any personal information from children.
              The extension is designed for general audiences and contains no age-restricted content.
            </p>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page
              with an updated revision date. Continued use of the extension after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-white font-sans font-bold text-xl mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or SideCap's data practices,
              please contact us at{' '}
              <a href="mailto:hello@jdi.sh" className="text-blue-400 hover:text-blue-300 transition-colors">
                hello@jdi.sh
              </a>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-zinc-600 text-xs font-mono">
            © 2024 JDI.SH — SideCap Privacy Policy
          </p>
        </div>

      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'manifesto' | 'sidecap' | 'sidecap-privacy'>('home');
  const [showSecret, setShowSecret] = useState(false);

  const renderView = () => {
    switch (view) {
      case 'manifesto':
        return <ManifestoPage />;
      case 'sidecap':
        return <SideCapPage onBack={() => setView('home')} onPrivacy={() => setView('sidecap-privacy')} />;
      case 'sidecap-privacy':
        return <SideCapPrivacyPage onBack={() => setView('sidecap')} />;
      default:
        return (
          <>
            <Hero onViewChange={setView} />
            <Holdings onViewChange={setView} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-orange-500/30 selection:text-orange-200 font-mono relative pb-12">
      <Navbar onViewChange={setView} currentView={view} />
      {renderView()}
      <Footer onTriggerSecret={() => setShowSecret(true)} />
      {showSecret && <SecretTerminal onClose={() => setShowSecret(false)} />}
    </div>
  );
}