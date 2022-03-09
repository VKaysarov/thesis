import './style.css';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as dat from 'dat.gui'
import { Player } from './Player/playerComponent';
import { initLight, initPlayer, initMouseLock } from './initHelpers';

// // Debug
// const gui = new dat.GUI()

// // Canvas
// const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
const controls = new PointerLockControls(camera, document.body);
const clock = new THREE.Clock();
const hitboxPlayer = initPlayer(scene);
// const points = [
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(-100, 100, 0)
// ];
// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// // CREATE THE LINE
// const line = new THREE.Line(
//         geometry,
//         new THREE.LineBasicMaterial({
//             color: 0x0000ff
//         }));
const dir = new THREE.Vector3(0, 0, -1);
// нормализуем вектор направления (конвертируем в вектор единичной длины)
dir.normalize();

const origin = new THREE.Vector3(0, 0, 0);
const length = 100;
const hex = 0xffff00;
const line = new THREE.ArrowHelper(dir, origin, length, hex);

// Objects
const objects = [];

let renderer;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

const LOADING_MANAGER = new THREE.LoadingManager();
const OBJ_LOADER = new OBJLoader(LOADING_MANAGER);

// Модель
OBJ_LOADER.load('./obj3.obj', (object) => {
    objects.push(object);
    scene.add(object);
});

function init() {
    camera.position.y = Player.height;
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    initLight(scene);
    initMouseLock(controls);

	scene.add(hitboxPlayer);
    scene.add(controls.getObject());
    scene.add(line);
	// const moveDistance = 200 * delta; // 200 pixels per second

    const onKeyDown = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                // hitboxPlayer.position.z += moveDistance;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':

                if (canJump === true) {
                    velocity.y += 350;
                }

                canJump = false;
                break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    const delta = clock.getDelta(); // seconds.
    // const vectorRight = new THREE.Vector3(1, 0, 0);
    // const vectorLeft = new THREE.Vector3(-1, 0, 0);
    const vectorForward = new THREE.Vector3(0, 0, -1);
    const vectorDown = new THREE.Vector3(0, -1, 0);
    const vectorUp = new THREE.Vector3(0, 1, 0);
    
    const axisY = new THREE.Vector3(0, 1, 0);
    const angle = Math.PI; // 180 градусов


    if (controls.isLocked === true) { // Если мышка захвачена
        let canMoveForward = true;
        let canMoveBackward = true;
        let canMoveLeft = true;
        let canMoveRight = true;
        // console.log( controls.getDirection(new THREE.Vector3(0, 1, 0)) );
        camera.getWorldDirection(vectorForward);

        const vectorBackward = vectorForward.clone();
        vectorBackward.applyAxisAngle(axisY, angle);
        const vectorRight = vectorForward.clone();
        vectorRight.applyAxisAngle(axisY, angle / -2);
        const vectorLeft = vectorForward.clone();
        vectorLeft.applyAxisAngle(axisY, angle / 2);

        // vectorForward.setY(hitboxPlayer.position.y);

        const raycasterRight = new THREE.Raycaster(hitboxPlayer.position, vectorRight);
        const raycasterLeft = new THREE.Raycaster(hitboxPlayer.position, vectorLeft);
        const raycasterForward = new THREE.Raycaster(hitboxPlayer.position, vectorForward);
        const raycasterBackward = new THREE.Raycaster(hitboxPlayer.position, vectorBackward);
        const raycasterDown = new THREE.Raycaster(hitboxPlayer.position, vectorDown);
        const raycasterUp = new THREE.Raycaster(hitboxPlayer.position, vectorUp);

        // const intersections = raycaster.intersectObjects(scene.children, true); // Находим пересечение луча с другими объектами
        const intersectionRight =  raycasterRight.intersectObjects(scene.children, true)
        const intersectionLeft =  raycasterLeft.intersectObjects(scene.children, true)
        const intersectionForward =  raycasterForward.intersectObjects(scene.children, true)
        const intersectionBackward =  raycasterBackward.intersectObjects(scene.children, true)
        const intersectionDown =  raycasterDown.intersectObjects(scene.children, true)

        // const intersectionUp =  raycasterUp.intersectObjects(scene.children, true)
        let onObject = false;
        
        if (intersectionDown.length > 0 && intersectionDown[0].distance <= 10) {
            onObject = true;
        }
        // if (intersectionUp.length > 0 && intersectionUp[0].distance <= 10) {
        //     canMoveUp = false;
        // }
        
        // const onObject = intersections.length > 0;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward && canMoveForward) {
            velocity.z -= 400.0 * delta;
        }

        if (moveBackward && canMoveBackward) {
            velocity.z += 400.0 * delta;
        }

        if (moveLeft && canMoveLeft) {
            velocity.x += 400.0 * delta;  
        }

        if (moveRight && canMoveRight) {
            velocity.x -= 400.0 * delta;  
        }

        if (onObject) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }
        
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        
        if (intersectionRight.length > 0 && intersectionRight[0].distance <= 10) {
            // hitboxPlayer.translateX(-1);
            controls.getObject().translateX(-1.2);
        }
        if (intersectionLeft.length > 0 && intersectionLeft[0].distance <= 10) {
            controls.getObject().translateX(1.2);
            // hitboxPlayer.translateX(1);
        }
        if (intersectionForward.length > 0 && intersectionForward[0].distance <= 10) {
            console.log("forward");
            controls.getObject().translateZ(1);
        }
        if (intersectionBackward.length > 0 && intersectionBackward[0].distance <= 10) {
            console.log("backward");
            controls.getObject().translateZ(-1.2);
        }

        hitboxPlayer.position.y += (velocity.y * delta);
        controls.getObject().position.y = hitboxPlayer.position.y + Player.height / 2;
        hitboxPlayer.position.x = controls.getObject().position.x;
        hitboxPlayer.position.z = controls.getObject().position.z;

        // line.position.set(hitboxPlayer.position.x, hitboxPlayer.position.y + 10, hitboxPlayer.position.z + 50);
        line.position.set(hitboxPlayer.position.x, controls.getObject().position.y, hitboxPlayer.position.z);
        line.setDirection(vectorForward)

        if (controls.getObject().position.y < Player.height) {
            velocity.y = 0;
            controls.getObject().position.y = Player.height;
            canJump = true;
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();
animate();