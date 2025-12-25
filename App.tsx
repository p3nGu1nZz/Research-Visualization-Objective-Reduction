
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronDown, Play } from 'lucide-react';
import { HeroScene } from './components/QuantumScene';
import {
  OperatorFamilyViz,
  IntegralSummationViz,
  CollapseThresholdChart,
  MathTooltip
} from './components/Diagrams';

export default function App() {
  const contentRef = useRef<HTMLElement>(null);

  const handleStart = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-cyber-black h-[100dvh] w-full text-gray-200 font-sans selection:bg-cyber-cyan/30 overflow-y-auto overflow-x-hidden relative perspective-1000">
        <div className="fixed inset-0 z-0 pointer-events-none">
            <HeroScene />
        </div>

        <div className="relative z-10 w-full">
            {/* Page 1: Hero Section - Full Height - Flex Centered for Responsiveness */}
            <header className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center relative gap-12 sm:gap-16">
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
                   onClick={handleStart}
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
                   
                   {/* Animated Background Fill */}
                   <div className="absolute inset-0 bg-cyber-cyan/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                   
                   {/* Decorative corners */}
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
            </header>

            {/* Page 2+: Data Visualization Widgets */}
            <main ref={contentRef} className="max-w-5xl mx-auto px-6 pb-32 space-y-32 scroll-mt-24 pt-12 md:pt-0">
                <section className="w-full">
                    <OperatorFamilyViz />
                </section>

                <section className="w-full">
                    <IntegralSummationViz />
                </section>

                <section className="w-full">
                    <CollapseThresholdChart />
                </section>

                <section className="w-full">
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
