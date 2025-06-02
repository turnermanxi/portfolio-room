import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

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
  const materials = useLoader(MTLLoader, mtlPath);
  const obj = useLoader(OBJLoader, objPath, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return <primitive object={obj} scale={1} position={[0, 0, 0]} />;
};

// Main Scene
const Scene = () => {
  return (
    <div className="roomcanvas">
      <Canvas camera={{ position: [50, 95, 99] }}>
        <color attach="background" args={['orange']} />
        <ambientLight intensity={.8} />
        <pointLight position={[10, 10, 10]} />
      
        <Room />
        <Model objPath="/PortfolioRoom2.obj" mtlPath="/PortfolioRoom2.mtl" />
      
        <FlyControls movementSpeed={5} rollSpeed={0.5} dragToLook />
      </Canvas>
    </div>
  );
};

export default Scene;
