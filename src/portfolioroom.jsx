import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FlyControls, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import DesktopUI from './DesktopUI';
import Overlay from './charoverlay';
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
const Model = ({ objPath, mtlPath, glbPath }) => {
  const [obj, setObj] = useState();
  const modelRef = useRef();
  const gltf = glbPath ? useGLTF(glbPath) : null;

  useEffect(() => {
    if (glbPath) return; // Skip OBJ/MTL loading if using GLB

    if (objPath && mtlPath) {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(mtlPath, (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objPath, (loadedObj) => {
          setObj(loadedObj);
        });
      });
    }
  }, [objPath, mtlPath, glbPath]);

  useEffect(() => {
    const targetObj = gltf?.scene || obj;
    if (targetObj && modelRef.current) {
      const arrowConfigs = {
        '10120_LCD_Computer_Monitor_v01': { direction: [0, 1, 0], color: 0xff0000 },
        'DumbbellRack.obj': { direction: [0, 1, 0], color: 0x00ff00 },
        'Body4': { direction: [0, 1, 0], color: 0x0000ff },
        // Add more mesh names as needed
      };

      modelRef.current.traverse((child) => {
        if (!child.isMesh) return;

        const config = arrowConfigs[child.name];
        if (!config) return;

        child.geometry.computeBoundingBox();
        const box = child.geometry.boundingBox;

        const center = new THREE.Vector3();
        box.getCenter(center);

        child.updateWorldMatrix(true, false);
        child.localToWorld(center);

        const offset = new THREE.Vector3(0, 5, 0);
        const origin = center.clone().add(offset);
        const direction = center.clone().sub(origin).normalize();

        const arrow = new THREE.ArrowHelper(direction, origin, 5, config.color);
        modelRef.current.add(arrow);

        console.log(`✅ Arrow for ${child.name} at`, center);
      });
    }
  }, [obj, gltf]);

  if (glbPath && gltf?.scene) {
    return <primitive ref={modelRef} object={gltf.scene} scale={1} position={[0, 0, 0]} />;
  }
  if (obj) {
    return <primitive ref={modelRef} object={obj} scale={1} position={[0, 0, 0]} />;
  }
  return null;
};


const CameraZoomHandler = ({ focusTarget }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (focusTarget && ZOOM_TARGETS[focusTarget]) {
      const { x, y, z, lookAt } = ZOOM_TARGETS[focusTarget];

      gsap.to(camera.position, {
        duration: 1.5,
        x,
        y,
        z,
        ease: 'power2.inOut',
                onUpdate: () => {
          if (lookAt) {
            camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
          }
        },
      });
    }
  }, [focusTarget]);

  return null;
};

// Main Scene
const Scene = () => {
  const [focusTarget, setFocusTarget] = useState('overview'); // Initial target
  const [tutorialStep, setTutorialStep] = useState(0);

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
      <Canvas shadows camera={{ position: [50, 95, 99] }}>
        <color attach="background" args={['orange']} />
        <ambientLight intensity={3} />
        <pointLight position={[30, 30, 30]} />
        <directionalLight position={[89, 400, 88]} intensity={1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
        <spotLight position={[100, 100, 100]} angle={0.3} penumbra={1} intensity={1} castShadow />


        <primitive object={testArrow} castShadow receiveShadow/>

        <Room />
        <Overlay />
        <Model key="PortfolioRoom2" objPath="/PortfolioRoom2.obj" mtlPath="/PortfolioRoom2.mtl" glbPath="portfolioroomimg.glb"/>
        <CameraZoomHandler focusTarget={focusTarget} />
        {/* <FlyControls movementSpeed={5} rollSpeed={0.5} dragToLook /> */}

        {focusTarget === 'monitor' && <Html transform position={[-110, 9.92, -4.6

        ]} rotation={[0, Math.PI / 2 , 0]}><DesktopUI /></Html>}


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
