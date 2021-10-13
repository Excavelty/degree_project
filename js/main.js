// import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

const circleData = {
	radius: 0,
	x: 0,
	y: 0,
	z: 0
}

const farthestPoint = {
	x: 0,
	y: 0
}

const highestPoint = {
	x: 0,
	y: 0
}

let maxY = 0;
let maxX = 0;
let angle = 0;

const parametrizedFunction = function (c, d, target) {
	const u = 0.68 + 0.32 * (invocationCounter / 20.);
	const a = 2 * Math.PI * c;
	const t = ((Math.PI - a) * u + a);
	const fi = 2 * Math.PI * d;

	const R = 5 - (invocationCounter / 20) * 2;
	const r = 2 + (invocationCounter / 20) * 2;

	const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));

	let x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
	let y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
	let z = r * Math.sin(fi);

	if(y > maxY && x > 0)
	{
		maxY = y;
		highestPoint.x = x;
		highestPoint.y = y;
		circleData.z = z;
		circleData.radius = r;
	}

	if(x > maxX)
	{
		maxX = x;
		farthestPoint.x = x;
		farthestPoint.y = y;
	}

	target.set(x, y, z);
}

const parametrizedUpper = function(c, d, target)
{
	const u = 0.68;//0.32 / 20.; //+ 0.38 * (invocationCounter / 20.);
	const a = 2 * Math.PI * c;
	const t = ((Math.PI - a) * u + a);
	const fi = 2 * Math.PI * d;


	const R = 5; //+ Math.cos(invocationCounter / 10 * Math.PI / 2);
	const r = 2 - (invocationCounter / 20) * 1;

	const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));

	const x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
	const y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
	const z = r * Math.sin(fi);

	target.set(x, y, z);
}

const parametrizedUpperFinish = function(c, d, target)
{
	const u = 0.68;//0.32 / 20.; //+ 0.38 * (invocationCounter / 20.);
	const a = 2 * Math.PI * c;
	const t = ((Math.PI - a) * u + a);
	const fi = 2 * Math.PI * d;


	const R = invocationCounter3 == 0? 5 - invocationCounter2 / 10 * 1.6 : 5 - invocationCounter2 / 10 * 1.6 - invocationCounter3 / 20 * 0.6; //+ Math.cos(invocationCounter / 10 * Math.PI / 2);
	const r = 2 - (invocationCounter / 20) * 1;

	const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));

	const x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
	const y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
	const z = r * Math.sin(fi);

	target.set(x, y, z);
}

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdddddd );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let invocationCounter = 0;
let invocationCounter2 = 0;
let invocationCounter3 = 0;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const objectNames = [];

const removeAllObjects = function () {
	
	for(const objName of objectNames)
	{
		const obj = scene.getObjectByName(objName);
		scene.remove(obj);
	}

	objectNames.length = 0;
}

const addObjectToScene = function (geometry, material, name) {
	material.side = THREE.DoubleSide;

	const mesh = new THREE.Mesh (geometry, material);
	mesh.name = name;

	objectNames.push(name);

	scene.add(mesh);
}

const cosinusTheorem = function(a, b, c)
{
	const angle = (a * a + b * b - c * c) / (2 * a * b);

	return angle;
}

const distanceBtwPoints = function(p1, p2)
{
	const distanceX = Math.abs(p1.x - p2.x);
	const distanceY = Math.abs(p2.y - p1.y);
	const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

	return distance;
}

const createMesh = function () {
	if(invocationCounter < 20)
	{
		removeAllObjects();

		addObjectToScene(new THREE.ParametricGeometry( parametrizedFunction, 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1");
		addObjectToScene(new THREE.ParametricGeometry( parametrizedUpper, 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2");	

		const geometry = new THREE.CylinderGeometry(circleData.radius, circleData.radius, 1, 32, 32);

		addObjectToScene(geometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name3');

		const obj2 = scene.getObjectByName('name3');

		if(Math.abs(farthestPoint.x - highestPoint.x) < 0.001)
		{
			highestPoint.x -= 2 * circleData.radius;
		}

		circleData.x = highestPoint.x + (farthestPoint.x - highestPoint.x) / 2.;
		circleData.y = farthestPoint.y + Math.abs(farthestPoint.y - highestPoint.y) / 2;
		const cosAngle = cosinusTheorem(circleData.radius, distanceBtwPoints(circleData, highestPoint), Math.abs(circleData.x - highestPoint.x));
		let angle = Math.acos(cosAngle);
		if(isNaN(angle))
		{
			angle = 0;
		}

		obj2.rotation.z = Math.PI / 2 + angle + 0.4 * (10 - invocationCounter) / 9;
		obj2.position.x = circleData.x;
		obj2.position.y = circleData.y;
		obj2.position.z = circleData.z;
		obj2.geometry.center();

		const repeatedCylinderGeometry = new THREE.CylinderGeometry(circleData.radius, circleData.radius, 1, 32, 32);
		
		addObjectToScene(repeatedCylinderGeometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name4');

		const obj3 = scene.getObjectByName('name4');
		obj3.rotation.z = - obj2.rotation.z;
		obj3.position.x = -circleData.x
		obj3.position.y = circleData.y;
		obj3.position.z = circleData.z;

		circleData.x = circleData.y = circleData.z = maxY = maxX = circleData.radius = Number.NEGATIVE_INFINITY;

		const obj = scene.getObjectByName('name2');
		obj.rotation.x = Math.PI;
		obj.position.y += (12 - invocationCounter/20 * 10);

		invocationCounter++;
	}

	if(invocationCounter2 < 14 && invocationCounter > 12)	{
		removeAllObjects();

		addObjectToScene(new THREE.ParametricGeometry( parametrizedFunction, 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1");
		addObjectToScene(new THREE.ParametricGeometry( parametrizedUpperFinish, 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2");	

		const geometry = new THREE.CylinderGeometry(circleData.radius, circleData.radius, 1, 32, 32);

		addObjectToScene(geometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name3');

		const obj2 = scene.getObjectByName('name3');
		circleData.x = highestPoint.x + (farthestPoint.x - highestPoint.x) / 2.;
		circleData.y = farthestPoint.y + Math.abs(farthestPoint.y - highestPoint.y) / 2;
		const cosAngle = cosinusTheorem(circleData.radius, distanceBtwPoints(circleData, highestPoint), Math.abs(circleData.x - highestPoint.x));
		let angle = Math.acos(cosAngle);

		if(isNaN(angle))
		{
			angle = Math.PI / 2;
		}

		obj2.rotation.z = Math.PI / 2 + angle;
		obj2.position.x = circleData.x;
		obj2.position.y = circleData.y;
		obj2.position.z = circleData.z;
		obj2.geometry.center();

		const repeatedCylinderGeometry = new THREE.CylinderGeometry(circleData.radius, circleData.radius, 1, 32, 32);
		
		addObjectToScene(repeatedCylinderGeometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name4');

		const obj3 = scene.getObjectByName('name4');
		obj3.rotation.z = -Math.PI / 2 - angle;
		obj3.position.x = -circleData.x
		obj3.position.y = circleData.y;
		obj3.position.z = circleData.z;

		circleData.x = circleData.y = circleData.z = maxY = maxX = circleData.radius = highestPoint.x = highestPoint.y = farthestPoint.x = farthestPoint.y = Number.NEGATIVE_INFINITY;

		const obj = scene.getObjectByName('name2');
		obj.rotation.x = Math.PI;
		obj.position.y += (12 - invocationCounter/20 * 10);

		invocationCounter2++;
	}

	if(invocationCounter2 >= 14 && invocationCounter3 < 20)
	{
		removeAllObjects();

		addObjectToScene(new THREE.ParametricGeometry( parametrizedFunction, 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1");
		addObjectToScene(new THREE.ParametricGeometry( parametrizedUpperFinish, 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2");	

		const geometry = new THREE.CylinderGeometry(circleData.radius, circleData.radius, 1, 32, 32);

		addObjectToScene(geometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name3');

		const obj2 = scene.getObjectByName('name3');
		circleData.x = highestPoint.x + (farthestPoint.x - highestPoint.x) / 2.;
		circleData.y = farthestPoint.y + Math.abs(farthestPoint.y - highestPoint.y) / 2;
		const cosAngle = cosinusTheorem(circleData.radius, distanceBtwPoints(circleData, highestPoint), Math.abs(circleData.x - highestPoint.x));
		let angle = Math.acos(cosAngle);

		if(isNaN(angle))
		{
			angle = Math.PI / 2;
		}

		obj2.rotation.z = Math.PI / 2 + angle;
		obj2.position.x = circleData.x - invocationCounter3;
		obj2.position.y = circleData.y;
		obj2.position.z = circleData.z;
		obj2.geometry.center();

		const repeatedCylinderGeometry = new THREE.CylinderGeometry(circleData.radius, circleData.radius, 1, 32, 32);
		
		addObjectToScene(repeatedCylinderGeometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name4');

		const obj3 = scene.getObjectByName('name4');
		obj3.rotation.z = -Math.PI / 2 - angle;
		obj3.position.x = -circleData.x
		obj3.position.y = circleData.y;
		obj3.position.z = circleData.z;

		circleData.x = circleData.y = circleData.z = maxY = maxX = circleData.radius = highestPoint.x = highestPoint.y = farthestPoint.x = farthestPoint.y = Number.NEGATIVE_INFINITY;

		const obj = scene.getObjectByName('name2');
		obj.rotation.x = Math.PI;
		obj.position.y += (12 - invocationCounter/20 * 10);
		obj.position.y += (invocationCounter3 * 2) / 10 * 1.8;

		invocationCounter3++;
	}
}


const light1 = new THREE.PointLight( 0xffffff, 1, 100 );
light1.position.set( 25, 25, 0 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 1, 100 );
light2.position.set( -25, 25, 0 );
scene.add( light2 );

const light3 = new THREE.PointLight( 0xffffff, 1, 100 );
light3.position.set( 25, -25, 0 );
scene.add( light3 );

/*const light4 = new THREE.PointLight( 0xffffff, 1, 100 );
light4.position.set( -25, -25, 0 );
scene.add( light4 );

const light5 = new THREE.PointLight( 0xffffff, 1, 100 );
light5.position.set( 0, 0, -15 );
scene.add( light5 );

const light6 = new THREE.PointLight( 0xffffff, 1, 100 );
light6.position.set( 0, 0, 15 );
scene.add( light6 );*/

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

camera.position.z = 35;
camera.rotation.x = 0.6778438237261257;
camera.rotation.y = 1.1825512142303956;
camera.rotation.z = -0.6404101879639851;

camera.position.x = 32.39511881197365;
camera.position.y = -8.309126219405242;
camera.position.z = 10.320595846563247;

window.setInterval(createMesh, 100);

const animate = function () {
	requestAnimationFrame( animate );

	// controls.update();
	console.log(camera.rotation, camera.position);

	renderer.render( scene, camera );
};

animate();