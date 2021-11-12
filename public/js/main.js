import { SceneController } from './SceneController.js';
import { ToroidToMugAnimation } from './animations/ToroidToMugAnimation.js';
import { HookedLoopsToTwoRingsAnimation } from './animations/HookedLoopsToTwoRingsAnimation.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdddddd );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
const canvasElement = document.querySelector('.canvasElement');
renderer.canvas = canvasElement
renderer.setSize( canvasElement.offsetWidth, canvasElement.offsetHeight * 0.9);
canvasElement.appendChild( renderer.domElement );

let animationSpeed = 0;

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const animate = function() {
	requestAnimationFrame( animate );

	controls.update();

	renderer.render( scene, camera );
}

const urlBasedAnimation = function(scene) {
	const url = window.location.href;
	const name = url.split('predefined-animations')[1].substr(1);

	let animation = null;

	switch(name)
	{
		case 'toroid-to-mug': animation = new ToroidToMugAnimation(scene); break;
		case 'resolve-hooked-loops': animation = new HookedLoopsToTwoRingsAnimation(scene); break; 
		default: alert("Animation was not found, please provide proper URL");
	}

	return animation;
}

const addMenuListeners = function(sceneController)
{
	const menu = document.querySelector('.menu');
	
	const rangeSlider = menu.querySelector('.form-range');
	const rangeIndicator = menu.querySelector('.rangeIndicator');
	const automaticAnimationButton = menu.querySelector('.btnRunAuto');
	const stepByStepAnimationButton = menu.querySelector('.btnRunStep');
	const stepIndicator = menu.querySelector('.stepIndicator');

	animationSpeed = rangeSlider.value; 
	rangeIndicator.value = rangeSlider.value + ' ms';

	let animation = null;

	rangeSlider.addEventListener('change', () => { animationSpeed = rangeSlider.value; rangeIndicator.value = rangeSlider.value + ' ms' });

	automaticAnimationButton.addEventListener('click', function() {
		stepByStepAnimationButton.disabled = true;
		// automaticAnimationButton.disabled = true;

		if(null !== animation)
		{
			animation.removeAllObjects(sceneController.scene);
		}

		animation = urlBasedAnimation(scene);

		if(null !== animation)
		{
			sceneController.loadAnimation(animation);
		}
		
		sceneController.startAnimation(animationSpeed);
	});

	let runningSteps = false;

	stepByStepAnimationButton.addEventListener('click', function() {
		automaticAnimationButton.disabled = true;

		if(null !== animation && false === runningSteps)
		{
			animation.removeAllObjects(sceneController.scene);
		}

		animation = urlBasedAnimation(scene);

		if(null !== animation && false === runningSteps)
		{
			sceneController.loadAnimation(animation);
		}

		runningSteps = true;

		sceneController.doAnimationStep();

		stepIndicator.max = sceneController.animation.getTotalAnimationSteps();
		stepIndicator.value = sceneController.animation.getCurrentAnimationStep()

		if(sceneController.isAnimationOver())
		{
			console.log('KONIEC');
			//runningSteps = false;
			animation.removeAllObjects(sceneController.scene);
			automaticAnimationButton.disabled = false;
			stepByStepAnimationButton.disabled = true;
		}
	});
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

	addMenuListeners(sceneController);

	// camera.position.z = 25;

	animate();
});