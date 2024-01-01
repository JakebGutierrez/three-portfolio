import React, { useState, useEffect, useRef } from 'react'; // Add useRef here
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { proxy, useSnapshot } from 'valtio';
import { easing } from 'maath';
import './App.css';


const material = new THREE.LineBasicMaterial({ color: 'white' })
const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)])


const imageDescriptions = [
  "Description for Image 1",
  "Description for Image 2",
  "Description for Image 3",
  "Description for Image 4",
  "Description for Image 5"
];


const state = proxy({
  clicked: null,
  items: [1, 2, 3, 4, 5].map((u, index) => ({ url: `/${u}.jpg`, description: imageDescriptions[index] })),
  currentText: "About Me", // Default text
});



function Minimap() {
  const ref = useRef();
  const scroll = useScroll();
  const { items } = useSnapshot(state);
  const { height } = useThree((state) => state.viewport);
  useFrame((state, delta) => {
    ref.current.children.forEach((child, index) => {
      const y = scroll.curve(index / items.length - 1.5 / items.length, 4 / items.length);
      easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta);
    });
  });
  return (
    <group ref={ref}>
      {items.map((_, i) => (
        <line key={i} geometry={geometry} material={material} position={[i * 0.06 - items.length * 0.03, -height / 2 + 0.6, 0]} />
      ))}
    </group>
  );
}


function Item({ index, position, scale, c = new THREE.Color(), ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const { clicked, items } = useSnapshot(state);  // Updated to use 'items' instead of 'urls'
  const [hovered, hover] = useState(false)
  const click = () => {
    if (state.clicked === index) {
      state.clicked = null;
      state.currentText = "About Me"; // Reset to default text
    } else {
      state.clicked = index;
      state.currentText = items[index].description;
    }
  };
  const over = () => hover(true)
  const out = () => hover(false)
  useFrame((state, delta) => {
    const y = scroll.curve(index / items.length - 1.5 / items.length, 4 / items.length);
    easing.damp3(ref.current.scale, [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1], 0.15, delta)
    ref.current.material.scale[0] = ref.current.scale.x
    ref.current.material.scale[1] = ref.current.scale.y
    if (clicked !== null && index < clicked) easing.damp(ref.current.position, 'x', position[0] - 2, 0.15, delta)
    if (clicked !== null && index > clicked) easing.damp(ref.current.position, 'x', position[0] + 2, 0.15, delta)
    if (clicked === null || clicked === index) easing.damp(ref.current.position, 'x', position[0], 0.15, delta)
    easing.damp(ref.current.material, 'grayscale', hovered || clicked === index ? 0 : Math.max(0, 1 - y), 0.15, delta)
    easing.dampC(ref.current.material.color, hovered || clicked === index ? 'white' : '#aaa', hovered ? 0.3 : 0.15, delta)
  })
  return <Image ref={ref} {...props} position={position} scale={scale} onClick={click} onPointerOver={over} onPointerOut={out} />
}

function Items({ w = 1.5, gap = 0.15 }) {
  const { items } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;
  return (
    <ScrollControls horizontal damping={0.1} pages={(width - xW + items.length * xW) / width}>
      <Minimap />
      <Scroll>
        {items.map((item, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 1]} url={item.url} />)}
      </Scroll>
    </ScrollControls>
  );
}


export const App = () => {
  const snap = useSnapshot(state);

  return (
    <div>
      <div id="canvasContainer">
        <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} onPointerMissed={() => (state.clicked = null)}>
          <Items />
        </Canvas>
      </div>
      <div id="textContent">
        <h1>Welcome to My Portfolio</h1>
        <div>
          {snap.currentText}
        </div>
      </div>
    </div>
  );
};
