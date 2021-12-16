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

        this.material = new THREE.MeshLambertMaterial( { color: 0xffd700 });
        this.material.side = THREE.DoubleSide;
    }

    /* @override */
    doStep()
    {
        if(this.running)
        {
            this.addObjectToScene(new THREE.ParametricGeometry( this.toroidParametrization.bind(this), 40, 40 ), this.material, "toroid", this.scene);
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

    toroidParametrization(a, b, target)
    {
        a = 4 * a;
        b = 4 * b;

        const x = a;
        const y = b;
        const z = a * a + b * b;

        target.set(x, y, z);
    }
}