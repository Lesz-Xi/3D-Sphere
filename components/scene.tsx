"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Ball from "./ball";
import Sphere from "./sphere";
import {
  RigidBody,
  TrimeshCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";

// Type for ball position data
type BallData = {
  position: [number, number, number];
  color: string;
};

export default function Scene() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  let rotationX = 0;
  let rotationY = 0;

  useFrame((_, delta) => {
    if (rigidBodyRef.current) {
      const rotationEuler = new THREE.Euler(rotationX, rotationY, 0);
      const rotationQuaternion = new THREE.Quaternion().setFromEuler(
        rotationEuler
      );
      rigidBodyRef.current.setNextKinematicRotation(rotationQuaternion);
      rotationX += delta * 2;
      rotationY += delta * 0.8;
    }
  });

  // Define ball colors
  const ballColors = [
    "#CCCCCC",
    "#CCCCCC",
    "#CCCCCC",
    "#CCCCCC",
    "#CCCCCC",
    "#CCCCCC",
  ];

  // Create positions for balls in a compact arrangement
  const generateBallPositions = (): BallData[] => {
    const positions: BallData[] = [];
    const ballRadius = 0.2;
    const minDistance = ballRadius * 2.1; // Minimum distance between ball centers to avoid overlap
    const maxAttempts = 100; // Maximum attempts to place a ball
    const maxRadius = 0.8; // Maximum distance from center

    // Helper function to check if a position is too close to existing positions
    const isTooClose = (
      pos: [number, number, number],
      existingPositions: BallData[]
    ) => {
      return existingPositions.some((existingPos: BallData) => {
        const dx = pos[0] - existingPos.position[0];
        const dy = pos[1] - existingPos.position[1];
        const dz = pos[2] - existingPos.position[2];
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        return distanceSquared < minDistance * minDistance;
      });
    };

    // Generate 1 positions for each color (18 total)
    ballColors.forEach((color) => {
      for (let i = 0; i < 1; i++) {
        let attempts = 0;
        let position: [number, number, number];

        // Try to find a valid position
        do {
          // Start with positions closer to center
          const radius = Math.random() * maxRadius;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);

          position = [
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi),
          ] as [number, number, number];

          attempts++;
        } while (isTooClose(position, positions) && attempts < maxAttempts);

        // Add the position with its color
        positions.push({ position, color });
      }
    });

    return positions;
  };

  const balls = generateBallPositions();

  const { vertices, indices } = useMemo(() => {
    const geometry = new THREE.SphereGeometry(2, 32, 32);

    // Invert the faces by reversing the winding order
    if (geometry.index) {
      const indices = geometry.index.array;
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i];
        indices[i] = indices[i + 2];
        indices[i + 2] = a;
      }

      return {
        vertices: geometry.attributes.position.array,
        indices: indices,
      };
    }

    // Fallback if index is null
    return {
      vertices: geometry.attributes.position.array,
      indices: new Uint16Array(),
    };
  }, []);

  return (
    <>
      {balls.map((ball, index) => (
        <Ball key={index} position={ball.position} color={ball.color} />
      ))}
      <RigidBody
        colliders={false}
        restitution={0.7}
        friction={0.5}
        ref={rigidBodyRef}
        type="kinematicPosition"
      >
        <Sphere />
        <TrimeshCollider args={[vertices, indices]} />
      </RigidBody>
    </>
  );
}
