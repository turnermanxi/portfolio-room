import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

import gsap from 'gsap';

import { ZOOM_TARGETS } from './zoomtargets';
import Tutorial from './TutorialOverlay';



// Room Component
const Room = () => {
  const roomRef = useRef();

  useFrame(() => {
    if (roomRef.current) {
      roomRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={roomRef} position={[0, 1, 0]}>
      <boxGeometry args={[5, 3, 5]} />
      <meshStandardMaterial color="orange" wireframe />
    </mesh>
  );
};

// Model Loader Component
const Model = ({ objPath, mtlPath }) => {
  const [obj, setObj] = useState();

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objPath, (loadedObj) => {
        setObj(loadedObj);
      });
    });
  }, [objPath, mtlPath]);

  return obj ? <primitive object={obj} scale={1} position={[0, 0, 0]} /> : null;
};

const CameraZoomHandler = ({ focusTarget }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (focusTarget && ZOOM_TARGETS[focusTarget]) {
      const pos = ZOOM_TARGETS[focusTarget];
      gsap.to(camera.position, {
        duration: 1.5,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        ease: 'power2.inOut',
      });
    }
  }, [focusTarget]);

  return null;
};

// Main Scene
const Scene = () => {
  const [focusTarget, setFocusTarget] = useState('monitor'); // Initial target
  const [tutorialStep, setTutorialStep] = useState(0);

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
      <Canvas camera={{ position: [50, 95, 99] }}>
        <color attach="background" args={['orange']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        <Room />
        <Model objPath="/PortfolioRoom2.obj" mtlPath="/PortfolioRoom2.mtl" />
        <CameraZoomHandler focusTarget={focusTarget} />
        <FlyControls movementSpeed={5} rollSpeed={0.5} dragToLook />

        {tutorialStep < 4 && (
          <Tutorial
            setFocusTarget={setFocusTarget}
            step={tutorialStep}
            onNextStep={handleNextStep}
            onFinish={handleFinishTutorial}
          />
        )}
      </Canvas>
      </div>
  );
};

export default Scene;
