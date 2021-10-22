import { Animation } from "./Animation.js";
import { MathHelper } from "../utility/MathHelper.js";

export class HookedLoopsToTwoRingsAnimation extends Animation
{
    constructor(scene)
    {
        super(scene);
        this.scene = scene;

        this.stepsNumber = 4;
        this.counters = new Array(4);

        for(let i = 0; i < 4; ++i)
        {
            this.counters[i] = 0;
        }

        this.color = 0x0000ff;
    }

    /* @override */
    doStep()
    {
        this.removeAllObjects(this.scene);

        if(this.counters[0] < 20)
        {
            this.stepBlowPartOfToroid();
        }

        if(this.counters[1] < 40 && this.counters[0] > 8)
        {
            this.stepFillToroidCenter();
        }

        //if(this.counters[0] < this)
        {

        }

        this.drawStaticLoops();

    }

    /* @override */
    begin(speed)
    {
        window.setInterval(this.doStep.bind(this), speed);
    }

    stepBlowPartOfToroid()
    {
        //this.removeAllObjects(this.scene);

        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: this.color } ), "name1", this.scene);

        this.counters[0]++;
    }

    stepFillToroidCenter()
    {
        //this.removeAllObjects(this.scene);

        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: this.color } ), "name1", this.scene);
        this.addObjectToScene(new THREE.SphereGeometry(0.31 * this.counters[1], 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "name2", this.scene);

        this.counters[1]++;
    }

    drawStaticLoops()
    {
        this.addObjectToScene(new THREE.TorusGeometry(6, 1, 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop1", this.scene);
        this.addObjectToScene(new THREE.TorusGeometry(6, 1, 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop2", this.scene);

        const obj1 = this.scene.getObjectByName("loop1");
        const obj2 = this.scene.getObjectByName("loop2");

        obj1.position.set(2, 8, 0);
        obj2.position.set(4.2, 10, 0);

        obj1.geometry.center();
        obj2.geometry.center();

        obj1.rotation.z = 3 / 4 * Math.PI;
        obj2.rotation.z = - 3 / 4 * Math.PI;

        obj1.rotation.y = 1 / 3. * Math.PI;
        obj2.rotation.y = -1 / 3. * Math.PI;
    }

    parametrizedFunction(c, d, target) {
        const u = 0.32 - this.counters[0] / 20 * 0.32;// + 0.32 * (1 / 20.);
        const a = 2 * Math.PI * c;
        const t = ((Math.PI - a) * u + a);
        const fi = 2 * Math.PI * d;
    
        const R = 5;
        const r = 2 + (this.counters[0] / 20) * 4.5;
    
        const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));
    
        let x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
        let y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
        let z = r * Math.sin(fi);
    
        /*if(y > this.maxY && x > 0)
        {
            this.maxY = y;
            this.highestPoint.x = x;
            this.highestPoint.y = y;
            this.circleData.z = z;
            this.circleData.radius = r;
        }
    
        if(x > this.maxX)
        {
            this.maxX = x;
            this.farthestPoint.x = x;
            this.farthestPoint.y = y;
        }*/
    
        target.set(x, y, z);
    }
}