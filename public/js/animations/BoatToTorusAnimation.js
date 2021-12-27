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

        this.material = new THREE.MeshPhongMaterial( { color: 0xff0000 });
        this.material.side = THREE.DoubleSide;
    }

    /* @override */
    doStep()
    {
        if(this.running)
        {
            if(this.counters[0] < 20)
            {
                this.removeAllObjects(this.scene)
                this.addObjectToScene(new THREE.ParametricGeometry( this.boatParametrization.bind(this), 40, 40 ), this.material, "boat", this.scene);
                const obj = this.scene.getObjectByName("boat");
                obj.rotation.x = Math.PI;
            
                this.addObjectToScene(new THREE.ParametricGeometry( this.torusParametrization.bind(this), 40, 40 ), this.material, "bench", this.scene);
        
                const bench = this.scene.getObjectByName("bench");
                bench.rotation.y = Math.PI / 2;
                bench.rotation.z = Math.PI;
                bench.position.y -= 3.2;

                this.addObjectToScene(new THREE.CylinderGeometry(0.8, 0.8, 1., 40, 40), this.material, "lid1", this.scene);
                this.addObjectToScene(new THREE.CylinderGeometry(0.8, 0.8, 1., 40, 40), this.material, "lid2", this.scene);

                const lid1 = this.scene.getObjectByName("lid1");
                const lid2 = this.scene.getObjectByName("lid2");

                lid1.position.z += 4.5;
                lid2.position.z -= 4.5;

                lid1.position.y = lid2.position.y = -1.6;

                lid1.rotation.x = Math.PI / 2;
                lid2.rotation.x = Math.PI / 2;

                this.counters[0]++;
            }

            else if(this.counters[1] < 5)
            {
                let bench = this.scene.getObjectByName("bench");
                this.scene.remove(bench);

                this.addObjectToScene(new THREE.ParametricGeometry( this.torusParametrization.bind(this), 40, 40 ), this.material, "bench", this.scene);
                bench = this.scene.getObjectByName("bench");
                bench.rotation.y = Math.PI / 2;
                bench.rotation.z = Math.PI;
                bench.position.y -= 3.2;
                bench.position.y += this.counters[1];

                this.counters[1]++;
            }
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

    boatParametrization(param1, param2, target)
    {
        const phi =   Math.PI * param1;
        const theta = Math.PI * param2;
        const a = 25. - this.counters[0];
        const b = 6;
        const c = 5.;

        const x = a * Math.cos(phi) * Math.sin(theta);
        const y = b * Math.sin(phi) * Math.sin(theta);
        const z = c * Math.cos(theta);

        target.set(x, y, z);
    }

    torusParametrization(c, d, target)
    {
        const u = 1 - this.counters[1] / 20;
        const a = 2 * Math.PI * (1 - c);
        const t = ((Math.PI - a) * u + a);
        const fi = 2 * Math.PI * (1 - d);

        const R = 1.5 + this.counters[1] / 20;
        const r = 0.8;

        const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));

        const x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
        const y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
        const z = r * Math.sin(fi);

        target.set(x, y, z);
    }
}