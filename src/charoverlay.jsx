import React, { Suspense, useRef, useEffect } from "react";  
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from 'three'
import "./charoverlay.css";
import useFBX from "./useFBXLoader"; // Assuming you have a custom hook for loading FBX models

function Character() {
  const model = useFBX('/Idle1.fbx') // path to your FBX file
  const mixer = useRef();

  useEffect(() => {
    if (model.animations.length) {
      mixer.current = new THREE.AnimationMixer(model)
      const action = mixer.current.clipAction(model.animations[0])
      action.play()
    }
  }, [model])

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta)
  })

  return (
    <primitive
      object={model}
      scale={0.04} // FBX files are often huge, so scale down
      position={[0, -6.4, 0]}
    />
  )
}

const Overlay = ({ hp = 75, maxHp = 100, exp = 30, maxExp = 100, funny = 87, age = 30, power = "Gravity" }) => {
  const hpPercent = (hp / maxHp) * 100;
  const expPercent = (exp / maxExp) * 100;
  const funnyPercent = funny; // assume 0-100 scale

  return (
    <Html fullscreen>
      <div className="overlay-container">
        <div className="overlay-character">
          <div className="char-placeholder">
            <Canvas camera={{ position: [0, .5, 2.5], fov: 35 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 5, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <Character />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
          </div>
        </div>
        <div className="overlay-bars">
          <div className="bar-group">
            <label>HP</label>
            <div className="bar">
              <div className="fill hp" style={{ width: `${hpPercent}%` }} />
            </div>
          </div>
          <div className="bar-group">
            <label>EXP</label>
            <div className="bar">
              <div className="fill exp" style={{ width: `${expPercent}%` }} />
            </div>
          </div>
          <div className="bar-group">
            <label>FUNNY</label>
            <div className="bar">
              <div className="fill funny" style={{ width: `${funnyPercent}%` }} />
            </div>
          </div>
        </div>
        <div className="overlay-info">
          <span>Age: {age}</span>
          <span>Power: {power}</span>
        </div>
      </div>
    </Html>
  );
};

export default Overlay;