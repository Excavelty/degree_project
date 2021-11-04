import { SceneController } from './SceneController.js';
import { ToroidToMugAnimation } from './animations/ToroidToMugAnimation.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdddddd );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const objects = [];

let checkIntersection = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const animate = function() {
	requestAnimationFrame( animate );

	controls.update();

    if(checkIntersection)
    {
	// calculate objects intersecting the picking ray
	    const intersects = raycaster.intersectObjects( objects )

        for ( let i = 0; i < intersects.length; i ++ ) {

            intersects[ i ].object.material.color.set( 0x00ff00 );
            console.log(intersects[i]);
            intersects[ i ].object.geometry.colorsNeedUpdate = true;

            const newSphere = new THREE.SphereGeometry(2, 32, 32);
            const point = intersects[i].point;
            const newSphereMesh = new THREE.Mesh(newSphere, new THREE.MeshBasicMaterial({color: 0xff0000}));
            newSphereMesh.position.set(point.x, point.y, point.z);
            //scene.add(newSphereMesh);

        }

        checkIntersection = false;
    }

	renderer.render( scene, camera );
}

function readMousePos(event)
{
	console.log('klik klik');
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

    checkIntersection = true;
}

document.addEventListener('pointerdown', readMousePos, false);

function createModifiedGeometry(positions)
{
	console.log(positions);

	const num = 1341;

	let a = new THREE.Vector3(positions[num], positions[num + 1], positions[num + 2]);
	let b = new THREE.Vector3(positions[num + 3], positions[num + 4], positions[num + 5]);
	let c = new THREE.Vector3(positions[num + 6], positions[num + 7], positions[num + 8]);

	const center = new THREE.Vector3( (a.x + b.x + c.x) / 3. - 1, (a.y + b.y + c.y) / 3. + 1,  (a.z + b.z + c.z) / 3. + 3);

	const resultPositions = new Float32Array(positions.length + 18);

	for(let i = 0; i < num; ++i)
	{
		resultPositions[i] = positions[i];
	}

	resultPositions[num] = a.x;
	resultPositions[num + 1] = a.y;
	resultPositions[num + 2] = a.z;

	resultPositions[num + 3] = b.x;
	resultPositions[num + 4] = b.y;
	resultPositions[num + 5] = b.z;

	resultPositions[num + 6] = center.x;
	resultPositions[num + 7] = center.y;
	resultPositions[num + 8] = center.z;

	

	resultPositions[num + 9] = b.x;
	resultPositions[num + 10] = b.y;
	resultPositions[num + 11] = b.z;

	resultPositions[num + 12] = center.x;
	resultPositions[num + 13] = center.y;
	resultPositions[num + 14] = center.z;

	resultPositions[num + 15] = c.x;
	resultPositions[num + 16] = c.y;
	resultPositions[num + 17] = c.z;

	

	resultPositions[num + 18] = c.x;
	resultPositions[num + 19] = c.y;
	resultPositions[num + 20] = c.z;

	resultPositions[num + 21] = center.x;
	resultPositions[num + 22] = center.y;
	resultPositions[num + 23] = center.z;

	resultPositions[num + 24] = a.x;
	resultPositions[num + 25] = a.y;
	resultPositions[num + 26] = a.z;
	
	for(let i = num + 27; i < resultPositions.length; ++i)
	{
		resultPositions[i] = positions[i - 27];
	}

	console.log(resultPositions);

	const resultGeometry = new THREE.BufferGeometry();
	resultGeometry.setAttribute('position', new THREE.BufferAttribute(resultPositions, 3));

	return resultGeometry;
}

document.addEventListener('DOMContentLoaded', function() {
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	scene.background = new THREE.Color(0xaaaaaa);

	const sceneController = SceneController.FromSceneCameraAndOrbitControls(scene, camera, controls);

	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, 25, 0));
	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(-25, 25, 0));
	sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, -25, 0));

	var faceColorMaterial = new THREE.MeshBasicMaterial( 
		{ color: 0xffffff, vertexColors: THREE.VertexColors} );
		
		var sphereGeometry = new THREE.SphereGeometry( 10, 16, 16 );
		sphereGeometry = sphereGeometry.toNonIndexed();

        const copyPositions = new Float32Array(sphereGeometry.getAttribute('position').array);
        
        const modifiedGeometry = createModifiedGeometry(copyPositions);

		let colors = new Float32Array(modifiedGeometry.getAttribute('position').count * 3);
		modifiedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const colorAttr = modifiedGeometry.getAttribute('color');

		for ( var i = 0; i < modifiedGeometry.getAttribute('color').count * 3; i += 3) 
		{
			const value = 0.8 * Math.random() + 0.2;
			colorAttr.array[i] = value;
			colorAttr.array[i + 1] = 0.2 * Math.random() + 0.2;
			colorAttr.array[i + 2] = 0;
		}

		faceColorMaterial.side = THREE.DoubleSide;

		const modifiedMesh = new THREE.Mesh(modifiedGeometry, faceColorMaterial);

		objects.push(modifiedMesh);

		scene.add(modifiedMesh);

		camera.position.z = 25;

		animate();
});