import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')

const cubeTextureLoader = new THREE.CubeTextureLoader()


const environmentMapTexture = cubeTextureLoader.load([
    'textures/environmentMap/px.png',
    'textures/environmentMap/nx.png',
    'textures/environmentMap/py.png',
    'textures/environmentMap/ny.png',
    'textures/environmentMap/pz.png',
    'textures/environmentMap/nz.png'
])


/**
 * Fonts
 */
const fontLoader = new FontLoader()



const rainDropMaterial = new THREE.MeshBasicMaterial()
rainDropMaterial.metalness = 0.7
rainDropMaterial.roughness = 0.2
// gui.add(rainDropMaterial, 'metalness').min(0).max(1).step(0.0001)
// gui.add(rainDropMaterial, 'roughness').min(0).max(1).step(0.0001)

rainDropMaterial.envMap = environmentMapTexture

const rainDropGeometry = new THREE.SphereBufferGeometry(0.1, 64,64)

const animateRainDrop = (rainDrop)  => {
    rainDrop.position.x = (Math.random() - 0.5) * 20
    rainDrop.position.y = (Math.random() - 0.5) * 10
    rainDrop.position.z = (Math.random() - 0.5) * 20
    const scale = Math.random()
    rainDrop.scale.set(scale, scale, scale)
    
    gsap.to(rainDrop.position, { duration: Math.random()*4, delay: 0, y:-10, onComplete: () => animateRainDrop(rainDrop) })
}

for(let i = 0; i < 1000; i++)
    {
        const rainDrop = new THREE.Mesh(rainDropGeometry, rainDropMaterial)
        animateRainDrop(rainDrop)
        
        scene.add(rainDrop)
    }

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()