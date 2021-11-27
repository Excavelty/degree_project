import { HookedLoopsToTwoRingsAnimation } from "./animations/HookedLoopsToTwoRingsAnimation.js";

export class ObjectLoader
{
    constructor(scene)
    {
        this.scene = scene;
        this.objects = [];
        this.material = new THREE.MeshPhongMaterial({color: 0x008080});
        this.material.side = THREE.DoubleSide;
        this.animation = null;
    }

    loadObject(name)
    {
        this.cleanScene();

        console.log(name);

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
    }

    loopsLoader()
    {
        const loopsAnimation = new HookedLoopsToTwoRingsAnimation(this.scene);

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

        //obj1.position.set(-0.7, 10, 0);
        //obj2.position.set(-0.5, 9, -2.4);
    
        this.objects[0].position.set(1.4, 11.7, 0);
        this.objects[1].position.set(-1.9, 10.5, -2.4);

        loopsAnimation.addBottomCylindersToScene();

        this.animation = loopsAnimation;
    }

    mobiusStripLoader()
    {
        const geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 40, 40);
        
        this.addObject(geometry);
    }

    doubleTorusLoader()
    {
        /* add two toruses next to each other */
        this.torusLoader();
        this.torusLoader();

        console.log(this.objects[0].geometry.parameters.radius);

        this.objects[0].position.x = (this.objects[0].geometry.parameters.radius + 0.1);
        this.objects[1].position.x = -(this.objects[1].geometry.parameters.radius - 0.1);
    }

    kleinBottleLoader()
    {
        const geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.klein, 40, 40);
        
        this.addObject(geometry);
    }

    addObject(geometry)
    {
        const mesh = new THREE.Mesh(geometry, this.material);

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
}