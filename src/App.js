import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { easing } from 'maath'

const material = new THREE.LineBasicMaterial({ color: 'white' })
const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)])
const state = proxy({
  clicked: null,
  urls: [1, 2, 3, 4, 5].map((u) => `/${u}.jpg`)
})

function Minimap() {
  const ref = useRef()
  const scroll = useScroll()
  const { urls } = useSnapshot(state)
  const { height } = useThree((state) => state.viewport)
  useFrame((state, delta) => {
    ref.current.children.forEach((child, index) => {
      // Give me a value between 0 and 1
      //   starting at the position of my item
      //   ranging across 4 / total length
      //   make it a sine, so the value goes from 0 to 1 to 0.
      const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
      easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta)
    })
  })
  return (
    <group ref={ref}>
      {urls.map((_, i) => (
        <line key={i} geometry={geometry} material={material} position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]} />
      ))}
    </group>
  )
}

function Item({ index, position, scale, c = new THREE.Color(), ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const { clicked, urls } = useSnapshot(state)
  const [hovered, hover] = useState(false)
  const click = () => (state.clicked = index === clicked ? null : index)
  const over = () => hover(true)
  const out = () => hover(false)
  useFrame((state, delta) => {
    const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
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
  const { urls } = useSnapshot(state)
  const { width } = useThree((state) => state.viewport)
  const xW = w + gap
  return (
    <ScrollControls horizontal damping={0.1} pages={(width - xW + urls.length * xW) / width}>
      <Minimap />
      <Scroll>
        {urls.map((url, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 1]} url={url} />) /* prettier-ignore */}
      </Scroll>
    </ScrollControls>
  )
}

export const App = () => (
  <div>
    <div id="canvasContainer">
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} onPointerMissed={() => (state.clicked = null)}>
        <Items />
      </Canvas>
    </div>
    <div id="textContent">
      {/* Add your text content here */}
      <h1>Welcome to My Portfolio</h1>
      <p>一線んで東91関どー人第応ち性務ホムノ隊毎ばてと察南ヱ粉応ネ済自ゆかス問荒オ要販にびひ害板やうが厳陛るいせ替歳部ヘクヤム際郎若不ル。個析レはし用金ツヌカキ塩閣督おどんこ報92釣てそめ示89音陸手シ器出をしち世通偵叫づやわ。並こざお調区リシソ閣本そるは奈需づをる雄卵モ夜関がごとせ集変済ゃの経録ケ緒過シオフ政定テ宝行スコニエ恭2増そふク久会ニムサ芸復ラヘナモ写掃邸がえこ。</p>
      <p>情ノ策世ずろぼ緑静ヌルケ毎動フほきス宮済米カケリ普右ゆぱ規月頭ワチミル載46憲92禁りのクぜ方知ノサ岡原ハネム非会サクロネ東再年夕罪ゅれけも。1渡会まっ濃環ゃし婚務融ヲコホ断家ぴっゆ解委ラ法98確ドめレ界度へ究関われだえ全細亭匠國べ。広新ふす星請交クむぽ更想やンわ承作テモ転津のう伏話ワヘ点渡汁ヲセ公室素ぎドま区俣妃巳惧ふこれぜ。</p>
      <p>出ヌヤメ全紙ぶわ更接ずや副姿ツム道傷ヨチマソ評上レムニ頭園ぞぜ大買レへす都題48国ナヒネ会務必タマスル約藝でん月督積畑はまやき。禁ヒニコリ暮類づ生情的ざ身労2涯ばがトな設業コ表届ノヨ人場ばべゅ化談型ンにもぜ止侃凸塀レぐリフ。抗ヒチヱ説口ソネニク部荒げゃク聞著ナノセカ対市択キケウア有2年みゃ到89見将りトドさ給琴ぼんく捜同ンむぜご案敗31分っけぐど算指のもなど頂天ハネ歌不ば。</p>
      {/* ... more content */}
    </div>
  </div>
);