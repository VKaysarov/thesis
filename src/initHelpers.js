import * as THREE from 'three';
import { Player } from './Player/playerComponent';

export const initLight = (scene) => {
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);

    light.position.set(0.5, 1, 0.75);
    scene.add(light);
}

export const initPlayer = (scene) => {
	const cubeGeometry = new THREE.BoxGeometry(Player.width, Player.height, Player.depth, 4, 4, 4);
	const wireMaterial = new THREE.ShadowMaterial();
	const hitbox = new THREE.Mesh(cubeGeometry, wireMaterial);

	hitbox.position.set(0, Player.height / 2, 0);
    
    return hitbox;
}

export const initMouseLock = (controls) => {
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    
    instructions.addEventListener('click', () => {
        controls.lock();
    });
    
    controls.addEventListener('lock', () => {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    
    controls.addEventListener('unlock', () => {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });
}
