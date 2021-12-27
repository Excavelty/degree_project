import { LinkedLoopsToTwoRingsAnimation } from "./animations/LinkedLoopsToTwoRingsAnimation.js";
import { MoveOnStrip } from "./animations/MoveOnStrip.js";
import { SceneController } from "./SceneController.js";

export class ObjectLoader
{
    constructor(scene, sceneController, controls, renderer)
    {
        this.scene = scene;
        this.sceneController = sceneController;
        this.controls = controls;
        this.renderer = renderer;
        this.objects = [];
        this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
        this.material.side = THREE.DoubleSide;
        this.mobiusAnimation = null;
        this.animation = null;
    }

    loadObject(name)
    {
        this.cleanScene();

        switch(name)
        {
            case 'torus': this.torusLoader(); break;
            case 'mug': this.mugLoader(); break;
            case 'hooked_loops': this.loopsLoader(); break;
            case 'double_torus': this.doubleTorusLoader(); break;
            case 'mobius_strip': this.mobiusStripLoader(); break;
            case 'bottle': this.kleinBottleLoader(); break;
        }
    }

    torusLoader()
    {
        const geometry = new THREE.TorusGeometry(4., 1., 40, 40);
        
        this.addObject(geometry);
   
        this.addDescription('TORUS is one of the most basic objects in topology. It is of genus-1 (has one hole). Sometimes all genus-1 geometries are referred to as toruses, as they can be deformed to a torus.')
    }

    mugLoader()
    {
        const handleGeometry = new THREE.TorusGeometry(2, 0.4, 40, 40, Math.PI);
        const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 6, 40, 40, true);
        const lidGeometry = new THREE.CylinderGeometry(2, 2, 1, 40, 40, false);

        this.addObject(handleGeometry);
        this.addObject(cylinderGeometry);
        this.addObject(lidGeometry);

        this.objects[0].position.x -= (this.objects[0].geometry.parameters.radius - 0.1);
        this.objects[0].rotation.z = Math.PI / 2;
        this.objects[2].position.y -= 3;

        this.addDescription('A MUG is topologically equivalent to TORUS (as shown in the "Torus to Mug" 3D animation), therefore it is of genus-1. MUG has only one hole: between the handle and the cylinder-like part of the mug. MUG\'s interior is not a hole but just a dimple.')
    }

    loopsLoader()
    {
        const loopsAnimation = new LinkedLoopsToTwoRingsAnimation(this.scene);

        loopsAnimation.color = this.material.color;

        const leftTorus = new THREE.ParametricGeometry(loopsAnimation.parametrizedTorusXConstants.bind(loopsAnimation), 40, 40);
        const rightTorus = new THREE.ParametricGeometry(loopsAnimation.parametrizedTorusXConstants.bind(loopsAnimation), 40, 40);
        const torusLoop = new THREE.ParametricGeometry(loopsAnimation.parametrizedFunction.bind(loopsAnimation), 40, 40);

        this.addObject(leftTorus);
        this.addObject(rightTorus);
        this.addObject(torusLoop);

        this.objects[0].position.set(-3.2, 8, 0);
        this.objects[1].position.set(3.2, 8, 0);

        this.objects[0].geometry.center();
        this.objects[1].geometry.center();

        this.objects[0].rotation.z = -Math.PI / 4.;
        this.objects[1].rotation.z = Math.PI / 3.;
    
        this.objects[0].position.set(1.4, 11.7, 0);
        this.objects[1].position.set(-1.9, 10.5, -2.4);

        loopsAnimation.addBottomCylindersToScene();

        this.animation = loopsAnimation;

        this.addDescription("LINKED LOOPS are example of a genus-2 object. To demonstrate this fact watch the 3D animation showing changing LINKED LOOPS to a DOUBLE TORUS")
    }

    mobiusStripLoader()
    {
        const geometry = new THREE.ParametricGeometry(/*THREE.ParametricGeometries.mobius3d*/this.mobiusModified, 40, 40);
        
        this.addObject(geometry);

        const secondGeometry = new THREE.ParametricGeometry(this.mobiusModified2, 40, 40);

        const material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
        material.side = THREE.DoubleSide;

        this.mobiusAnimation = new MoveOnStrip(this.scene);
        
        this.sceneController.loadAnimation(this.mobiusAnimation);
        this.sceneController.startAnimation(60);

        this.addDescription('MÖBIUS STRIP is a genus-1 object, whose specific feature is that it is a one-sided object. This can be demonstrated by a ball rolling continously over the surface of the strip.\
        Notice, that the ball appears on both sides of the strip.')
    }

    doubleTorusLoader()
    {
        /* add two toruses next to each other */
        this.torusLoader();
        this.torusLoader();

        this.objects[0].position.x = (this.objects[0].geometry.parameters.radius + 0.1);
        this.objects[1].position.x = -(this.objects[1].geometry.parameters.radius - 0.1);
    
        this.addDescription()

        this.addDescription('DOUBLE TORUS is just built from two toruses glued together.')
    }

    kleinBottleLoader()
    {
        const geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.klein, 40, 40);
        
        this.addObject(geometry);

        this.addDescription('KLEIN\'S BOTTLE is an example of a more complicated topological object. It is a genus-2\
        one-sided object and might be understood as two mirrored MÖBIUS STRIPS glued togheter. Object shown above is in fact a projection of KLEIN\'S BOTTLE into 3-dimensional space.')
    }

    addObject(geometry, alternativeMaterial=null)
    {
        let material = this.material

        if(null != alternativeMaterial) {
            material = alternativeMaterial;
        }

        const mesh = new THREE.Mesh(geometry, material);

        this.objects.push(mesh);
        this.scene.add(mesh);
    }

    cleanScene()
    {
        if(null !== this.animation)
        {
            this.animation.removeAllObjects(this.scene);
            this.animation = null;
        }

        if(0 !== this.objects.length)
        {
            for(const obj of this.objects)
            {
                this.scene.remove(obj);
            }
        }

        this.objects = [];
    }

    addDescription(descriptionText)
    {
        const descriptionElement = document.createElement('div');
        descriptionElement.textContent = descriptionText;
        descriptionElement.classList += 'alert alert-info';
        
        const canvasElement = document.querySelector('.canvasElement');
        const oldDescriptionElement = canvasElement.querySelector('.alert');
 
        if(undefined !== oldDescriptionElement && null !== oldDescriptionElement)
        {
            canvasElement.removeChild(oldDescriptionElement);
        }
 
        canvasElement.appendChild(descriptionElement);
    }

    mobiusModified( u, t, target ) {

        // volumetric mobius strip
        u *= Math.PI;
        t *= 2 * Math.PI;
        u = u * 2;
        const phi = u / 2;
        const major = 5.25,
            a = 0.125,
            b = 1.625;
        let x = a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi );
        const z = a * Math.cos( t ) * Math.sin( phi ) + b * Math.sin( t ) * Math.cos( phi );
        const y = ( major + x ) * Math.sin( u );
        x = ( major + x ) * Math.cos( u );
        target.set( x, y, z );
    }

    mobiusModified2( u, t, target ) {

        // volumetric mobius strip
        u *= Math.PI;
        t *= 2 * Math.PI;
        u = u * 2;
        const phi = u / 2;
        const major = 5.25,
            a = 0.125,
            b = 0.625;
        let x = a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi );
        const z = a * Math.cos( t ) * Math.sin( phi ) + b * Math.sin( t ) * Math.cos( phi );
        const y = ( major + x ) * Math.sin( u );
        x = ( major + x ) * Math.cos( u );
        target.set( x, y, z );
    }
}