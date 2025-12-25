
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { HeroScene } from './components/QuantumScene';
import {
  OperatorFamilyViz,
  IntegralSummationViz,
  CollapseThresholdChart,
  MathTooltip
} from './components/Diagrams';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  // We have 5 sections: 0: Hero, 1: Operators, 2: Integral, 3: Threshold, 4: Final
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const totalSections = 5;

  // Initialize refs array with empty slots
  if (sectionRefs.current.length === 0) {
      sectionRefs.current = new Array(totalSections).fill(null);
  }

  const scrollToSection = (index: number) => {
    if (index >= 0 && index < totalSections) {
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find which ref this entry corresponds to
            const index = sectionRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { 
        threshold: 0.5, // Trigger when 50% of the section is visible
        root: null // Use viewport
      }
    );

    sectionRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-cyber-black h-[100dvh] w-full text-gray-200 font-sans selection:bg-cyber-cyan/30 overflow-y-auto overflow-x-hidden relative perspective-1000 scroll-smooth">
        <div className="fixed inset-0 z-0 pointer-events-none">
            <HeroScene />
        </div>

        {/* Floating Navigation Controls - Right Side */}
        <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 items-center pointer-events-none">
            {/* Up / Previous */}
            <button 
                onClick={() => scrollToSection(activeSection - 1)}
                disabled={activeSection === 0}
                className={`pointer-events-auto p-3 rounded-full border border-cyber-cyan/50 backdrop-blur-md transition-all duration-300 group
                    ${activeSection === 0 
                        ? 'opacity-0 translate-x-10' 
                        : 'opacity-100 hover:bg-cyber-cyan/20 hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    }`}
                aria-label="Previous Section"
            >
                <ChevronUp className="text-cyber-cyan" size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="flex flex-col gap-3 py-4 pointer-events-auto">
                {Array.from({ length: totalSections }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollToSection(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 
                            ${activeSection === idx 
                                ? 'bg-cyber-cyan h-6 shadow-[0_0_10px_#00f0ff]' 
                                : 'bg-gray-700 hover:bg-gray-500'}`}
                        aria-label={`Go to section ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Down / Next */}
            <button 
                onClick={() => scrollToSection(activeSection + 1)}
                disabled={activeSection === totalSections - 1}
                className={`pointer-events-auto p-3 rounded-full border border-cyber-cyan/50 backdrop-blur-md transition-all duration-300 group
                    ${activeSection === totalSections - 1 
                        ? 'opacity-0 translate-x-10' 
                        : 'opacity-100 hover:bg-cyber-cyan/20 hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    }`}
                 aria-label="Next Section"
            >
                <ChevronDown className="text-cyber-cyan" size={24} />
            </button>
        </div>

        <div className="relative z-10 w-full">
            {/* SECTION 0: Hero Section */}
            <header 
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
                   
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
            </header>

            {/* Page 2+: Data Visualization Widgets */}
            <main className="max-w-5xl mx-auto px-6 pb-32 space-y-32 md:space-y-0 md:gap-32 flex flex-col">
                {/* SECTION 1: Operator Family */}
                <section 
                    ref={el => { sectionRefs.current[1] = el; }}
                    className="w-full min-h-[80vh] flex items-center justify-center snap-center scroll-mt-12"
                >
                    <OperatorFamilyViz />
                </section>

                {/* SECTION 2: Integral Summation */}
                <section 
                    ref={el => { sectionRefs.current[2] = el; }}
                    className="w-full min-h-[80vh] flex items-center justify-center snap-center scroll-mt-12"
                >
                    <IntegralSummationViz />
                </section>

                {/* SECTION 3: Collapse Threshold */}
                <section 
                    ref={el => { sectionRefs.current[3] = el; }}
                    className="w-full min-h-[80vh] flex items-center justify-center snap-center scroll-mt-12"
                >
                    <CollapseThresholdChart />
                </section>

                {/* SECTION 4: Final Output */}
                <section 
                    ref={el => { sectionRefs.current[4] = el; }}
                    className="w-full min-h-[80vh] flex items-center justify-center snap-center"
                >
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-1 bg-gradient-to-r from-cyber-yellow via-cyber-red to-cyber-yellow rounded-xl max-w-2xl mx-auto shadow-[0_0_50px_rgba(252,238,10,0.15)] w-full flex-shrink-0 relative z-20"
                    >
                        <div className="bg-cyber-black rounded-lg p-6 text-center relative">
                            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-cyber-red font-bold text-[10px] uppercase tracking-[0.4em] mb-3 flex justify-center items-center gap-2">
                                    <Terminal size={14} /> Final Output
                                </div>
                                <div className="font-mono text-2xl md:text-4xl text-white mb-2">
                                   <MathTooltip tip="Objective Reduction Timescale. The expected time until state collapse calculated from the uncertainty principle." title="DEF: TIMESCALE">τOR</MathTooltip> ≤ <MathTooltip tip="Characteristic Time Threshold. The critical duration τ ≈ ℏ/E_G after which the superposition becomes unstable." title="DEF: THRESHOLD">τc</MathTooltip>
                                </div>
                                <div className="text-gray-500 font-mono text-sm mt-1">{`> Operation Successful. System Stable.`}</div>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    </div>
  );
}
