import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, SpotLight } from '@react-three/drei';
import * as THREE from 'three';

// Import Assets
import cloudImg from '../../assets/red_Cloud-removebg-preview.png';
import environmentBg from '../../assets/images/upside_down_gate.jpg';
import demogorgonModelPath from '../../assets/3Dmodel/demogorgon.glb?url';
import screamAudioPath from '../../assets/3Dmodel/demogorgon-scream.mp3';
import section2Bg from '../../assets/images/upside_down_bike_scene.jpg';
import agentsImg from '../../assets/images/security_agents.jpg';
import demoRoleImg from '../../assets/images/demogorgon_role.jpg';

// ----------------------------------------------------
// Demogorgon 3D Model Component & Animation Logic
// ----------------------------------------------------
const DemogorgonActor = ({ sequencePhase }) => {
    const { scene } = useGLTF(demogorgonModelPath);
    const modelRef = useRef();

    // Animation state tracking
    const [screamStartTime, setScreamStartTime] = useState(0);

    useEffect(() => {
        if (sequencePhase === 'SCREAM') {
            setScreamStartTime(performance.now());
            // Play Audio
            const audio = new Audio(screamAudioPath);
            audio.volume = 1.0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }, [sequencePhase]);

    // Procedural Animation Loop
    useFrame((state) => {
        if (!modelRef.current) return;

        const time = state.clock.elapsedTime;

        if (sequencePhase === 'FOG_INTRO' || sequencePhase === 'REVEAL' || sequencePhase === 'IDLE_POST_SCREAM') {
            modelRef.current.position.y = -2 + Math.sin(time * 1.5) * 0.05;
            modelRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
            modelRef.current.rotation.x = Math.sin(time * 2) * 0.02;
        }
        else if (sequencePhase === 'SCREAM') {
            const elapsedSinceScream = (performance.now() - screamStartTime) / 1000;

            if (elapsedSinceScream < 2.0) {
                const liftProgress = Math.min(elapsedSinceScream * 5, 1);
                modelRef.current.position.y = -2 + (liftProgress * 0.5);
                modelRef.current.rotation.x = liftProgress * 0.3;
                modelRef.current.position.x = (Math.random() - 0.5) * 0.1;
            } else {
                modelRef.current.position.x = THREE.MathUtils.lerp(modelRef.current.position.x, 0, 0.1);
                modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, -2 + Math.sin(time * 1.5) * 0.05, 0.1);
                modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, Math.sin(time * 2) * 0.02, 0.1);
            }
        }
    });

    return (
        <group ref={modelRef} dispose={null} position={[0, -2, 0]} scale={[1.5, 1.5, 1.5]}>
            <primitive object={scene} />
        </group>
    );
};

// ----------------------------------------------------
// Lighting & Camera Rig Component
// ----------------------------------------------------
const CinematicEnvironment = ({ sequencePhase }) => {
    const spotlightRef = useRef();
    const lightningRef = useRef();
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        if (spotlightRef.current) {
            spotlightRef.current.position.x = Math.sin(time * 2) * 0.1;
            spotlightRef.current.position.y = 2 + Math.cos(time * 1.5) * 0.1;
            spotlightRef.current.target.position.x = Math.sin(time * 3) * 0.2;
        }

        if (sequencePhase === 'REVEAL') {
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6, delta * 0.5);
            if (spotlightRef.current) spotlightRef.current.intensity = THREE.MathUtils.lerp(spotlightRef.current.intensity, 50, delta * 2);
        }
        else if (sequencePhase === 'SCREAM') {
            camera.position.x = (Math.random() - 0.5) * 0.2;
            camera.position.y = (Math.random() - 0.5) * 0.2;
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.5, delta * 5);

            if (spotlightRef.current) {
                spotlightRef.current.intensity = 20 + Math.random() * 80;
            }
            if (lightningRef.current) {
                lightningRef.current.intensity = Math.random() > 0.8 ? 100 : 0;
            }
        }
        else if (sequencePhase === 'IDLE_POST_SCREAM') {
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 2);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, delta * 2);
            if (spotlightRef.current) spotlightRef.current.intensity = THREE.MathUtils.lerp(spotlightRef.current.intensity, 40, delta * 2);
            if (lightningRef.current) lightningRef.current.intensity = 0;
        }
    });

    const bgTexture = new THREE.TextureLoader().load(environmentBg);
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture, color: 0x444444 });

    return (
        <>
            <ambientLight intensity={0.2} color="#ff003c" />

            <mesh position={[0, 0, -15]} scale={[35, 20, 1]}>
                <planeGeometry />
                <primitive object={bgMaterial} attach="material" />
            </mesh>

            <pointLight ref={lightningRef} color="#ff003c" position={[0, 2, -5]} intensity={0} distance={20} />

            <SpotLight
                ref={spotlightRef}
                position={[0, 2, 8]}
                distance={25}
                angle={0.4}
                penumbra={0.8}
                color="#ffffff"
                intensity={0}
            />
        </>
    );
};

// ----------------------------------------------------
// Section 2 Interactive Roles (Flip Flash Cards)
// ----------------------------------------------------
const RolePanelFlipCard = ({ title, description, image }) => {
    return (
        <div className="group relative w-full md:w-1/2 h-[500px] md:h-[450px] [perspective:1000px] cursor-pointer">
            <div className="w-full h-full relative transition duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] active:[transform:rotateY(180deg)]">

                {/* FRONT SIDE (IMAGE) */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden border border-[#ff003c]/30 shadow-[0_0_15px_rgba(255,0,60,0.2)]">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                    {/* Cinematic gradient overlay and subtle red glow border */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none"></div>
                    <div className="absolute inset-0 border-2 border-[#ff003c]/10 rounded-xl pointer-events-none"></div>
                    {/* Optional front title (can remove if strictly image only) */}
                    <div className="absolute bottom-6 w-full text-center">
                        <span className="font-orbitron font-bold text-xl text-white drop-shadow-[0_0_8px_rgba(255,0,60,0.8)] opacity-60 group-hover:opacity-0 transition-opacity">
                            {title}
                        </span>
                    </div>
                </div>

                {/* BACK SIDE (DESCRIPTION) */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#0a0a0a]/95 border border-[#ff003c]/50 rounded-xl p-8 overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(255,0,60,0.4)] flex flex-col justify-center items-center text-center">
                    {/* Subtle fog texture on the back */}
                    <img src={cloudImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen pointer-events-none" />

                    <h3 className="font-orbitron font-bold text-2xl text-[#ff003c] mb-8 drop-shadow-[0_0_10px_rgba(255,0,60,0.5)] z-10 relative">
                        {title}
                    </h3>

                    <div className="font-share-tech text-gray-200 text-lg md:text-xl space-y-4 leading-relaxed z-10 relative px-2">
                        <p className="whitespace-pre-line">{description}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

// ----------------------------------------------------
// Main Component View
// ----------------------------------------------------
const CinematicHero = () => {
    const [sequencePhase, setSequencePhase] = useState('FOG_INTRO');

    useEffect(() => {
        const t1 = setTimeout(() => setSequencePhase('REVEAL'), 3500);
        const t2 = setTimeout(() => setSequencePhase('SCREAM'), 6000);
        const t3 = setTimeout(() => setSequencePhase('IDLE_POST_SCREAM'), 8000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    const scrollToSection2 = () => {
        const sec = document.getElementById('hawkins-lab');
        if (sec) {
            sec.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full text-white font-share-tech bg-[#050505] overflow-x-hidden">

            {/* Global floating particles representing Upside Down spores */}
            <div className="fixed inset-0 pointer-events-none z-30 opacity-30 mix-blend-screen">
                <motion.div
                    className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,60,0.05),transparent_50%)]"
                    animate={{ x: ["-2%", "2%", "-2%"], y: ["0%", "-3%", "0%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* ======================================== */}
            {/* SECTION 1: CINEMATIC HERO (100vh) */}
            {/* ======================================== */}
            <section className="relative w-full h-screen overflow-hidden flex flex-col justify-end">

                {/* 3D R3F Canvas - Isolated in Section 1 */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Canvas shadows dpr={[1, 2]}>
                        <Suspense fallback={null}>
                            <CinematicEnvironment sequencePhase={sequencePhase} />
                            {sequencePhase !== 'FOG_INTRO' && (
                                <DemogorgonActor sequencePhase={sequencePhase} />
                            )}
                        </Suspense>
                    </Canvas>
                </div>

                {/* Layer 1: Cloud Reveal (Framer Motion) */}
                <AnimatePresence>
                    {sequencePhase === 'FOG_INTRO' && (
                        <motion.div
                            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 1, filter: "brightness(0.5)" }}
                            exit={{ opacity: 0, filter: "brightness(1) blur(5px)" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        >
                            <motion.img src={cloudImg} alt="Fog 1" className="absolute w-[150%] h-[150%] object-cover opacity-80 mix-blend-screen" initial={{ x: "-10%", y: "-5%", scale: 1 }} animate={{ x: "0%", y: "0%", scale: 1.5 }} transition={{ duration: 4, ease: "linear" }} />
                            <motion.img src={cloudImg} alt="Fog 2" className="absolute w-[180%] h-[180%] object-cover opacity-70 mix-blend-screen transform scale-x-[-1]" initial={{ x: "5%", y: "5%", scale: 1.2 }} animate={{ x: "-10%", y: "-10%", scale: 1.8 }} transition={{ duration: 4, ease: "linear" }} />
                            <motion.div className="absolute inset-0 bg-white" animate={{ opacity: [0, 0, 0.4, 0, 0, 0.2, 0] }} transition={{ duration: 3.5, times: [0, 0.2, 0.22, 0.3, 0.5, 0.55, 1] }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Layer 2: Landing Page UI Overlay */}
                <AnimatePresence>
                    {sequencePhase === 'IDLE_POST_SCREAM' && (
                        <motion.div
                            className="absolute inset-0 z-40 flex items-center px-6 md:px-20 lg:px-32 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                        >
                            <div className="w-full md:w-[500px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,0,60,0.15)] pointer-events-auto">
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 rounded-2xl"></div>
                                <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-4 leading-tight drop-shadow-[0_0_8px_rgba(255,0,60,0.4)]">
                                    JOIN THE <br />
                                    <span className="text-[#ff003c] drop-shadow-[0_0_15px_rgba(255,0,60,0.8)] animate-pulse">
                                        DEMOGORGON
                                    </span> <br /> HUNT
                                </h1>
                                <p className="text-gray-300 text-lg mb-8 tracking-wide font-share-tech relative z-10">
                                    Track the creature that escaped Hawkins Lab using experimental radar systems.
                                </p>
                                <motion.a
                                    href="https://172.22.4.198:5173/"
                                    className="bg-[#ff003c] text-white font-orbitron font-bold tracking-widest px-8 py-4 rounded-md shadow-[0_0_20px_rgba(255,0,60,0.4)] hover:shadow-[0_0_30px_rgba(255,0,60,0.8)] transition-all cursor-pointer inline-flex items-center gap-2 relative overflow-hidden group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute top-0 left-[-100%] w-full h-full bg-white/20 skew-x-[45deg] group-hover:left-[100%] transition-all duration-500 ease-in-out"></div>
                                    <div className="w-2 h-2 rounded-full bg-white animate-[ping_1.5s_ease-in-out_infinite]" />
                                    ENTER THE GATE
                                </motion.a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Layer 3: Scroll Indicator (Only visible after cinematic) */}
                <AnimatePresence>
                    {sequencePhase === 'IDLE_POST_SCREAM' && (
                        <motion.div
                            className="absolute bottom-[40px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center cursor-pointer pointer-events-auto"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                            onClick={scrollToSection2}
                        >
                            <motion.span
                                className="font-benguiat text-[#ff003c] text-xl tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,0,60,0.8)] mb-2"
                                animate={{ opacity: [0.7, 1, 0.4, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                EXPLORE HAWKINS LAB
                            </motion.span>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff003c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(255,0,60,0.8)]"><path d="m6 9 6 6 6-6" /></svg>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Global Vignette for Section 1 */}
                <div className="absolute inset-0 pointer-events-none z-40 mix-blend-multiply opacity-60 bg-[radial-gradient(circle_at_center,transparent_40%,#000_100%)]"></div>
            </section>

            {/* ======================================== */}
            {/* SECTION 2: HAWKINS LAB (min 100vh) */}
            {/* ======================================== */}
            <section id="hawkins-lab" className="relative w-full min-h-screen py-24 px-6 md:px-20 lg:px-32 flex flex-col items-center z-20">

                {/* Background Layer with Hardware Accelerated Blur */}
                <div className="absolute inset-0 -z-10 bg-black overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-[10px] opacity-60"
                        style={{ backgroundImage: `url(${section2Bg})` }}
                    />
                    {/* Deep red atmospheric gradient linking from Hero */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#ff003c]/10 to-transparent opacity-80 pointer-events-none"></div>
                </div>

                {/* Drifting Fog that descends into section 2 */}
                <div className="absolute top-0 left-0 w-full h-[500px] -z-10 pointer-events-none opacity-40">
                    <motion.img
                        src={cloudImg}
                        alt=""
                        className="w-full h-full object-cover mix-blend-screen"
                        animate={{ y: [-50, 50, -50], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Header Sequence */}
                <div className="text-center mt-12 mb-20 z-10 w-full">
                    <motion.h2
                        className="font-benguiat text-[#ff003c] text-3xl md:text-5xl lg:text-7xl leading-tight uppercase drop-shadow-[0_0_20px_rgba(255,0,60,0.6)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1 }}
                    >
                        <span className="animate-[flicker_4s_infinite]">SOMETHING'S COMING</span><br />
                        <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">SOMETHING HUNGRY <span className="text-[#ff003c]">FOR BLOOD</span></span>
                    </motion.h2>
                </div>

                {/* The Incident Story Panel */}
                <motion.div
                    className="w-full max-w-4xl bg-black/60 relative border border-[#ff003c]/40 rounded-sm mb-24 p-8 md:p-12 shadow-[0_0_50px_rgba(255,0,60,0.1)] backdrop-blur-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Lab terminal styling accents */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent opacity-70"></div>
                    <div className="absolute -inset-4 bg-[#ff003c]/5 blur-2xl pointer-events-none"></div>

                    <h3 className="font-orbitron font-bold text-xl md:text-2xl text-[#ff003c] tracking-[0.3em] mb-6 inline-block border-b border-[#ff003c]/30 pb-2">
                        [ THE INCIDENT ]
                    </h3>
                    <div className="font-share-tech text-gray-300 text-lg md:text-xl space-y-6 leading-relaxed relative z-10">
                        <p>A creature from the Upside Down has escaped Hawkins Lab.</p>
                        <p>Security agents must track its movements using experimental radar technology.</p>
                        <p className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">But one player secretly becomes the Demogorgon, hunting the others in the dark.</p>
                    </div>
                </motion.div>

                {/* Roles Interactive Display */}
                <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 pb-20 z-10">
                    <RolePanelFlipCard
                        title="SECURITY AGENTS"
                        image={agentsImg}
                        description={`Players equipped with experimental radar scanners must detect the Demogorgon before it reaches them.\n\nRadar pulses reveal nearby movement signals.\n\nWork together to survive.`}
                    />
                    <RolePanelFlipCard
                        title="DEMOGORGON"
                        image={demoRoleImg}
                        description={`One player secretly becomes the creature from the Upside Down.\n\nMove silently through the environment.\n\nAvoid detection and hunt the agents one by one.`}
                    />
                </div>
            </section>
        </div>
    );
};

export default CinematicHero;
