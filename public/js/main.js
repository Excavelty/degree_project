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

const description = document.createElement('div');
description.classList += 'alert alert-warning';
description.textContent = 'Choose animation speed and press button to run animation automatically or use "Run next step" button to run animation step by step and notice progress \
on the slider. Pressing reset animation\
will reset animation and will enable rerunning it on same or different way. During running animation description of ongoing steps will be displayed. Remember that you may use your \
mouse to move the camera and look at object from different angles. You may also scroll to move closer to the object.';
canvasElement.appendChild(description);

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
	const restartButton = menu.querySelector('.btnRestart');

	animationSpeed = rangeSlider.value; 
	rangeIndicator.value = rangeSlider.value + ' ms';

	let animation = null;

	rangeSlider.addEventListener('change', () => { animationSpeed = rangeSlider.value; rangeIndicator.value = rangeSlider.value + ' ms' });

	automaticAnimationButton.addEventListener('click', function() {
		stepByStepAnimationButton.disabled = true;
		automaticAnimationButton.disabled = true;

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
			animation.removeAllObjects(sceneController.scene);
			stepByStepAnimationButton.disabled = true;
		}
	});

	restartButton.addEventListener('click', function() {
		if(null !== animation && undefined !== animation)
		{
			automaticAnimationButton.disabled = false;
			stepByStepAnimationButton.disabled = false;

			sceneController.stopAnimation();
			sceneController.animation.removeAllObjects(sceneController.scene);
			sceneController.animation = null;
			runningSteps = false;
			stepIndicator.value = 1;
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