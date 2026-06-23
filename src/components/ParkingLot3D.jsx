import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

// Low-poly 3D Car Model with exposed imperative handle to spin wheels
const CarModel = React.forwardRef(({ color = '#3b82f6' }, ref) => {
  const wheelRefs = useRef([]);

  // Expose wheel rotation function to the parent component
  React.useImperativeHandle(ref, () => ({
    spinWheels: (amount) => {
      wheelRefs.current.forEach((wheel) => {
        if (wheel) wheel.rotation.y += amount;
      });
    }
  }));

  const registerWheel = (el, idx) => {
    wheelRefs.current[idx] = el;
  };

  return (
    <group position={[0, 0.3, 0]}>
      {/* Wheels */}
      {/* Front Left */}
      <group position={[-0.75, -0.05, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={(el) => registerWheel(el, 0)}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
      </group>
      {/* Front Right */}
      <group position={[0.75, -0.05, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={(el) => registerWheel(el, 1)}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
      </group>
      {/* Rear Left */}
      <group position={[-0.75, -0.05, -1.0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={(el) => registerWheel(el, 2)}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
      </group>
      {/* Rear Right */}
      <group position={[0.75, -0.05, -1.0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={(el) => registerWheel(el, 3)}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
      </group>

      {/* Main Body */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 3.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Cabin / Roof */}
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[1.2, 0.45, 1.6]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Windows */}
      {/* Windshield */}
      <mesh position={[0, 0.62, 0.62]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[1.16, 0.4, 0.05]} />
        <meshStandardMaterial color="#111827" roughness={0.1} transparent opacity={0.9} />
      </mesh>
      {/* Rear Window */}
      <mesh position={[0, 0.62, -1.02]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.16, 0.4, 0.05]} />
        <meshStandardMaterial color="#111827" roughness={0.1} transparent opacity={0.9} />
      </mesh>
      {/* Left Windows */}
      <mesh position={[-0.61, 0.6, -0.2]}>
        <boxGeometry args={[0.02, 0.35, 1.4]} />
        <meshStandardMaterial color="#111827" roughness={0.1} transparent opacity={0.9} />
      </mesh>
      {/* Right Windows */}
      <mesh position={[0.61, 0.6, -0.2]}>
        <boxGeometry args={[0.02, 0.35, 1.4]} />
        <meshStandardMaterial color="#111827" roughness={0.1} transparent opacity={0.9} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.5, 0.2, 1.61]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fffbeb" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.5, 0.2, 1.61]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fffbeb" emissiveIntensity={1.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.5, 0.2, -1.61]}>
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.5, 0.2, -1.61]}>
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
});

// Wrapper to animate the car driving in/out
const AnimatedCar = ({ isOccupied, color }) => {
  const groupRef = useRef();
  const carRef = useRef();
  const positionZRef = useRef(isOccupied ? 0.0 : 6.0);
  const [visible, setVisible] = useState(isOccupied);

  useEffect(() => {
    if (isOccupied) {
      setVisible(true);
      // Spawn at the back/driveway if it was hidden
      if (positionZRef.current >= 5.9) {
        positionZRef.current = 6.0;
      }
    }
  }, [isOccupied]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Local target Z position: 0 is fully parked, 6 is in the driveway
    const targetZ = isOccupied ? 0.0 : 6.0;
    const diff = targetZ - positionZRef.current;

    if (Math.abs(diff) > 0.005) {
      // Lerp position frame-rate independently
      const speed = 4.5 * delta;
      const step = diff * Math.min(speed, 1.0);
      positionZRef.current += step;
      groupRef.current.position.z = positionZRef.current;

      // Spin the wheels based on direction/step size
      if (carRef.current) {
        const spinAmount = step * 4;
        carRef.current.spinWheels(spinAmount);
      }
    } else {
      // Snap to exact target
      positionZRef.current = targetZ;
      groupRef.current.position.z = targetZ;

      // Hide and unmount if the car fully drove away
      if (!isOccupied && visible) {
        setVisible(false);
      }
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0, positionZRef.current]}>
      <CarModel ref={carRef} color={color} />
    </group>
  );
};

// Individual Parking Spot Component
const ParkingSpot = ({
  id,
  label,
  position,
  rotation = [0, 0, 0],
  status = 'empty',
  carColor = '#3b82f6',
  width = 2.2,
  length = 4.5,
  onToggle
}) => {
  const isOccupied = status === 'occupied';
  const ledColor = isOccupied ? '#ef4444' : '#10b981';

  return (
    <group position={position} rotation={rotation}>
      {/* Clickable floor region */}
      <mesh
        position={[0, 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggle && onToggle(id);
        }}
      >
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial transparent opacity={0.02} color={isOccupied ? '#fee2e2' : '#d1fae5'} />
      </mesh>

      {/* Painted Position Number (e.g. 01 - 12) */}
      <Text
        position={[0, 0.012, length / 2 - 0.75]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#111827"
        opacity={0.7}
        transparent
      >
        {(id + 1).toString().padStart(2, '0')}
      </Text>

      {/* Position Label (e.g. L1, B3, R2) */}
      <Text
        position={[0, 0.012, length / 2 - 1.25]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.22}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        opacity={0.6}
        transparent
      >
        {label}
      </Text>

      {/* White lines: Left border */}
      <mesh position={[-width / 2, 0.015, 0]}>
        <boxGeometry args={[0.08, 0.01, length]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* White lines: Right border */}
      <mesh position={[width / 2, 0.015, 0]}>
        <boxGeometry args={[0.08, 0.01, length]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* White lines: Back border */}
      <mesh position={[0, 0.015, -length / 2]}>
        <boxGeometry args={[width, 0.01, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* LED Indicator Post & Light */}
      <group position={[0, 0, -length / 2 + 0.15]}>
        {/* Metal pole */}
        <mesh position={[-width / 2 + 0.15, 1.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.5} metalness={0.7} />
        </mesh>

        {/* Horizontal arm */}
        <mesh position={[-width / 4 + 0.075, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, width / 2, 8]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.5} metalness={0.7} />
        </mesh>

        {/* LED Housing */}
        <mesh position={[0, 2.15, 0]}>
          <boxGeometry args={[0.16, 0.08, 0.16]} />
          <meshStandardMaterial color="#374151" roughness={0.4} />
        </mesh>

        {/* LED light sphere */}
        <mesh position={[0, 2.08, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color={ledColor}
            emissive={ledColor}
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>

        {/* Glow light casting down on spot */}
        <pointLight
          position={[0, 1.9, 0]}
          color={ledColor}
          intensity={1.0}
          distance={3.5}
          decay={1.8}
        />
      </group>

      {/* Animated Car component */}
      <AnimatedCar isOccupied={isOccupied} color={carColor} />
    </group>
  );
};

// Flashing Emergency Light component for Fire Alarm
const AlarmLights = ({ fire }) => {
  const lightRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!lightRef.current) return;
    if (fire) {
      timeRef.current += delta * 6; // flash speed
      const pulse = (Math.sin(timeRef.current) + 1) / 2; // oscillates 0 to 1
      lightRef.current.intensity = pulse * 2.0;
    } else {
      lightRef.current.intensity = 0;
    }
  });

  return <ambientLight ref={lightRef} color="#ef4444" intensity={0} />;
};

// Main ParkingLot3D Canvas component
const ParkingLot3D = ({ slots = [], onToggleSlot, alarmState = { fire: false, full: false } }) => {
  // Define layout configurations for 12 U-shaped spots
  // Spacings are perfectly configured to avoid overlap
  const spotLayouts = [
    // Left row (vertical arm of U): indices 0 to 3
    { id: 0, label: 'L1', position: [-6.5, 0, -4.5], rotation: [0, Math.PI / 2, 0] },
    { id: 1, label: 'L2', position: [-6.5, 0, -2.0], rotation: [0, Math.PI / 2, 0] },
    { id: 2, label: 'L3', position: [-6.5, 0, 0.5], rotation: [0, Math.PI / 2, 0] },
    { id: 3, label: 'L4', position: [-6.5, 0, 3.0], rotation: [0, Math.PI / 2, 0] },

    // Right row (vertical arm of U): indices 4 to 7
    { id: 4, label: 'R1', position: [6.5, 0, -4.5], rotation: [0, -Math.PI / 2, 0] },
    { id: 5, label: 'R2', position: [6.5, 0, -2.0], rotation: [0, -Math.PI / 2, 0] },
    { id: 6, label: 'R3', position: [6.5, 0, 0.5], rotation: [0, -Math.PI / 2, 0] },
    { id: 7, label: 'R4', position: [6.5, 0, 3.0], rotation: [0, -Math.PI / 2, 0] },

    // Bottom row (base of U): indices 8 to 11
    { id: 8, label: 'B1', position: [-3.75, 0, 6.5], rotation: [0, Math.PI, 0] },
    { id: 9, label: 'B2', position: [-1.25, 0, 6.5], rotation: [0, Math.PI, 0] },
    { id: 10, label: 'B3', position: [1.25, 0, 6.5], rotation: [0, Math.PI, 0] },
    { id: 11, label: 'B4', position: [3.75, 0, 6.5], rotation: [0, Math.PI, 0] },
  ];

  const fireActive = alarmState?.fire;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
      <Canvas shadows>
        {/* Bird-eye view camera (angled top-down view) */}
        <PerspectiveCamera makeDefault position={[0, 16, 12]} fov={50} />

        {/* Alarm lighting layer */}
        <AlarmLights fire={fireActive} />

        {/* Ambient environment lighting (dimmed if fire alarm is active) */}
        <ambientLight intensity={fireActive ? 0.12 : 0.5} color="#e0f2fe" />

        {/* Directional light to simulate sunlight and cast shadows (dimmed during fire alarm) */}
        <directionalLight
          position={[10, 20, 10]}
          intensity={fireActive ? 0.25 : 1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />

        {/* Soft fill light */}
        <directionalLight position={[-10, 15, -10]} intensity={fireActive ? 0.05 : 0.4} color="#7dd3fc" />

        {/* Gray Base Box */}
        <mesh position={[0, -0.25, 0.5]} receiveShadow castShadow>
          <boxGeometry args={[20, 0.5, 16]} />
          <meshStandardMaterial color="#374151" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Roadway markings in the center driveway */}
        {/* Driveway center line (U-shape) */}
        <group position={[0, 0.01, 0.5]}>
          {/* Main vertical center lane line */}
          <mesh position={[0, 0, -2.5]}>
            <boxGeometry args={[0.1, 0.005, 7.5]} />
            <meshStandardMaterial color="#fef08a" roughness={0.8} />
          </mesh>

          {/* Bottom horizontal center lane line */}
          <mesh position={[0, 0, 2.5]}>
            <boxGeometry args={[9.5, 0.005, 0.1]} />
            <meshStandardMaterial color="#fef08a" roughness={0.8} />
          </mesh>

          {/* Arrow markings */}
          {/* Entry Arrow pointing down */}
          <group position={[0, 0.005, -5.0]} scale={[0.8, 0.8, 0.8]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.005, 1.2]} />
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </mesh>
            <mesh position={[-0.25, 0, 0.35]} rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.15, 0.005, 0.6]} />
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </mesh>
            <mesh position={[0.25, 0, 0.35]} rotation={[0, -Math.PI / 4, 0]}>
              <boxGeometry args={[0.15, 0.005, 0.6]} />
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </mesh>
          </group>
        </group>

        {/* 12 U-shaped Parking Spots */}
        {spotLayouts.map((spot) => {
          const slotState = slots.find((s) => s.id === spot.id) || {
            status: 'empty',
            carColor: '#3b82f6',
          };
          return (
            <ParkingSpot
              key={spot.id}
              id={spot.id}
              label={spot.label}
              position={spot.position}
              rotation={spot.rotation}
              status={slotState.status}
              carColor={slotState.carColor}
              onToggle={onToggleSlot}
            />
          );
        })}

        {/* Grid helper on the bottom surrounding area for premium depth look */}
        <gridHelper args={[60, 60, '#4b5563', '#1f2937']} position={[0, -0.5, 0]} />

        {/* Orbit controls for exploration */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1} // Prevent looking from below
          minDistance={8}
          maxDistance={30}
        />
      </Canvas>

      {/* Floating tooltip/instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          color: '#f8fafc',
          padding: '10px 20px',
          borderRadius: '9999px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none',
          textAlign: 'center',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}
      >
        <span style={{ color: '#38bdf8' }}>🖱️ Drag</span> to rotate | 
        <span style={{ color: '#38bdf8' }}>🔍 Scroll</span> to zoom | 
        <span style={{ color: '#10b981' }}>👆 Click spot</span> to toggle state
      </div>
    </div>
  );
};

export default ParkingLot3D;
