import { Animation } from "./Animation.js";

export class BoatToTorusAnimation extends Animation
{
    constructor(scene)
    {
        super();
        this.scene = scene;

        /* Initialize array of counters which will be helpful in indicating current step of animation/ */
        this.stepsNumber = 4;
      
        this.counters = new Array(4);
        
        for(let i = 0; i < 4; ++i)
        {
            this.counters[i] = 0;
        }

        this.currentAnimationStep = 1;
        this.totalAnimationSteps = 65;

        this.running = false;

        this.material = new THREE.MeshLambertMaterial( { color: 0x00d700 });
        this.material.side = THREE.DoubleSide;
    }

    /* @override */
    doStep()
    {
        if(this.running)
        {
            this.removeAllObjects(this.scene)
         
            this.addObjectToScene(new THREE.ParametricGeometry( this.toroidParametrization.bind(this), 40, 40 ), this.material, "boat", this.scene);
            const obj = this.scene.getObjectByName("boat");

            obj.rotation.x = Math.PI;
            if(this.counters[0] < 40)
            this.counters[0]++;
            else this.counters[1]++;
        }
    }

    /* @override */
    begin()
    {
        this.running = true;
        window.setInterval(this.doStep.bind(this), frequency);
    }

    /* @override */
    isAnimationOver()
    {
        return false;
    }

    toroidParametrization(param1, param2, target)
    {
        const phi =   Math.PI * param1;
        const theta = Math.PI * param2;
        const a = 45. - this.counters[0];
        const b = 16. - this.counters[1];
        const c = 18.;

        const x = a * Math.cos(phi) * Math.sin(theta);
        const y = b * Math.sin(phi) * Math.sin(theta);
        const z = c * Math.cos(theta);

        target.set(x, y, z);
    }
}