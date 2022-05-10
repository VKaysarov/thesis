import * as THREE from 'three';

// World configuration
export const worldComponent = {
    mouseCoords: new THREE.Vector2(),
    raycaster: new THREE.Raycaster(),
    ballMaterial: new THREE.MeshPhongMaterial({ color: 0x202020 }),
    clock: new THREE.Clock(),
    // textureLoader: ,
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000),
    // controls: ,
    scene: new THREE.Scene(),
    pos: new THREE.Vector3(),
    renderer: new THREE.WebGLRenderer(),
    // container: ,
    // stats: new Stats(),
}