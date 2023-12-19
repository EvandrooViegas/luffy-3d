import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, extend, useThree, ThreeElements } from "react-three-fiber";
import { useLoader } from "@react-three/fiber";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

extend({ OrbitControls });

const mapPercentageToRotation = (percentage: number) => {
  // Map percentage to Y-rotation in radians (0% -> 0 radians, 100% -> 2 * Math.PI radians)
  return (percentage / 100) * 2 * Math.PI;
};

function Model({ rotation }: { rotation: number }) {
  const modelRef = useRef<ThreeElements["primitive"]>(null)
  const fbx = useLoader(
    FBXLoader,
    "/luffy.fbx"
  );
  const scale = 20
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.z = mapPercentageToRotation(rotation);
    }
    modelRef.current?.scale.set(scale, scale, scale);
  });
  return <primitive ref={modelRef} object={fbx} />;
}


const App: React.FC = () => {
  const wHeight = window.innerHeight * 4
  const [rotation, setRotation] = useState(0)
  const onScroll = () => {
    const scrollY = window.scrollY
    const per = ((scrollY / wHeight) * 2) * 100
    setRotation(per > 100 ? 100 : per)
  }
  useEffect(() => {
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <div style={{ height: wHeight }}>
      <div className="canva-z" style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0 }}>
        <div className="canva-z" style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", }}>
          <div style={{ fontSize: "7vw", fontStyle: "italic", fontWeight: "bolder",  color: "rgba(255, 255, 0, 0.7)" }}>
            ONE PIECE
          </div>
          <a href="https://www.upwork.com/freelancers/~01e890f4e0779c8147" className="canva-foreground-z" target="_blank">
            <div style={{ fontSize: "0.9vw", fontStyle: "italic", fontWeight: "bolder", textDecoration: "underline", color: "rgba(255, 255, 255, 0.6)" }}>
              @EvandroViegas
            </div>
          </a>
        </div>
        <Canvas style={{ background: "black" }}>
          <ambientLight />
          <directionalLight position={[0, 0, 0]} intensity={100} />
          <Suspense fallback={"Loading..."}>
            <Model rotation={rotation} />
            <RotateControls />
            <Environment background preset="dawn" blur={0}  />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

const RotateControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    controlsRef.current?.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableRotate
      autoRotate
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 5} // Limit rotation from the top
      maxPolarAngle={Math.PI / 0} // Limit rotation from the bottom
    />
  );
};
export default App;