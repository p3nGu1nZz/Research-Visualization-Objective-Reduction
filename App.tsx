
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronDown } from 'lucide-react';
import { HeroScene } from './components/QuantumScene';
import {
  OperatorFamilyViz,
  IntegralSummationViz,
  CollapseThresholdChart,
  MathTooltip
} from './components/Diagrams';

export default function App() {
  return (
    <div className="bg-cyber-black h-[100dvh] w-full text-gray-200 font-sans selection:bg-cyber-cyan/30 overflow-y-auto overflow-x-hidden relative perspective-1000">
        <div className="fixed inset-0 z-0 pointer-events-none">
            <HeroScene />
        </div>

        <div className="relative z-10 w-full">
            {/* Page 1: Hero Section - Full Height */}
            <header className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        OR_THEORY
                    </h1>
                    <p className="text-cyber-cyan tracking-[0.5em] font-mono text-sm md:text-base border-t border-b border-cyber-cyan/30 py-4 backdrop-blur-sm bg-black/20">
                        QUANTUM STATE REDUCTION
                    </p>
                </motion.div>
                
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 1.5, duration: 1 }}
                   className="absolute bottom-12 flex flex-col items-center gap-2 text-cyber-cyan/50"
                >
                   <span className="text-[10px] tracking-[0.3em] font-mono">INITIATE_SEQUENCE</span>
                   <ChevronDown className="animate-bounce" size={20} />
                </motion.div>
            </header>

            {/* Page 2+: Data Visualization Widgets */}
            <main className="max-w-5xl mx-auto px-6 pb-32 space-y-32">
                <section className="w-full scroll-mt-24">
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
