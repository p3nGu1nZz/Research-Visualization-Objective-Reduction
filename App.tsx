
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Play, Github, Mail, User } from 'lucide-react';
import { HeroScene } from './components/QuantumScene';
import {
  OperatorFamilyViz,
  IntegralSummationViz,
  CollapseThresholdChart,
  MathTooltip
} from './components/Diagrams';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  // Sections: 0: Hero, 1: Preliminaries, 2: Proposition, 3: Proof, 4: Corollary, 5: Thank You
  const totalSections = 6;
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  if (sectionRefs.current.length === 0) {
      sectionRefs.current = new Array(totalSections).fill(null);
  }

  const scrollToSection = (index: number) => {
    if (index >= 0 && index < totalSections) {
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-cyber-black min-h-screen w-full text-gray-200 font-sans selection:bg-cyber-cyan/30 overflow-y-auto overflow-x-hidden relative perspective-1000 scroll-smooth">
        <div className="fixed inset-0 z-0 pointer-events-none">
            <HeroScene />
        </div>

        {/* Floating Navigation Controls */}
        <div className="fixed right-2 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 items-center pointer-events-none hidden sm:flex">
            <button 
                onClick={() => scrollToSection(activeSection - 1)}
                disabled={activeSection === 0}
                className={`pointer-events-auto p-3 rounded-full border border-cyber-cyan/50 backdrop-blur-md transition-all duration-300 ${activeSection === 0 ? 'opacity-0 translate-x-10' : 'opacity-100 hover:bg-cyber-cyan/20'}`}
                aria-label="Previous"
            >
                <ChevronUp className="text-cyber-cyan" size={24} />
            </button>

            <div className="flex flex-col gap-3 py-4 pointer-events-auto">
                {Array.from({ length: totalSections }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollToSection(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === idx ? 'bg-cyber-cyan h-6 shadow-[0_0_10px_#00f0ff]' : 'bg-gray-700 hover:bg-gray-500'}`}
                        aria-label={`Section ${idx}`}
                    />
                ))}
            </div>

            <button 
                onClick={() => scrollToSection(activeSection + 1)}
                disabled={activeSection === totalSections - 1}
                className={`pointer-events-auto p-3 rounded-full border border-cyber-cyan/50 backdrop-blur-md transition-all duration-300 ${activeSection === totalSections - 1 ? 'opacity-0 translate-x-10' : 'opacity-100 hover:bg-cyber-cyan/20'}`}
                aria-label="Next"
            >
                <ChevronDown className="text-cyber-cyan" size={24} />
            </button>
        </div>

        <div className="relative z-10 w-full flex flex-col">
            {/* SECTION 0: Hero */}
            <section 
                ref={el => { sectionRefs.current[0] = el; }}
                className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center relative gap-12 sm:gap-16 snap-start"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="space-y-6 max-w-4xl"
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        OR_THEORY
                    </h1>
                    <div className="inline-block border-t border-b border-cyber-cyan/30 py-4 px-8 backdrop-blur-sm bg-black/20">
                        <p className="text-cyber-cyan tracking-[0.3em] font-mono text-sm md:text-base lg:text-lg">
                            QUANTUM STATE REDUCTION
                        </p>
                    </div>
                </motion.div>
                
                <motion.button 
                   onClick={() => scrollToSection(1)}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   transition={{ delay: 1.2, duration: 0.8 }}
                   className="group relative px-8 py-4 bg-cyber-black/40 backdrop-blur-md border border-cyber-cyan text-cyber-cyan font-mono tracking-[0.2em] text-sm md:text-base uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:border-cyber-cyan hover:text-white"
                >
                   <span className="relative z-10 flex items-center gap-3 font-bold">
                       Initiate Sequence <Play size={14} className="fill-current" />
                   </span>
                   <div className="absolute inset-0 bg-cyber-cyan/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </motion.button>
            </section>

            {/* SECTION 1: PRELIMINARIES */}
            <section 
                ref={el => { sectionRefs.current[1] = el; }} 
                className="min-h-screen flex items-center justify-center py-20 px-4 md:px-12 scroll-mt-0"
            >
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="max-w-7xl w-full lg:flex lg:gap-16 items-center"
                >
                    <div className="lg:w-1/2 space-y-6 bg-black/85 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-gray-800 mb-8 lg:mb-0 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50"></div>
                        <span className="text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase">SECTION 1.0</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white cyber-glitch-text" data-text="PRELIMINARIES">PRELIMINARIES</h2>
                        <div className="w-12 h-1 bg-cyber-cyan/50 rounded-full"></div>
                        <p className="text-gray-300 leading-relaxed">
                            Consider a quantum system defined within a Hilbert space <MathTooltip tip="A complete vector space with an inner product, providing the framework for quantum mechanics." title="DEF: HILBERT SPACE">H</MathTooltip>. 
                            The system is described by a state vector <MathTooltip tip="The mathematical representation of a quantum system's state." title="DEF: PSI">|Ψ⟩</MathTooltip>, 
                            which encodes all probabilities.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Unlike classical bits, <MathTooltip tip="The mathematical representation of a quantum system's state." title="DEF: PSI">|Ψ⟩</MathTooltip> exists as a coherent superposition of basis states until observed.
                            We introduce a family of operators that modify this state over time.
                        </p>
                        <div className="mt-4 p-4 bg-cyber-dark/50 rounded border-l-2 border-cyber-yellow">
                            <code className="font-mono text-cyber-yellow text-sm block">
                                Operator Family: {'{'} E, C, X, G {'}'} <br/>
                                Normalization: <MathTooltip tip="The inner product of the state with itself, representing total probability = 1." title="DEF: NORMALIZATION">⟨Ψ|Ψ⟩</MathTooltip> = 1
                            </code>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <OperatorFamilyViz />
                    </div>
                </motion.div>
            </section>

            {/* SECTION 2: PROPOSITION */}
            <section 
                ref={el => { sectionRefs.current[2] = el; }} 
                className="min-h-screen flex items-center justify-center py-20 px-4 md:px-12 scroll-mt-0"
            >
                 <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="max-w-7xl w-full lg:flex lg:flex-row-reverse lg:gap-16 items-center"
                >
                    <div className="lg:w-1/2 space-y-6 bg-black/85 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-gray-800 mb-8 lg:mb-0 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50"></div>
                        <span className="text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase">SECTION 2.0</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white cyber-glitch-text" data-text="PROPOSITION">PROPOSITION</h2>
                        <div className="w-12 h-1 bg-cyber-cyan/50 rounded-full"></div>
                        <p className="text-gray-300 leading-relaxed">
                            We define the time-evolution operator <MathTooltip tip="A unitary operator describing how the quantum state evolves over a parameter α." title="DEF: EVOLUTION">T̂(α)</MathTooltip>. 
                            To evaluate the system's history, we must compute the path integral summation <MathTooltip tip="The summation of all possible histories or paths weighted by their amplitude." title="DEF: INTEGRAL">∫ T̂(α)dα</MathTooltip>.
                        </p>
                         <p className="text-gray-300 leading-relaxed">
                            The discrete approximation <MathTooltip tip="Riemann sum approximation of the continuous path integral." title="DEF: SUMMATION">Σ T̂(αk)Δα |Ψ⟩</MathTooltip> reveals
                            constructive and destructive interference patterns that filter potential realities.
                        </p>
                        <div className="mt-4 p-4 bg-cyber-dark/50 rounded border-l-2 border-cyber-cyan">
                            <code className="font-mono text-cyber-cyan text-sm block">
                               Let <MathTooltip tip="Energy difference of vacuum fluctuations." title="DEF: VACUUM ENERGY">δEvac(α)</MathTooltip> → 0 <br/>
                               Limit <MathTooltip tip="Integral of energy fluctuations over the parameter domain." title="DEF: INTEGRAL LIMIT">∫ δEvac(α)dα</MathTooltip> is finite.
                            </code>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <IntegralSummationViz />
                    </div>
                </motion.div>
            </section>

            {/* SECTION 3: PROOF */}
            <section 
                ref={el => { sectionRefs.current[3] = el; }} 
                className="min-h-screen flex items-center justify-center py-20 px-4 md:px-12 scroll-mt-0"
            >
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="max-w-7xl w-full lg:flex lg:gap-16 items-center"
                >
                    <div className="lg:w-1/2 space-y-6 bg-black/85 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-gray-800 mb-8 lg:mb-0 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-50"></div>
                         <span className="text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase">SECTION 3.0</span>
                         <h2 className="text-3xl md:text-4xl font-bold text-white cyber-glitch-text" data-text="PROOF">PROOF</h2>
                         <div className="w-12 h-1 bg-cyber-cyan/50 rounded-full"></div>
                         <p className="text-gray-300 leading-relaxed">
                             The superposition persists only so long as the gravitational self-energy <MathTooltip tip="The energy cost associated with the superposition of different spacetime geometries." title="DEF: SELF ENERGY">G[Ψ]</MathTooltip> remains below the critical threshold.
                         </p>
                         <p className="text-gray-300 leading-relaxed">
                             According to the indeterminacy principle, this energy uncertainty corresponds to a characteristic reduction time <MathTooltip tip="The predicted time until the superposition spontaneously collapses." title="DEF: CRITICAL TIME">τc</MathTooltip>.
                             If the separation persists for <MathTooltip tip="The timescale of Objective Reduction." title="DEF: TIME OR">τOR</MathTooltip> ≈ ℏ / <MathTooltip tip="Gravitational Self-Energy." title="DEF: GRAVITY">G[Ψ]</MathTooltip>, the state must collapse.
                         </p>
                    </div>
                    <div className="lg:w-1/2">
                        <CollapseThresholdChart />
                    </div>
                </motion.div>
            </section>

            {/* SECTION 4: COROLLARY */}
            <section 
                ref={el => { sectionRefs.current[4] = el; }} 
                className="min-h-screen flex items-center justify-center py-20 px-4 md:px-12 scroll-mt-0"
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full max-w-4xl mx-auto space-y-12"
                >
                     <div className="text-center space-y-6">
                         <span className="text-cyber-cyan font-mono text-xs tracking-[0.3em] uppercase">SECTION 4.0</span>
                         <h2 className="text-3xl md:text-5xl font-bold text-white cyber-glitch-text" data-text="COROLLARY">COROLLARY</h2>
                         <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            The condition for objective reduction is satisfied when the timescale of coherence violation meets the Heisenberg limit, enforcing a singular spacetime geometry.
                         </p>
                     </div>

                     <div className="p-1 bg-gradient-to-r from-cyber-yellow via-cyber-red to-cyber-yellow rounded-xl shadow-[0_0_50px_rgba(252,238,10,0.15)] relative z-20">
                        <div className="bg-black/90 backdrop-blur-xl rounded-lg p-8 md:p-12 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="text-cyber-red font-bold text-xs uppercase tracking-[0.4em] flex justify-center items-center gap-2">
                                    <Terminal size={14} /> Final Derivation
                                </div>
                                <div className="font-mono text-3xl md:text-5xl text-white flex flex-col md:flex-row items-center justify-center gap-6">
                                   <span><MathTooltip tip="Objective Reduction Timescale." title="DEF: TIMESCALE">τOR</MathTooltip></span>
                                   <span className="text-cyber-gray">≤</span>
                                   <span><MathTooltip tip="Heisenberg Characteristic Time Limit." title="DEF: LIMIT">τc</MathTooltip></span>
                                </div>
                                
                                {/* Conclusion Panel */}
                                <div className="mt-8 pt-8 border-t border-gray-800/50">
                                    <h4 className="text-cyber-cyan font-mono text-sm tracking-widest mb-4">CONCLUSION</h4>
                                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                                        The collapse of the wave function is not a random artifact of measurement but an objective physical process driven by gravitational instability in the superposition of spacetime geometries. This derivation provides a falsifiable prediction for the reduction timescale based on mass distribution.
                                    </p>
                                </div>
                                
                                <div className="text-gray-600 font-mono text-xs mt-6">
                                    {`> Q.E.D. System State Reduced.`}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

             {/* SECTION 5: THANK YOU */}
            <section 
                ref={el => { sectionRefs.current[5] = el; }} 
                className="min-h-screen flex items-center justify-center py-20 px-4 md:px-12 scroll-mt-0"
            >
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-md w-full"
                >
                    <div className="bg-black/85 backdrop-blur-xl border border-cyber-cyan/30 rounded-2xl p-8 relative overflow-hidden group hover:border-cyber-cyan/60 transition-colors">
                         {/* Scanline effect */}
                         <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,240,255,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-pulse pointer-events-none"></div>
                         
                         <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-cyber-dark border-2 border-cyber-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-2">
                                <User size={32} className="text-cyber-cyan" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white tracking-wider">KARA RAWSON</h3>
                                <div className="h-[1px] w-16 bg-cyber-red mx-auto"></div>
                                <p className="text-cyber-cyan text-sm font-mono tracking-widest">RESEARCH & DEVELOPMENT</p>
                            </div>

                            <div className="w-full space-y-4 pt-4">
                                <a href="mailto:rawsonkara@gmail.com" className="flex items-center gap-4 p-3 rounded bg-cyber-dark/50 hover:bg-cyber-cyan/10 border border-gray-800 hover:border-cyber-cyan transition-all group/item">
                                    <Mail size={18} className="text-gray-400 group-hover/item:text-cyber-cyan" />
                                    <span className="text-gray-300 font-mono text-sm group-hover/item:text-white">rawsonkara@gmail.com</span>
                                </a>
                                <a href="https://github.com/p3nGu1nZz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded bg-cyber-dark/50 hover:bg-cyber-cyan/10 border border-gray-800 hover:border-cyber-cyan transition-all group/item">
                                    <Github size={18} className="text-gray-400 group-hover/item:text-cyber-cyan" />
                                    <span className="text-gray-300 font-mono text-sm group-hover/item:text-white">github.com/p3nGu1nZz</span>
                                </a>
                            </div>
                            
                            <div className="pt-6 text-xs text-gray-600 font-mono">
                                END OF LINE_
                            </div>
                         </div>
                    </div>
                </motion.div>
            </section>
        </div>
    </div>
  );
}
