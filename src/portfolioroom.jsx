import React, { useRef, useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, useGLTF, Preload, AdaptiveDpr, AdaptiveEvents, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

import { ZOOM_TARGETS } from './zoomtargets';
import Tutorial from './TutorialOverlay';

const CharOverlay = lazy(() => import("./charoverlay"));
const DesktopUI = lazy(() => import('./DesktopUI'));

useGLTF.preload('portfolioroomimg.glb');
// Room Component
const Room = () => {
  const roomRef = useRef();

  return (
    <mesh ref={roomRef} position={[0, 1, 0]}>
      <boxGeometry args={[5, 3, 5]} />
      <meshStandardMaterial color="orange" wireframe />
    </mesh>
  );
};

// Model Loader Component
// Add/replace this compact GLB-only model component:
// Model Loader Component
// Model Loader Component (GLB-only)
const Model = ({ glbPath = "portfolioroomimg.glb", debugArrows = false, ...props }) => {
  const modelRef = useRef();
  const { scene } = useGLTF(glbPath); // ✅ hook inside component

  // 🔎 Optional debug arrows (runs INSIDE the component)
  useEffect(() => {
    if (!debugArrows) return;
    const group = modelRef.current;
    if (!group || !scene) return;

    // remove any previous ArrowHelpers so they don't stack
    for (let i = group.children.length - 1; i >= 0; i--) {
      if (group.children[i].isArrowHelper) group.remove(group.children[i]);
    }

    const arrowConfigs = {
      "10120_LCD_Computer_Monitor_v01": { color: 0xff0000 },
      "DumbbellRack.obj": { color: 0x00ff00 },
      "Body4": { color: 0x0000ff },
    };

    group.traverse((child) => {
      if (!child.isMesh) return;
      const cfg = arrowConfigs[child.name];
      if (!cfg) return;

      child.geometry?.computeBoundingBox?.();
      const box = child.geometry?.boundingBox;
      if (!box) return;

      const center = new THREE.Vector3();
      box.getCenter(center);
      child.updateWorldMatrix(true, false);
      child.localToWorld(center);

      const origin = center.clone().add(new THREE.Vector3(0, 5, 0));
      const direction = center.clone().sub(origin).normalize();
      const arrow = new THREE.ArrowHelper(direction, origin, 5, cfg.color);
      group.add(arrow);
    });
  }, [debugArrows, scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[0, 0, 0]}
      {...props}
    />
  );
};



const CameraZoomHandler = ({ focusTarget }) => {
  const { camera, invalidate } = useThree();

  useEffect(() => {
    // Example: ZOOM_TARGETS[focusTarget] = { x, y, z, lookAt: {x,y,z} }
    const target = ZOOM_TARGETS?.[focusTarget];
    if (!target) return;
    const { x, y, z, lookAt } = target;

    gsap.to(camera.position, {
      duration: 1,
      x, y, z,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (lookAt) camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
        invalidate(); // render only while animating
      },
    });
  }, [focusTarget, camera, invalidate]);

  return null;
};



function LoaderOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        borderRadius: 12,
        fontSize: 14,
        letterSpacing: 0.3,
        backdropFilter: 'blur(3px)'
      }}>
        Loading… {Math.floor(progress)}%
      </div>
    </Html>
  );
}


// Main Scene
const Scene = () => {
  const [focusTarget, setFocusTarget] = useState('overview'); // Initial target
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showChar, setShowChar] = useState(false);
  const { progress } = useProgress();
  const assetsReady = progress === 100;

  useEffect(() => {
  if (!assetsReady) return;
  const cb = () => setShowChar(true);
  // Prefer idle time so it won’t compete with your GLB parse
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(cb, { timeout: 2000 });
    return () => cancelIdleCallback(id);
  } else {
    const t = setTimeout(cb, 1200);
    return () => clearTimeout(t);
  }
}, [assetsReady]);

  const testArrow = useMemo(() => {
    const origin = new THREE.Vector3(0, 2, 0);
    const direction = new THREE.Vector3(0, 1, 0).normalize();
    const length = 5;
    const color = 0xffff00;
    return new THREE.ArrowHelper(direction, origin, length, color);
  }, []);
  
  const handleNextStep = () => {
    const steps = ['monitor', 'keyboard', 'poster', 'shelf', 'door'];
    const nextStep = (tutorialStep + 1) % steps.length;
    setTutorialStep(nextStep);
    setFocusTarget(steps[nextStep]);
  };
  const handleFinishTutorial = () => {
    setFocusTarget(null); // Clear focus target to end tutorial
  };
  return (
    <div className="roomcanvas">
      <Canvas dpr={[1, 1.5]}
         frameloop="demand"
         gl={{ antialias: false, powerPreference: 'high-performance' }}
  // shadows={false} // keep off initially; enable later if you truly need them
         camera={{ position: [14, 7, 12], fov: 45 }}>
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={.7} />
        <pointLight position={[30, 30, 30]} />
        <directionalLight position={[89, 400, 88]} intensity={1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
        <spotLight position={[100, 100, 100]} angle={0.3} penumbra={1} intensity={1} castShadow />


        <primitive object={testArrow} castShadow receiveShadow/>
        <Suspense fallback={<LoaderOverlay />}>

        <Room />
        { /* {showChar && (
            <Suspense fallback={null}>
             <CharOverlay
               hp={75}
               maxHp={100}
               exp={30}
               maxExp={100}
               funny={87}
               age={30}
               power="Gravity"
              />
               </Suspense>
            )} */}    
        <Model key="PortfolioRoom2" objPath="/PortfolioRoom2.obj" mtlPath="/PortfolioRoom2.mtl" glbPath="portfolioroomimg.glb"/>
        <Preload all />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <CameraZoomHandler focusTarget={focusTarget} />
        {/* <FlyControls movementSpeed={5} rollSpeed={0.5} dragToLook /> */}

        {focusTarget === 'monitor' && <Html transform position={[-112, 9.00, -4.6

        ]} rotation={[0, Math.PI / 2 , 0]}>
          <Suspense fallback={null}>
            <DesktopUI />
          </Suspense>
          </Html>}

          



        {assetsReady && tutorialStep < 4 && (
          <Tutorial
            setFocusTarget={setFocusTarget}
            step={tutorialStep}
            onNextStep={handleNextStep}
            onFinish={handleFinishTutorial}
          />
        )}
        </Suspense>
      </Canvas>
      </div>
  );
};

export default Scene;
