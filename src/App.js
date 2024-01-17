import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { proxy, useSnapshot } from 'valtio';
import { easing } from 'maath';
import './App.css';
import PropTypes from 'prop-types';

const material = new THREE.LineBasicMaterial({ color: 'white' });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.5, 0),
  new THREE.Vector3(0, 0.5, 0),
]);

const imageDescriptions = [
  {
    text: `
      <h2>MTGChart: A Visual Deck Builder Web Application</h2>
      <h3>Revolutionizing MTG Deck Visualization</h3>
      <p>A web application designed to transform how Magic: The Gathering players visualize and build their decks.</p>
      <p><strong>Key Features:</strong></p>
      <ul>
        <li>Interactive deck building interface</li>
        <li>Real-time Scryfall API integration for card data</li>
        <li>User-friendly card search and organization</li>
      </ul>
      <p><em>Developed using modern web technologies like React.js, Node.js, and Axios.</em></p>
      <p>
  Feel free to explore the 
  <a href='https://github.com/JakebGutierrez/mtg-chart' target='_blank' rel='noopener noreferrer' className='link-text'>
    Source Code
  </a>&nbsp;or check out the&nbsp;
  <a href='https://mtgchart.netlify.app/' target='_blank' rel='noopener noreferrer' className='link-text'>
    Live Demo
  </a>.
</p>
    `,
  },
  {
    text: 'web mpc info, why and how I built it, ',
    sourceUrl: 'https://github.com/JakebGutierrez/web-beat',
    demoUrl: 'https://webbeat.netlify.app/',
  },
  {
    text: 'tune sort info, why and how I built it, ',
    sourceUrl: 'https://github.com/JakebGutierrez/tune-sort',
    demoUrl: 'https://tunesort.netlify.app/',
  },
];

const DEFAULT_TEXT = `
  <h2>Hello world! I'm Jakeb</h2>

  <p>I like clean code and turning my weird app ideas into something tangible. I'm currently looking for job opportunities where I can make a difference.</p>
  
  <p>I've completed two internships in software engineering, where I learned a lot about tackling real-world tech challenges.</p>

  <p>When I'm not programming, I enjoy listening to and making music, reading and pondering.</p>

  <p>Check out my projects by clicking on their images. Each one showcases my skills and the story behind it. To return to this text, click on the image again.</p>

  <p>If you're interested in what I do or have an exciting project in mind, feel free to contact me through the links below.</p>
`;

const state = proxy({
  clicked: null,
  items: [1, 2, 3].map((u, index) => ({
    url: `/assets/${u}.jpg`,
    description: imageDescriptions[index],
  })),
  currentText: DEFAULT_TEXT,
});

function Minimap() {
  const ref = useRef();
  const scroll = useScroll();
  const { items } = useSnapshot(state);
  const { height } = useThree((state) => state.viewport);
  useFrame((state, delta) => {
    ref.current.children.forEach((child, index) => {
      const y = scroll.curve(
        index / items.length - 1.5 / items.length,
        4 / items.length,
      );
      easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta);
    });
  });
  return (
    <group ref={ref}>
      {items.map((_, i) => (
        <line
          key={i}
          geometry={geometry}
          material={material}
          position={[i * 0.06 - items.length * 0.03, -height / 2 + 0.6, 0]}
        />
      ))}
    </group>
  );
}

Item.propTypes = {
  index: PropTypes.number.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.arrayOf(PropTypes.number).isRequired,
  c: PropTypes.instanceOf(THREE.Color),
};

function Item({ index, position, scale, ...props }) {
  const ref = useRef();
  const scroll = useScroll();
  const { clicked, items } = useSnapshot(state); // Updated to use 'items' instead of 'urls'
  const [hovered, hover] = useState(false);
  const click = () => {
    if (state.clicked === index) {
      state.clicked = null;
      state.currentText = DEFAULT_TEXT;
    } else {
      state.clicked = index;
      state.currentText = items[index].description;
    }
  };
  const over = () => hover(true);
  const out = () => hover(false);
  useFrame((state, delta) => {
    const y = scroll.curve(
      index / items.length - 1.5 / items.length,
      4 / items.length,
    );
    easing.damp3(
      ref.current.scale,
      [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
      0.15,
      delta,
    );
    ref.current.material.scale[0] = ref.current.scale.x;
    ref.current.material.scale[1] = ref.current.scale.y;
    if (clicked !== null && index < clicked)
      easing.damp(ref.current.position, 'x', position[0] - 2, 0.15, delta);
    if (clicked !== null && index > clicked)
      easing.damp(ref.current.position, 'x', position[0] + 2, 0.15, delta);
    if (clicked === null || clicked === index)
      easing.damp(ref.current.position, 'x', position[0], 0.15, delta);
    easing.damp(
      ref.current.material,
      'grayscale',
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      0.15,
      delta,
    );
    easing.dampC(
      ref.current.material.color,
      hovered || clicked === index ? 'white' : '#aaa',
      hovered ? 0.3 : 0.15,
      delta,
    );
  });
  return (
    <Image
      ref={ref}
      {...props}
      position={position}
      scale={scale}
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  );
}

Items.propTypes = {
  w: PropTypes.number,
  gap: PropTypes.number,
};

function Items({ w = 1.5, gap = 0.15 }) {
  const { items } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;
  return (
    <ScrollControls
      horizontal
      damping={0.1}
      pages={(width - xW + items.length * xW) / width}
    >
      <Minimap />
      <Scroll>
        {items.map((item, i) => (
          <Item
            key={i}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[w, 4, 1]}
            url={item.url}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
}

// DescriptionWithLink.propTypes = {
//   description: PropTypes.shape({
//     text: PropTypes.string.isRequired,
//     sourceUrl: PropTypes.string.isRequired,
//     demoUrl: PropTypes.string.isRequired,
//   }).isRequired,
// };

// function DescriptionWithLink({ description }) {
//   const createMarkup = () => {
//     return { __html: description.text };
//   };

//   return (
//     <div>
//       <div dangerouslySetInnerHTML={createMarkup()} />
//       <p>
//         <a
//           href={description.sourceUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="link-text"
//         >
//           Source Code
//         </a>
//         <span className="link-separator">/</span>
//         <a
//           href={description.demoUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="link-text"
//         >
//           Live Demo
//         </a>
//       </p>
//     </div>
//   );
// }

export const App = () => {
  const snap = useSnapshot(state);

  return (
    <div>
      <div id="canvasContainer">
        <Canvas
        // ... Canvas configuration
        >
          <Items />
        </Canvas>
      </div>
      <div id="textContent">
        <h1>Jakeb Gutierrez</h1>
        <div className="text-container">
          {snap.clicked !== null ? (
            <div
              dangerouslySetInnerHTML={{
                __html: imageDescriptions[snap.clicked].text,
              }}
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: snap.currentText }} />
          )}
        </div>
      </div>
    </div>
  );
};
