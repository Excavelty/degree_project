import { SceneController } from './SceneController.js';
import { ToroidToMugAnimation } from './animations/ToroidToMugAnimation.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdddddd );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
const canvasElement = document.querySelector('.canvasElement');
renderer.canvas = canvasElement
renderer.setSize( window.innerWidth * 0.8, window.innerHeight * 0.8);
canvasElement.appendChild( renderer.domElement );

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const animate = function() {
	requestAnimationFrame( animate );

	controls.update();

	renderer.render( scene, camera );
}

document.addEventListener('DOMContentLoaded', function() {
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	scene.background = new THREE.Color(0xaaaaaa);

	const sceneController = SceneController.FromSceneCameraAndOrbitControls(scene, camera, controls);

	sceneController.setCameraPosition(new THREE.Vector3(32.39511881197365, -8.31, 10.32));
	sceneController.setCameraRotation(new THREE.Vector3(0.68, 1.18, -0.64));

	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, 25, 0));
	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(-25, 25, 0));
	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, -25, 0));

	const animation = new ToroidToMugAnimation(scene);

	sceneController.loadAnimation(animation);
    sceneController.startAnimation(100);
		
	// camera.position.z = 25;

	animate();
});