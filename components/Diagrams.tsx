
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Sigma, Scale, ChevronRight, Zap, Terminal, Sliders } from 'lucide-react';

export const MathTooltip = ({ children, tip, title = "DEFINITION" }: { children?: React.ReactNode; tip: string; title?: string }) => {
  const [offset, setOffset] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (!spanRef.current) return;
    const rect = spanRef.current.getBoundingClientRect();
    const tooltipWidth = 320; // w-80 is 320px
    const screenPadding = 20;
    const viewportWidth = window.innerWidth;
    
    // Ideal center position relative to viewport
    const centerX = rect.left + rect.width / 2;
    
    // Calculate theoretical edges if centered
    const leftEdge = centerX - tooltipWidth / 2;
    const rightEdge = centerX + tooltipWidth / 2;
    
    let correction = 0;
    
    // Check right overflow
    if (rightEdge > viewportWidth - screenPadding) {
      correction = (viewportWidth - screenPadding) - rightEdge;
    }
    // Check left overflow
    else if (leftEdge < screenPadding) {
      correction = screenPadding - leftEdge;
    }
    
    setOffset(correction);
  };

  return (
    <span 
      ref={spanRef}
      onMouseEnter={handleMouseEnter} 
      className="relative group/tooltip cursor-help inline-block mx-1 align-baseline z-30"
    >
      <span className="border-b-2 border-dotted border-cyber-cyan text-cyber-cyan font-bold transition-all hover:bg-cyber-cyan/10 hover:border-solid px-1 rounded-sm whitespace-nowrap">
        {children}
      </span>
      <span 
        className="invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all duration-300 ease-out absolute bottom-full left-1/2 mb-3 w-80 p-0 pointer-events-none transform origin-bottom translate-y-2 group-hover/tooltip:translate-y-0 z-[100]"
        style={{ marginLeft: -160 + offset }}
      >
         <div className="bg-cyber-black/95 backdrop-blur-xl border border-cyber-cyan/50 text-gray-200 text-sm shadow-[0_0_30px_rgba(0,240,255,0.2)] rounded overflow-hidden">
            <div className="bg-cyber-cyan/10 px-3 py-2 text-[10px] font-mono text-cyber-cyan border-b border-cyber-cyan/20 uppercase tracking-[0.2em] flex justify-between items-center">
              <span className="flex items-center gap-2"><Terminal size={12} /> {title}</span>
            </div>
            <div className="px-4 py-3 font-mono leading-relaxed text-left">
              {tip}
            </div>
         </div>
         <div 
           className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-cyber-cyan/50"
           style={{ marginLeft: -offset }}
         ></div>
      </span>
    </span>
  );
};

// --- OPERATOR FAMILY VISUALIZATION ---
export const OperatorFamilyViz: React.FC = () => {
  const [activeOps, setActiveOps] = useState<Record<string, boolean>>({
    E: true,
    C: false,
    X: false,
    G: false
  });

  // State for interactive controls
  const [params, setParams] = useState({
    distortion: 20, // 0-100
    speed: 50       // 0-100 (Where 50 is 1x)
  });

  const toggleOp = (key: string) => {
    setActiveOps(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const getOpStyle = () => {
    let scale = 1;
    let rotate = 0;
    let color = '#00f0ff'; // cyber cyan
    let glow = '0 0 30px rgba(0, 240, 255, 0.4)';

    // Base properties based on active operators
    if (activeOps.E) color = '#fcee0a'; // yellow
    if (activeOps.C) {
        scale = 1.3; 
        glow = '0 0 50px rgba(255, 0, 60, 0.6)';
    }
    if (activeOps.X) {
        rotate = 45; 
        color = '#ff003c'; // red
    }
    if (activeOps.G) {
        color = '#710193'; // purple
        scale = scale * 0.8; 
    }
    
    // Apply Distortion parameter
    // Base distortion if G is active is higher
    const baseDistort = activeOps.G ? 25 : 0;
    const totalDistortion = baseDistort + (params.distortion * 0.4); 
    
    return { scale, rotate, color, glow, totalDistortion };
  };

  const style = getOpStyle();
  const speedMultiplier = params.speed / 50; // 1.0 is default
  
  // Calculate keyframes for organic morphing based on distortion
  const borderRadiusKeyframes = useMemo(() => {
     const d = style.totalDistortion;
     if (d <= 5) return ["50% 50% 50% 50%"];
     
     // Create a sequence of distorted shapes
     return [
       "50% 50% 50% 50%",
       `${50-d}% ${50+d}% ${50-d*0.6}% ${50+d*0.6}%`,
       `${50+d*0.5}% ${50-d*0.5}% ${50+d}% ${50-d}%`,
       `${50-d*0.8}% ${50+d*0.8}% ${50+d*0.4}% ${50-d*0.4}%`,
       "50% 50% 50% 50%"
     ];
  }, [style.totalDistortion]);

  return (
    <div className="flex flex-col items-center p-6 bg-cyber-black rounded-xl border border-cyber-gray shadow-2xl relative w-full overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-cyber-cyan"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-cyber-cyan"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-cyber-cyan"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-cyber-cyan"></div>

      <div className="w-full flex justify-between items-center mb-4 border-b border-gray-800 pb-2 relative z-10">
         <h3 className="font-mono text-xl text-white tracking-widest">SIMULATION.STATE</h3>
         <Activity size={20} className="text-cyber-cyan animate-pulse" />
      </div>
      
      <div className="relative w-full aspect-square max-w-[260px] bg-cyber-black rounded-full border border-gray-800 flex items-center justify-center mb-6 overflow-hidden shadow-inner group z-10">
         {/* Background Grid */}
         <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#00f0ff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
         <div className="absolute inset-0 border border-cyber-cyan/20 rounded-full animate-pulse-fast"></div>
         <div className="absolute inset-0 border-4 border-transparent border-t-cyber-cyan/30 rounded-full animate-spin linear" style={{ animationDuration: `${10 / speedMultiplier}s` }}></div>
         
         {/* The State Psi */}
         <motion.div
            className="w-32 h-32 rounded-full relative blur-sm mix-blend-screen"
            animate={{
                scale: style.scale,
                rotate: style.rotate,
                backgroundColor: style.color,
                boxShadow: style.glow,
                borderRadius: borderRadiusKeyframes
            }}
            transition={{ 
                duration: 0.5, 
                type: "spring",
                borderRadius: { 
                    duration: 4 / speedMultiplier, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }
            }}
         >
             {/* Inner core */}
             <div className="absolute inset-2 bg-white/10 rounded-full blur-md"></div>
             {activeOps.E && (
                 <motion.div 
                    className="absolute -inset-6 border-2 border-dashed border-white/50 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4 / speedMultiplier, ease: "linear" }}
                 />
             )}
         </motion.div>
         
         <div className="absolute bottom-6 text-xs font-mono text-cyber-cyan bg-cyber-black/80 px-3 py-1 border border-cyber-cyan/30 backdrop-blur-sm rounded-sm">STATUS: |Ψ⟩</div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full mb-6 z-10">
          {[
              { id: 'E', label: 'Ê(α)', name: 'DYNAMICAL' },
              { id: 'C', label: 'Ĉ(α)', name: 'VACUUM' },
              { id: 'X', label: 'Ĉχ(α)', name: 'CHIRAL' },
              { id: 'G', label: 'Ĝ(α)', name: 'GRAVITY' },
          ].map((op) => (
              <button
                key={op.id}
                onClick={() => toggleOp(op.id)}
                className={`flex items-center justify-between p-2 sm:p-3 rounded border text-left transition-all duration-200 group relative overflow-hidden ${activeOps[op.id] ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-cyber-dark text-gray-500 border-gray-800 hover:border-gray-500'}`}
              >
                  <div className="relative z-10">
                      <div className="font-mono font-bold text-sm sm:text-lg leading-none">{op.label}</div>
                      <div className="text-[8px] sm:text-[10px] tracking-[0.2em] font-bold mt-1 opacity-70">{op.name}</div>
                  </div>
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm transition-all duration-300 ${activeOps[op.id] ? 'bg-cyber-cyan shadow-[0_0_10px_#00f0ff]' : 'bg-gray-800'}`}></div>
                  {activeOps[op.id] && <div className="absolute inset-0 bg-cyber-cyan/5 animate-pulse"></div>}
              </button>
          ))}
      </div>

      {/* Control Panel */}
      <div className="w-full bg-cyber-dark/50 border border-gray-800 rounded p-4 relative z-10">
         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-500"></div>
         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-500"></div>
         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-500"></div>
         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-500"></div>

         <div className="flex items-center gap-2 mb-4 text-xs font-mono text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-2">
            <Sliders size={12} /> Operator Parameters
         </div>

         <div className="space-y-5">
            {/* Distortion Control */}
            <div>
               <div className="flex justify-between text-[10px] font-mono mb-2">
                  <span className="text-cyber-cyan">DISTORTION_FIELD</span>
                  <span className="text-white">{params.distortion}%</span>
               </div>
               <input 
                  type="range" 
                  min="0" max="100" 
                  value={params.distortion} 
                  onChange={(e) => setParams(p => ({...p, distortion: parseInt(e.target.value)}))}
                  className="w-full h-2 md:h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-cyan hover:accent-white transition-all"
               />
            </div>
            
            {/* Speed Control */}
            <div>
               <div className="flex justify-between text-[10px] font-mono mb-2">
                  <span className="text-cyber-yellow">TEMPORAL_FLUX</span>
                  <span className="text-white">x{(params.speed / 50).toFixed(1)}</span>
               </div>
               <input 
                  type="range" 
                  min="10" max="150" 
                  value={params.speed} 
                  onChange={(e) => setParams(p => ({...p, speed: parseInt(e.target.value)}))}
                  className="w-full h-2 md:h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-yellow hover:accent-white transition-all"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

// --- INTEGRAL SUMMATION VISUALIZATION ---
export const IntegralSummationViz: React.FC = () => {
  const [n, setN] = useState(4); 
  
  useEffect(() => {
    const interval = setInterval(() => {
        setN(prev => prev >= 64 ? 4 : prev * 2);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-cyber-black rounded-xl border border-cyber-gray shadow-2xl relative w-full">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-cyber-yellow"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-cyber-yellow"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-cyber-yellow"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-cyber-yellow"></div>

      <div className="flex items-center justify-between w-full mb-6">
          <h3 className="font-mono text-xl text-white uppercase tracking-wider">Integral.Process</h3>
          <div className="px-3 py-1 bg-cyber-dark border border-cyber-cyan text-cyber-cyan font-mono text-xs shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            N_PARTITION: <span className="text-white font-bold">{n}</span>
          </div>
      </div>

      {/* Graph Area */}
      <div className="relative w-full h-48 bg-black/80 rounded border border-gray-800 overflow-hidden flex items-end px-4 mb-6 shadow-inner">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

        {/* Render bars */}
        <div className="flex items-end w-full h-full gap-[2px] relative z-10">
            {Array.from({ length: n }).map((_, i) => {
                const x = i / n;
                const heightPct = 20 + Math.abs(Math.sin(x * Math.PI * 2) * 60 * Math.exp(-x * 2)); 
                
                return (
                    <motion.div
                        key={`${n}-${i}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="flex-1 bg-cyber-yellow hover:bg-white transition-colors shadow-[0_0_10px_rgba(252,238,10,0.6)] rounded-t-sm"
                    />
                );
            })}
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-cyan shadow-[0_0_15px_#00f0ff]"></div>
      </div>

      <div className="w-full flex items-center justify-between text-sm font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <Sigma size={14} className="text-cyber-yellow" />
            <span>SUM</span>
          </div>
          <ChevronRight size={14} className="text-gray-700" />
          <div className="text-white tracking-widest hidden sm:block">INTEGRAL</div>
          <ChevronRight size={14} className="text-gray-700 hidden sm:block" />
          <div className="text-cyber-red font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,60,0.2)] px-2 py-1 border border-cyber-red/30 rounded bg-cyber-red/5 text-xs">
              <Zap size={14} /> NULL
          </div>
      </div>
    </div>
  );
};

// --- COLLAPSE THRESHOLD CHART ---
export const CollapseThresholdChart: React.FC = () => {
    const [energy, setEnergy] = useState(50); // G[Psi]
    const thresholdMet = energy >= 40; 
    const tauOR = (30 / energy) * 100;

    return (
        <div className="flex flex-col gap-6 p-6 bg-cyber-black border border-cyber-gray rounded-2xl shadow-2xl relative w-full">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-red rounded-t-2xl"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                <div>
                    <h3 className="font-mono text-xl text-white mb-1 uppercase tracking-wider">Condition Check</h3>
                    <p className="text-gray-500 text-xs font-mono tracking-wide">
                        (A2) GRAVITATIONAL_SELF_ENERGY
                    </p>
                </div>
                <div className={`px-3 py-1 border font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 ${thresholdMet ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
                    {thresholdMet ? "COLLAPSE_IMMINENT" : "STATE_STABLE"}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-cyber-dark p-4 rounded border border-gray-800">
                <div className="flex justify-between mb-3 text-xs font-mono text-cyber-yellow font-bold">
                    <span>INPUT: <MathTooltip tip="Gravitational Self-Energy. The energy uncertainty arising from the difference in spacetime geometries associated with the superposed states." title="DEF: GRAVITY">G[Ψ]</MathTooltip></span>
                    <span>{energy} UNITS</span>
                </div>
                <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={energy} 
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-yellow hover:accent-cyber-cyan transition-colors"
                />
            </div>
            
            {/* Visualization */}
            <div className="relative h-32 border-b border-gray-700 flex items-end pb-1 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:15px_15px]">
                {/* Threshold Line */}
                <div className="absolute left-0 w-full h-[2px] bg-cyber-red z-10 opacity-70 border-t border-dashed border-white" style={{ bottom: '40%' }}>
                    {/* Moved LIMIT label to left-0 to avoid overlapping with Timescale T_OR box */}
                    <span className="absolute left-0 -top-6 text-[10px] font-mono font-bold text-cyber-red bg-cyber-black px-1 border border-cyber-red shadow-[0_0_10px_rgba(255,0,60,0.5)]">LIMIT: ℏ/τc</span>
                </div>

                {/* Energy Bar */}
                <div className="w-full flex justify-center h-full items-end relative px-8">
                     <motion.div 
                        className={`w-full max-w-[120px] rounded-t-sm transition-colors duration-300 relative overflow-hidden ${thresholdMet ? 'bg-cyber-cyan' : 'bg-gray-700'}`}
                        animate={{ height: `${energy}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                     >
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/60"></div>
                        {thresholdMet && <div className="absolute inset-0 bg-cyber-cyan shadow-[0_0_50px_#00f0ff] opacity-80"></div>}
                     </motion.div>
                </div>

                {/* Timescale Indicator */}
                <div className="absolute right-0 top-0 w-32 p-2 bg-cyber-dark border border-gray-700 text-right shadow-lg">
                    <div className="text-[10px] text-gray-400 uppercase font-mono mb-1 tracking-widest">Timescale τ_OR</div>
                    <div className="font-mono text-xl text-white tracking-widest leading-none">{tauOR.toFixed(1)}<span className="text-[10px] text-gray-600 ml-1">ms</span></div>
                </div>
            </div>

            <div className="font-mono text-xs text-gray-400 leading-relaxed border-l-4 border-gray-800 pl-3 py-1 truncate">
                {thresholdMet 
                    ? <span className="text-cyber-cyan text-shadow-neon">> SYSTEM ALERT: Self-energy threshold exceeded.</span>
                    : <span>> SYSTEM STATUS: Self-energy insufficient.</span>}
            </div>
        </div>
    )
}
