"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment } from "@react-three/drei";
import { EffectComposer, Outline, Bloom } from "@react-three/postprocessing";
import Scene from "./scene";

export default function Main() {
  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <Environment preset="studio" />
        <Physics gravity={[0, -9.81, 0]}>
          <Scene />
        </Physics>
        <EffectComposer>
          <Outline
            edgeStrength={5}
            visibleEdgeColor={0xffffff}
            hiddenEdgeColor={0x22090a}
            width={1024}
            height={1024}
          />
          <Bloom
            intensity={1.5}
            kernelSize={3}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.4}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
