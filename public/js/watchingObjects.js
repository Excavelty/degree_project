import {ObjectLoader} from './ObjectLoader.js'
import {SceneController} from './SceneController.js'

document.addEventListener('DOMContentLoaded', function() {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    const canvasElement = document.querySelector('.canvasElement');
    renderer.canvas = canvasElement
    renderer.setSize( canvasElement.offsetWidth, canvasElement.offsetHeight * 0.9);
    canvasElement.appendChild( renderer.domElement );
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xdddddd );
    
    const sceneController = SceneController.FromSceneCameraAndOrbitControls(scene, camera, controls);

    //sceneController.setCameraPosition(new THREE.Vector3(12.39511881197365, -8.31, 4.32));
    sceneController.setCameraPosition(new THREE.Vector3(0, 0, 25));
    //sceneController.setCameraRotation(new THREE.Vector3(0.68, 1.18, -0.64));

    sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, 25, 0));
    sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(-25, 25, 0));
    sceneController.addPointLight(0xffffff, 1., new THREE.Vector3(25, -25, 0));

    const loader = new ObjectLoader(scene);

    const buttons = document.querySelectorAll('.btn');

    for(const button of buttons)
    {
        button.addEventListener('click', function() {
            loader.loadObject(this.name);
        });
    }

    loader.loadObject('torus');

    const animate = function() {
        requestAnimationFrame( animate );
    
        controls.update();
    
        renderer.render( scene, camera );
    }

    animate();
})