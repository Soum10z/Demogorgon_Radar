import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Assets
import cloudImg from '../../assets/red_Cloud-removebg-preview.png';
import heroBg from '../../assets/wallpapersden.com_demogorgon-bakasura-smite-x-stranger-things_2880x1800.jpg';
import rulesBg from '../../assets/wp16183812-stranger-things-season-5-4k-wallpapers.webp';

const HeroLanding = () => {
    const [introVisible, setIntroVisible] = useState(true);

    // Stage 1: Cloud Reveal Outward Fade
    useEffect(() => {
        const timer = setTimeout(() => {
            setIntroVisible(false);
        }, 3500); // 3-4 seconds per requirements
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-full overflow-hidden font-share-tech bg-[#0a0a0a]">

            {/* 
        ========================================
        STAGE 1: CLOUD REVEAL INTRO
        ========================================
      */}
            <AnimatePresence>
                {introVisible && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden pointer-events-none"
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        {/* Subdued Lightning Flashes */}
                        <motion.div
                            className="absolute inset-0 bg-white"
                            animate={{ opacity: [0, 0, 0.8, 0, 0.2, 0, 0] }}
                            transition={{ duration: 3.5, times: [0, 0.2, 0.25, 0.3, 0.5, 0.55, 1] }}
                        />

                        {/* Dense Fog / Red Cloud Layers */}
                        <motion.img
                            src={cloudImg}
                            alt="Storm Clouds Layer 1"
                            className="absolute w-[150%] h-[150%] object-cover opacity-60 mix-blend-screen"
                            initial={{ x: "-10%", y: "-5%", scale: 1 }}
                            animate={{ x: "10%", y: "5%", scale: 1.2 }}
                            transition={{ duration: 5, ease: "linear" }}
                        />
                        <motion.img
                            src={cloudImg}
                            alt="Storm Clouds Layer 2"
                            className="absolute w-[140%] h-[140%] object-cover opacity-50 mix-blend-screen transform scale-x-[-1]"
                            initial={{ x: "15%", y: "10%" }}
                            animate={{ x: "-10%", y: "-5%", scale: 1.5 }}
                            transition={{ duration: 6, ease: "linear" }}
                        />
                        <motion.img
                            src={cloudImg}
                            alt="Storm Clouds Layer 3"
                            className="absolute w-[160%] h-[160%] object-cover opacity-70 mix-blend-screen"
                            initial={{ scale: 1.2, rotate: 5 }}
                            animate={{ scale: 1.8, rotate: -5 }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 
        ========================================
        GLOBAL AMBIENT EFFECTS & FIXED BACKGROUND
        ========================================
      */}
            <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
                {/* Animated ambient particles / fog overlay (simulated with radial gradients moving) */}
                <motion.div
                    className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,60,0.1),transparent_50%)]"
                    animate={{ x: ["0%", "5%", "-5%", "0%"], y: ["0%", "-5%", "5%", "0%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center justify-start">
                {/* 
          ========================================
          STAGE 2: HERO SECTION
          ========================================
        */}
                <section className="relative w-full min-h-screen flex items-center px-6 md:px-20 lg:px-32">

                    {/* Section Background with slow zoom */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <motion.div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${heroBg})` }}
                            initial={{ scale: 1 }}
                            whileInView={{ scale: 1.1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: "linear" }}
                        />
                        { /* Dark gradient overlay to improve readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                    </div>

                    {/* Left Side Panel - Glassmorphism */}
                    <motion.div
                        className="w-full md:w-[600px] bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(255,0,60,0.2)] md:mt-20 lg:mt-0 z-20"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        <h1 className="font-orbitron font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]">
                            JOIN THE <br /> <span className="text-[#ff003c] drop-shadow-[0_0_15px_rgba(255,0,60,0.8)]">DEMOGORGON</span> HUNT
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl md:leading-relaxed mb-10 tracking-wide">
                            Track the creature that escaped Hawkins Lab.<br />
                            Use experimental radar technology to detect its movements before it hunts you down.
                        </p>
                        <motion.button
                            className="bg-[#ff003c] text-white font-orbitron font-bold tracking-widest px-8 py-4 rounded-full shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:shadow-[0_0_30px_rgba(255,0,60,0.8)] border border-[#ff003c]/50 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            ENTER THE GAME
                        </motion.button>
                    </motion.div>
                </section>

                {/* 
          ========================================
          STAGE 3: STORY / RULES SECTION
          ========================================
        */}
                <section className="relative w-full min-h-screen flex items-center px-6 md:px-20 lg:px-32">

                    {/* Section Background with subtle pan */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <motion.div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${rulesBg})` }}
                            initial={{ scale: 1, y: 0 }}
                            whileInView={{ scale: 1.05, y: -20 }}
                            transition={{ duration: 15, ease: "linear" }}
                        />
                        { /* Dark cinematic overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30"></div>
                    </div>

                    {/* Content Panel (Left Side on Desktop, Stacked on Mobile) */}
                    <motion.div
                        className="w-full md:w-[600px] bg-black/50 backdrop-blur-md border border-[#39ff14]/30 rounded-2xl p-8 md:p-12 shadow-[0_0_20px_rgba(57,255,20,0.1)] relative overflow-hidden z-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2 }}
                    >
                        {/* Subtle radar scanline effect container layer */}
                        <motion.div
                            className="absolute inset-0 border-t border-[#39ff14]/20 bg-gradient-to-b from-[#39ff14]/10 to-transparent pointer-events-none"
                            animate={{ y: ["-100%", "200%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />

                        <h2 className="font-orbitron font-bold relative z-10 text-3xl md:text-5xl text-white mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            THE INCIDENT
                        </h2>
                        <div className="space-y-6 relative z-10 text-gray-300 text-base md:text-lg">
                            <p>
                                A creature from the Upside Down has escaped Hawkins Lab.
                                Security agents must track it using experimental radar devices.
                            </p>
                            <p className="text-[#39ff14] font-bold drop-shadow-[0_0_5px_rgba(57,255,20,0.3)]">
                                If the Demogorgon gets close, your device will trigger an alert.
                            </p>

                            <ul className="mt-8 space-y-4 pl-2 font-share-tech tracking-wide">
                                {[
                                    "One player becomes the Demogorgon",
                                    "Other players act as security agents",
                                    "Radar detects nearby signals",
                                    "If the creature gets too close, alarms trigger",
                                    "Survive or capture the creature"
                                ].map((rule, idx) => (
                                    <li key={idx} className="flex items-start space-x-4">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#ff003c] shadow-[0_0_8px_rgba(255,0,60,0.8)] flex-shrink-0"></span>
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                </section>
            </div>
        </div>
    );
};

export default HeroLanding;
