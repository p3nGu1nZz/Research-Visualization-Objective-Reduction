
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { HeroScene, HilbertSpaceScene } from './components/QuantumScene';
import { OperatorFamilyViz, IntegralSummationViz, CollapseThresholdChart } from './components/Diagrams';
import { ArrowDown, Menu, X, FileText, Sigma, Scale, Terminal, Cpu, Activity, ShieldCheck, Radio, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

// --- UI COMPONENTS ---

const ScanlineOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150 contrast-150"></div>
);

// Fixed: Made children optional to resolve type errors
const TechBorder = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`relative group ${className}`}>
    {/* Corner Accents */}
    <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-l-2 border-t-2 border-cyber-cyan transition-all duration-300 group-hover:w-full group-hover:h-full"></div>
    <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-r-2 border-b-2 border-cyber-cyan transition-all duration-300 group-hover:w-full group-hover:h-full"></div>
    <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-r-2 border-t-2 border-cyber-yellow/50"></div>
    <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-l-2 border-b-2 border-cyber-yellow/50"></div>
    
    {children}
  </div>
);

const MathTooltip = ({ children, tip }: { children?: React.ReactNode; tip: string }) => (
  <span className="relative group/tooltip cursor-help inline-block mx-1 align-baseline z-30">
    <span className="border-b border-cyber-cyan border-dashed text-cyber-cyan font-bold transition-all hover:bg-cyber-cyan hover:text-black px-1 rounded-sm shadow-[0_0_5px_rgba(0,240,255,0.2)] hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] whitespace-nowrap">
      {children}
    </span>
    <span className="invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[320px] p-0 pointer-events-none transform origin-bottom scale-95 group-hover/tooltip:scale-100 z-[100]">
       <div className="bg-cyber-black border border-cyber-cyan text-white text-base shadow-[0_0_30px_rgba(0,240,255,0.4)] relative z-[100]">
          <div className="bg-cyber-cyan/20 px-3 py-1 text-[10px] font-mono text-cyber-cyan border-b border-cyber-cyan/30 uppercase tracking-[0.2em] flex justify-between items-center">
            <span className="flex items-center gap-2"><Terminal size={10} /> DEF.01</span>
          </div>
          <div className="px-4 py-3 font-mono text-sm leading-relaxed text-gray-300 whitespace-normal">
            {tip}
          </div>
       </div>
       <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-cyber-cyan"></div>
    </span>
  </span>
);

const App: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const sections = ['hero', 'preliminaries', 'proposition', 'proof', 'corollary', 'footer'];

  // Use container ref for framer motion scroll linking
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 50);
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sections.indexOf(entry.target.id);
          if (index !== -1) setActiveSectionIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: container,
      threshold: 0.5
    });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigatePage = (direction: 'up' | 'down') => {
    const newIndex = direction === 'up' 
      ? Math.max(0, activeSectionIndex - 1) 
      : Math.min(sections.length - 1, activeSectionIndex + 1);
    
    scrollToSection(sections[newIndex]);
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="h-screen w-screen bg-cyber-black text-gray-200 selection:bg-cyber-cyan selection:text-black font-sans text-xl overflow-hidden relative">
      <ScanlineOverlay />
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-cyber-cyan z-[100] origin-left shadow-[0_0_20px_#00f0ff]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation Controls */}
      <div className="fixed bottom-8 right-8 z-[50] flex flex-col gap-3">
        <button 
          onClick={() => navigatePage('up')}
          disabled={activeSectionIndex === 0}
          className="p-3 bg-cyber-dark/80 backdrop-blur border border-cyber-cyan/50 text-cyber-cyan rounded-full hover:bg-cyber-cyan hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          onClick={() => navigatePage('down')}
          disabled={activeSectionIndex === sections.length - 1}
          className="p-3 bg-cyber-dark/80 backdrop-blur border border-cyber-cyan/50 text-cyber-cyan rounded-full hover:bg-cyber-cyan hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'bg-cyber-black/90 backdrop-blur-xl border-cyber-gray shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2' : 'bg-transparent border-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="relative">
                <div className="w-10 h-10 bg-cyber-dark border border-cyber-yellow text-cyber-yellow flex items-center justify-center font-mono font-bold text-xl shadow-[0_0_15px_rgba(252,238,10,0.2)] group-hover:bg-cyber-yellow group-hover:text-black transition-all duration-300 z-10 relative">Ψ</div>
                <div className="absolute inset-0 bg-cyber-yellow blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-xl tracking-widest text-white leading-none cyber-glitch-text" data-text="RAWSON">
                  RAWSON
                </span>
                <span className="text-[10px] font-mono text-cyber-cyan tracking-[0.5em] uppercase pl-1 pt-1 opacity-70 group-hover:opacity-100 transition-opacity"> Protocol 2025</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-[0.2em]">
            {['Preliminaries', 'Proposition', 'Proof', 'Corollary'].map((item) => (
                <button 
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())} 
                    className="relative text-gray-400 hover:text-cyber-cyan transition-colors cursor-pointer uppercase py-1 group overflow-hidden"
                >
                    <span className="relative z-10">{item}</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyber-cyan transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                </button>
            ))}
            <a 
              href="https://doi.org/10.5281/zenodo.17791309" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-5 py-2 bg-cyber-dark border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] cursor-pointer flex items-center gap-2 font-bold group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <FileText size={12} /> <span className="relative z-10">FILE</span>
            </a>
          </div>

          <button className="lg:hidden text-cyber-cyan p-2 border border-cyber-cyan bg-cyber-dark/50 hover:bg-cyber-cyan hover:text-black transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cyber-black/98 backdrop-blur-xl flex flex-col items-center justify-center gap-12 font-mono text-2xl animate-fade-in border-l-4 border-cyber-yellow">
            {['Preliminaries', 'Proposition', 'Proof', 'Corollary'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-cyber-cyan hover:text-cyber-yellow uppercase tracking-widest">{item}</button>
            ))}
        </div>
      )}

      {/* Main Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth relative"
      >
        
        {/* Hero Section */}
        <header id="hero" className="relative h-screen w-full snap-start flex flex-col justify-center items-center overflow-hidden border-b border-cyber-gray bg-cyber-black pt-16">
          <div className="absolute inset-0 z-0">
               <HeroScene />
          </div>
          
          {/* Gradient/Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-cyber-black/80 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] z-0 pointer-events-none"></div>

          <motion.div 
              style={{ opacity, scale }}
              className="relative z-10 container mx-auto px-6 text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-6 px-4 py-1 border border-cyber-yellow/30 text-cyber-yellow font-mono text-xs tracking-[0.4em] uppercase bg-cyber-yellow/5 backdrop-blur-md"
            >
              <span className="w-2 h-2 bg-cyber-yellow animate-pulse"></span>
              System Date: Dec 2025
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-bold leading-none mb-8 text-white tracking-tighter mix-blend-difference"
            >
              <span className="cyber-glitch-text block" data-text="OBJECTIVE">OBJECTIVE</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white cyber-glitch-text block mt-2" data-text="REDUCTION">REDUCTION</span>
            </motion.h1>

            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.6 }}
               className="max-w-3xl mx-auto mb-16 space-y-4"
            >
               <p className="text-xl md:text-2xl text-cyber-cyan/80 font-light leading-relaxed font-mono">
                 > INITIALIZING OPERATOR ANNIHILATION SEQUENCE...
               </p>
               <p className="text-lg md:text-xl text-gray-400 font-light">
                 Unified proposition: Integration on timescale <MathTooltip tip="Characteristic Time Threshold (τc): The critical duration for state reduction.">τ<sub>c</sub></MathTooltip> forces state <MathTooltip tip="Quantum State Vector (|Ψ⟩): A mathematical entity describing the state of a quantum system.">|Ψ⟩</MathTooltip> collapse.
               </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex justify-center"
            >
               <button onClick={() => scrollToSection('preliminaries')} className="group flex flex-col items-center gap-3 text-xs font-mono text-cyber-cyan hover:text-white transition-colors cursor-pointer">
                  <span className="tracking-[0.3em] group-hover:text-cyber-yellow transition-colors">INITIATE_PROOF</span>
                  <span className="p-3 border border-cyber-cyan/50 rounded-full group-hover:bg-cyber-cyan group-hover:text-black transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]">
                      <ArrowDown size={20} />
                  </span>
               </button>
            </motion.div>
          </motion.div>
        </header>

        {/* Section 1: Preliminaries */}
        <section id="preliminaries" className="h-screen w-full snap-start flex flex-col justify-center border-b border-cyber-gray bg-cyber-black relative overflow-hidden pt-16">
          {/* Background Tech Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full border-l border-cyber-gray/30 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:4px_4px]"></div>
          
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center h-full">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-2 h-2 bg-cyber-yellow rounded-none rotate-45 animate-pulse"></div>
                 <div className="text-xs font-mono text-cyber-yellow tracking-[0.3em] uppercase">Phase 01: Data Input</div>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight tracking-tight">Preliminaries</h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
                Let <MathTooltip tip="Separable Hilbert Space (H): Infinite-dimensional inner product space where quantum states live.">H</MathTooltip> be a separable Hilbert space and <MathTooltip tip="Quantum State Vector Element (|Ψ⟩ ∈ H): Denotes that the state belongs to the Hilbert space H.">|Ψ⟩ ∈ H</MathTooltip> with <MathTooltip tip="Normalization Condition (⟨Ψ|Ψ⟩): The probability of finding the system in some state is 1.">⟨Ψ|Ψ⟩ = 1</MathTooltip>.
              </p>
              
              <TechBorder className="p-6 bg-cyber-dark border border-cyber-gray/50 shadow-2xl">
                <p className="mb-4 text-cyber-purple font-bold uppercase tracking-[0.2em] text-[10px] border-b border-cyber-gray pb-2 flex justify-between">
                    <span>Defined Operators</span>
                    <span>Interval [a, b]</span>
                </p>
                <ul className="space-y-4 text-base font-mono text-gray-400">
                  <li className="flex items-center gap-4 group hover:text-white transition-colors cursor-default">
                      <span className="text-cyber-cyan opacity-50 group-hover:opacity-100">01</span> 
                      <span><span className="text-cyber-yellow font-bold"><MathTooltip tip="Dynamical Generator (Ê(α)): Evolution operator defined by the system's Hamiltonian.">Ê(α)</MathTooltip></span> : Dynamical Generator</span>
                  </li>
                  <li className="flex items-center gap-4 group hover:text-white transition-colors cursor-default">
                      <span className="text-cyber-cyan opacity-50 group-hover:opacity-100">02</span> 
                      <span><span className="text-cyber-yellow font-bold"><MathTooltip tip="Vacuum Correction (Ĉ(α)): Operator accounting for vacuum energy fluctuations.">Ĉ(α)</MathTooltip></span> : Vacuum Correction</span>
                  </li>
                  <li className="flex items-center gap-4 group hover:text-white transition-colors cursor-default">
                      <span className="text-cyber-cyan opacity-50 group-hover:opacity-100">03</span> 
                      <span><span className="text-cyber-yellow font-bold"><MathTooltip tip="Chiral Correction (Ĉχ(α)): Asymmetry term in the operator expansion.">Ĉ<sub>χ</sub>(α)</MathTooltip></span> : Chiral Correction</span>
                  </li>
                  <li className="flex items-center gap-4 group hover:text-white transition-colors cursor-default">
                      <span className="text-cyber-cyan opacity-50 group-hover:opacity-100">04</span> 
                      <span><span className="text-cyber-yellow font-bold"><MathTooltip tip="Gravitational Self-Energy Operator (Ĝ(α)): Represents the gravitational influence on the superposition.">Ĝ(α)</MathTooltip></span> : Gravitational Self-energy</span>
                  </li>
                </ul>
              </TechBorder>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 flex justify-center items-center"
            >
               <div className="relative group w-full max-w-xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-purple rounded-xl opacity-30 group-hover:opacity-60 blur-lg transition-opacity duration-700"></div>
                  <div className="relative bg-cyber-black rounded-xl border border-cyber-cyan/30 p-8 backdrop-blur-sm">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-red animate-ping"></div>
                        <div className="w-2 h-2 rounded-full bg-cyber-red"></div>
                      </div>
                      <OperatorFamilyViz />
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Unified Proposition */}
        <section id="proposition" className="h-screen w-full snap-start flex flex-col justify-center bg-cyber-dark relative overflow-hidden pt-16">
             {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyber-black to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyber-black to-transparent z-10"></div>

            <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                  className="text-center mb-8 flex-shrink-0"
                >
                     <div className="inline-flex items-center gap-2 px-4 py-1 border border-cyber-cyan text-cyber-cyan text-[10px] font-mono font-bold tracking-[0.4em] uppercase mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)] bg-cyber-black">
                        <Sigma size={12} /> Theory Core
                     </div>
                     <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white tracking-tighter">Unified Proposition</h2>
                     <p className="text-2xl text-cyber-cyan font-light font-sans italic max-w-4xl mx-auto leading-normal">
                       "Objective Reduction by Operator Annihilation"
                     </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">
                     <motion.div
                       initial={{ opacity: 0, x: -30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.6 }}
                       className="flex flex-col justify-center"
                     >
                        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-cyber-cyan text-4xl">#</span> Total Operator & Integral
                        </h3>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
                            Defining the Total Operator <span className="font-mono text-cyber-yellow font-normal"><MathTooltip tip="Total Operator: T̂(α) = Ê(α) + Ĉ(α) + Ĉχ(α) + Ĝ(α)">T̂(α)</MathTooltip></span>. The reduction mechanism is executed by the integral over partition <span className="font-mono text-cyber-cyan font-normal"><MathTooltip tip="Partition Set ({αₖ}): A discrete division of the continuous parameter space for summation.">{`{αₖ}`}</MathTooltip></span>.
                        </p>
                        
                        <div className="space-y-6">
                            <TechBorder className="bg-cyber-black/50 p-6 border border-gray-800 backdrop-blur-md">
                                <div className="text-gray-500 text-[10px] mb-4 uppercase tracking-wider flex justify-between font-mono">
                                    <span>Definition_5.6</span>
                                    <span className="text-cyber-yellow">EXEC_MODE: CONTINUOUS</span>
                                </div>
                                <div className="mb-4 text-white text-lg font-mono"><MathTooltip tip="Total Operator Definition (T̂(α)): Sum of dynamical, vacuum, chiral, and gravitational operators.">T̂(α)</MathTooltip> := Ê(α) + Ĉ(α) + Ĉ<sub>χ</sub>(α) + Ĝ(α)</div>
                                <div className="flex items-center gap-4 text-cyber-yellow text-lg font-mono">
                                  <span><MathTooltip tip="Operator Integral (∫ T̂(α)dα): The continuous limit of the sum of operators.">∫ T̂(α)dα</MathTooltip> := </span>
                                  <div className="flex flex-col items-center justify-center leading-none text-[10px] text-gray-500">
                                    <span>LIM</span>
                                    <span>n→∞</span>
                                  </div>
                                  <span><MathTooltip tip="Riemann Sum (Σ T̂(αₖ) Δα): Discrete approximation of the operator integral.">Σ T̂(αₖ) Δα</MathTooltip></span>
                                </div>
                            </TechBorder>
                            
                            <div className="p-6 border-l-4 border-cyber-purple bg-gradient-to-r from-cyber-purple/10 to-transparent">
                                <h4 className="text-cyber-purple font-bold mb-2 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                                    <ShieldCheck size={16}/> Hypothesis (A1): Annihilation
                                </h4>
                                <p className="font-mono text-xl text-white">
                                   lim<sub>n→∞</sub> || <MathTooltip tip="Annihilation Action (Σ T̂(αₖ)Δα |Ψ⟩): The integrated operator acts on the state |Ψ⟩, driving its norm to zero.">Σ T̂(αₖ)Δα |Ψ⟩</MathTooltip> || = 0
                                </p>
                            </div>
                        </div>
                     </motion.div>
                     
                     <motion.div
                       initial={{ opacity: 0, scale: 0.95 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.6, delay: 0.2 }}
                       className="relative flex justify-center items-center"
                     >
                        <div className="absolute -inset-10 bg-cyber-cyan/10 blur-3xl rounded-full"></div>
                        <IntegralSummationViz />
                     </motion.div>
                </div>
            </div>
        </section>

        {/* Section 3: The Proof (Overhauled Design) */}
        <section id="proof" className="h-screen w-full snap-start flex flex-col justify-center bg-cyber-black relative border-t border-cyber-gray overflow-hidden pt-16">
             {/* Background Circuitry */}
             <div className="absolute inset-0 pointer-events-none opacity-20">
                 <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-cyber-gray"></div>
                 <div className="absolute left-[50%] top-1/4 w-full h-[1px] bg-cyber-gray"></div>
                 <div className="absolute left-[50%] top-3/4 w-full h-[1px] bg-cyber-gray"></div>
             </div>

             <div className="container mx-auto px-6 relative z-10 flex flex-col h-full justify-center">
                <motion.div 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={sectionVariants}
                      className="text-center mb-8 flex-shrink-0"
                >
                     <div className="text-cyber-yellow font-mono text-xs tracking-[0.5em] uppercase mb-2 flex justify-center items-center gap-3">
                        <Radio size={14} className="animate-pulse" /> System Diagnostic
                     </div>
                     <h2 className="text-5xl font-bold text-white mb-2 tracking-tight">Proof of Execution</h2>
                     <p className="text-lg text-gray-500 max-w-2xl mx-auto">Stepwise verification of the annihilation protocol.</p>
                </motion.div>

                {/* Grid Layout for Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-8 flex-grow content-center">
                    {[
                        { 
                            step: "01", 
                            title: "INIT_PARTIAL_SUM", 
                            code: <>Ŝₙ := <MathTooltip tip="Discrete Sum Operator (Σ T̂(αₖ)Δα): Discrete sum operator over the partition.">Σ T̂(αₖ)Δα</MathTooltip></>,
                            desc: "Define discrete sum operator."
                        },
                        { 
                            step: "02", 
                            title: "CHECK_BOUNDS", 
                            code: <>||<MathTooltip tip="Total Operator (T̂(α)): Norm of the total operator.">T̂(α)</MathTooltip>|| ≤ M</>,
                            desc: "Verify uniform boundedness."
                        },
                        { 
                            step: "03", 
                            title: "CONVERGENCE_SOT", 
                            code: <>Ŝₙ → <MathTooltip tip="Integrated Operator (∫ T̂(α)dα): Convergence to the continuous integral.">∫ T̂(α)dα</MathTooltip></>,
                            desc: "Confirm strong topology convergence."
                        },
                        { 
                            step: "04", 
                            title: "ANNIHILATION_OP", 
                            code: <>lim Ŝₙ<MathTooltip tip="State Vector (|Ψ⟩): Application of the limit operator to the state vector.">|Ψ⟩</MathTooltip> = 0</>,
                            desc: "Apply hypothesis (A1). State nullified."
                        },
                        { 
                            step: "05", 
                            title: "UNIQUE_LIMIT", 
                            code: <><MathTooltip tip="Annihilation Action (∫ T̂(α)dα |Ψ⟩): The integral operator annihilates the state.">∫ T̂(α)dα |Ψ⟩</MathTooltip> = 0</>,
                            desc: "Uniqueness in Hilbert Space confirmed."
                        },
                        { 
                            step: "06", 
                            title: "CALC_THRESHOLD", 
                            code: <>τ_OR ∼ ℏ / <MathTooltip tip="Gravitational Self-Energy (G[Ψ]): Energy uncertainty from superposed spacetimes.">G[Ψ]</MathTooltip></>,
                            desc: "Derive collapse timescale."
                        }
                    ].map((s, i) => (
                         <motion.div 
                            key={s.step} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="relative h-full"
                         >
                             <TechBorder className="h-full bg-cyber-dark/80 backdrop-blur-md p-4 border border-gray-800 hover:border-cyber-cyan transition-colors duration-300 w-full hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] flex flex-col">
                                 <div className="font-mono text-2xl font-bold text-cyber-cyan/20 mb-1">{s.step}</div>
                                 <h4 className="font-mono text-cyber-yellow text-sm tracking-wider mb-2">{s.title}</h4>
                                 
                                 <div className="bg-black/80 p-2 rounded border-l-2 border-cyber-cyan font-mono text-xs text-cyber-cyan mb-2 w-full shadow-inner truncate">
                                    <span className="text-gray-600 mr-2">$</span>{s.code}
                                 </div>
                                 <p className="text-gray-400 text-xs mt-auto leading-tight">{s.desc}</p>
                             </TechBorder>
                         </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-1 bg-gradient-to-r from-cyber-yellow via-cyber-red to-cyber-yellow rounded-xl max-w-2xl mx-auto shadow-[0_0_50px_rgba(252,238,10,0.15)] w-full flex-shrink-0"
                >
                    <div className="bg-cyber-black rounded-lg p-6 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="relative z-10">
                            <div className="text-cyber-red font-bold text-[10px] uppercase tracking-[0.4em] mb-3 flex justify-center items-center gap-2">
                                <Terminal size={14} /> Final Output
                            </div>
                            <div className="font-mono text-3xl md:text-4xl text-white mb-2">
                               <MathTooltip tip="Objective Reduction Timescale (τOR): The expected time until state collapse.">τ<sub>OR</sub></MathTooltip> ≤ <MathTooltip tip="Characteristic Time Threshold (τc): Maximum stable superposition duration.">τ<sub>c</sub></MathTooltip>
                            </div>
                            <div className="text-gray-500 font-mono text-sm mt-1">> Operation Successful. System Stable.</div>
                        </div>
                    </div>
                </motion.div>
             </div>
        </section>

        {/* Section 4: Corollary & Threshold */}
        <section id="corollary" className="h-screen w-full snap-start flex flex-col justify-center bg-cyber-dark relative pt-16">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center h-full">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="lg:col-span-6 relative h-[45vh] w-full bg-cyber-black rounded-3xl overflow-hidden border border-cyber-gray shadow-2xl group"
                >
                    <div className="absolute inset-0 bg-cyber-cyan/5 z-0"></div>
                    <div className="relative z-10 w-full h-full">
                        <HilbertSpaceScene />
                    </div>
                    
                    {/* HUD Overlay */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                         <div className="flex flex-col">
                             <span className="text-cyber-cyan font-mono text-[10px] tracking-widest border-l-2 border-cyber-cyan pl-2">SECTOR: HILBERT</span>
                             <span className="text-cyber-cyan/50 font-mono text-[8px] pl-2">COORDS: 44.22.91</span>
                         </div>
                         <Activity className="text-cyber-red animate-pulse" />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 p-3 border border-cyber-cyan/30 bg-cyber-black/80 backdrop-blur-md rounded-lg font-mono text-[10px] text-cyber-cyan flex justify-between items-center z-20">
                        <span>VIEW: HILBERT_SPACE_VISUALIZER</span>
                        <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE FEED</span>
                    </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="lg:col-span-6 flex flex-col justify-center"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Cpu className="text-cyber-red" size={24} />
                        <span className="text-cyber-red font-mono font-bold tracking-[0.2em] text-sm uppercase border-b border-cyber-red pb-1">Threshold Warning</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Resonance Amplification</h2>
                    <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
                        Detecting conditions where vacuum correction <span className="font-mono text-cyber-cyan"><MathTooltip tip="Vacuum Correction Operator (Ĉ(α)): Operator responsible for vacuum energy corrections.">Ĉ(α)</MathTooltip></span> triggers resonance amplification <span className="font-mono text-cyber-yellow"><MathTooltip tip="Vacuum Energy Fluctuation (δEvac(α)): Local variation in vacuum energy density contributing to instability.">δE<sub>vac</sub>(α)</MathTooltip></span>. Collapse probability increased.
                    </p>
                    
                    <CollapseThresholdChart />

                    <div className="mt-8 p-6 border border-cyber-cyan/20 bg-gradient-to-br from-cyber-cyan/5 to-transparent rounded-2xl relative overflow-hidden group hover:border-cyber-cyan/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Scale size={80} className="text-cyber-cyan"/>
                        </div>
                        <p className="font-mono text-lg text-white relative z-10 italic border-l-4 border-cyber-cyan pl-6 py-1">
                            "The annihilation of <span className="not-italic text-cyber-cyan font-bold"><MathTooltip tip="Quantum State Vector (|Ψ⟩): The physical state being acted upon.">|Ψ⟩</MathTooltip></span> by the integrated operator... constitutes objective reduction."
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-xs font-mono text-gray-500 relative z-10">
                             <div className="w-8 h-[1px] bg-cyber-cyan"></div>
                             <span className="uppercase tracking-wider">K. Rawson, 2025</span>
                             <span className="text-cyber-yellow ml-auto font-bold tracking-widest">QED CONFIRMED ■</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Footer */}
        <footer id="footer" className="h-screen w-full snap-start flex flex-col justify-center items-center py-20 bg-cyber-black border-t border-cyber-gray relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50"></div>
            
            <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 bg-cyber-dark rounded-full flex items-center justify-center text-cyber-yellow font-mono font-bold text-3xl mb-8 border border-cyber-yellow shadow-[0_0_30px_rgba(252,238,10,0.15)]">KR</div>
                <h3 className="text-3xl font-bold text-white mb-2 tracking-wide">Kara Rawson</h3>
                <p className="text-sm font-mono uppercase tracking-[0.4em] text-cyber-cyan mb-10">Research Division</p>
                
                <p className="max-w-xl text-gray-500 text-base mb-10 leading-relaxed font-mono">
                    > Published Dec 2025<br/>
                    > Interactive Proof Visualization<br/>
                    > Access Level: Public
                </p>

                <a 
                  href="https://doi.org/10.5281/zenodo.17791309"
                  className="text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all text-xs font-mono border border-gray-800 hover:border-cyber-cyan px-6 py-3 rounded-sm uppercase tracking-[0.2em]"
                >
                  DOI: 10.5281/zenodo.17791309
                </a>
            </div>
            
            {/* Footer Background Elements */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-cyber-cyan/5 to-transparent pointer-events-none"></div>
        </footer>
      </div>
    </div>
  );
};

export default App;
