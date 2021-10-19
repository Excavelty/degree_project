import { SceneController } from './SceneController.js';
import { ToroidToMugAnimation } from './animations/ToroidToMugAnimation.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdddddd );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const objects = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const animate = function() {
	requestAnimationFrame( animate );

	controls.update();

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( objects )

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0x00ff00 );
		console.log(intersects[i]);
		intersects[ i ].object.geometry.colorsNeedUpdate = true;
	}

	renderer.render( scene, camera );
}

function readMousePos(event)
{
	console.log('klik klik');
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	console.log('Tu jetem:' +  mouse);
}

document.addEventListener('pointerdown', readMousePos, false);

document.addEventListener('DOMContentLoaded', function() {
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	scene.background = new THREE.Color(0xaaaaaa);

	const sceneController = SceneController.FromSceneCameraAndOrbitControls(scene, camera, controls);

	//sceneController.setCameraPosition(new THREE.Vector3(32.39511881197365, -8.31, 10.32));
	//sceneController.setCameraRotation(new THREE.Vector3(0.68, 1.18, -0.64));

	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, 25, 0));
	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(-25, 25, 0));
	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, -25, 0));

	//const animation = new ToroidToMugAnimation(scene);

	//sceneController.loadAnimation(animation);
    //sceneController.startAnimation(100);

	// this material causes a mesh to use colors assigned to faces
	var faceColorMaterial = new THREE.MeshBasicMaterial( 
		{ color: 0xffffff, vertexColors: THREE.VertexColors} );
		
		var sphereGeometry = new THREE.SphereGeometry( 10, 32, 32 );
		sphereGeometry = sphereGeometry.toNonIndexed();

		let colors = new Float32Array(sphereGeometry.getAttribute('position').count * 3);

		sphereGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const colorAttr = sphereGeometry.getAttribute('color');

		for ( var i = 0; i < sphereGeometry.getAttribute('color').count * 3; i += 3) 
		{
			const value = 0.8 * Math.random() + 0.2;
			colorAttr.array[i] = value;
			colorAttr.array[i + 1] = 0.6 * Math.random() + 0.2;
			colorAttr.array[i + 2] = 0;
		}

		var sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );
		// scene.add(sphere);
	 	
		const geometry = new THREE.BufferGeometry();
		// create a simple square shape. We duplicate the top left and bottom right
		// vertices because each vertex needs to appear once per triangle.
		const vertices = new Float32Array( [
			-1.0, -1.0,  1.0,
			 1.0, -1.0,  1.0,
			 1.0,  1.0,  1.0,
		
			 1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,
			-4.0, -1.0,  1.0,

			-4.0, -1.0,  1.0,
			-4.0, -1.0,  3.0,
			 2.0,  8.0,  3.0,

			 2.0,  8.0,  3.0,
			 -1.0, 1.0,  1.0,
			 -4.0, -1.0, 1.0

		] );
		
		// itemSize = 3 because there are 3 values (components) per vertex
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		material.side = THREE.DoubleSide;
		const mesh = new THREE.Mesh( geometry, material );
		objects.push(mesh);

		scene.add(mesh);

		camera.position.z = 25;

		animate();
});