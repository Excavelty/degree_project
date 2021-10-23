import { Animation } from "./Animation.js";
import { MathHelper } from "../utility/MathHelper.js";

export class HookedLoopsToTwoRingsAnimation extends Animation
{
    constructor(scene)
    {
        super(scene);
        this.scene = scene;

        this.stepsNumber = 5;
        this.counters = new Array(5);

        for(let i = 0; i < 5; ++i)
        {
            this.counters[i] = 0;
        }

        this.color = 0x0000ff;
    
        this.rotationChangeLoopLeft = 0;
        this.rotationChangeLoopRight = 0;
    }

    /* @override */
    doStep()
    {
        if(this.counters[0] < 20)
        {
            this.stepBlowToroid();
            this.drawStaticLoops();
        }

        else if(this.counters[1] < 10)
        {
            this.stepMoveLoopBeforeUnhooking();
        }

        else if(this.counters[2] < 20)
        {
            this.stepUnhookLoops();
        }

        else if(this.counters[3] < 20)
        {
            this.stepShrinkSphereMoveLoops();
        }

        else if(this.counters[4] < 20)
        {
            this.stepFinalizeLoopsRotation();
        }
    }

    /* @override */
    begin(speed)
    {
        window.setInterval(this.doStep.bind(this), speed);
    }

    stepBlowToroid()
    {
        this.removeAllObjects(this.scene);

        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: this.color } ), "name1", this.scene);
        this.addObjectToScene(new THREE.SphereGeometry(0.70 * this.counters[0], 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "ball", this.scene);

        this.addObjectToScene(new THREE.CylinderGeometry(1, 1, 0.2, 32), new THREE.MeshLambertMaterial( { color: this.color }), "cylinderLeft", this.scene);
        this.addObjectToScene(new THREE.CylinderGeometry(1, 1, 1, 32), new THREE.MeshLambertMaterial( { color: this.color }), "cylinderRight", this.scene);

        const cylinderLeft = this.scene.getObjectByName("cylinderLeft");
        const cylinderRight = this.scene.getObjectByName("cylinderRight");

        cylinderLeft.rotation.z = -Math.PI / 4;
        cylinderLeft.position.set(-2.7, 7.3, 0);

        const sphereObj = this.scene.getObjectByName("ball");
        sphereObj.position.set(0, -4.2, 0);

        this.counters[0]++;
    }

    drawStaticLoops()
    {
        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedTorusXConstants.bind(this), 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop1", this.scene);
        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedTorusXConstants.bind(this), 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop2", this.scene);

        const obj1 = this.scene.getObjectByName("loop1");
        const obj2 = this.scene.getObjectByName("loop2");

        obj1.position.set(-3.2, 8, 0);
        obj2.position.set(3.2, 8, 0);

        //obj1.geometry.center();
        //obj2.geometry.center();

        obj1.rotation.z = -Math.PI / 4.;
        obj2.rotation.z = Math.PI / 3.;

        obj1.position.set(-0.7, 10, 0);
        obj2.position.set(-0.5, 9, -2.4);
    }

    stepMoveLoopBeforeUnhooking()
    {
        //this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedTorusXConstants.bind(this), 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop1", this.scene);
        //this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedTorusXConstants.bind(this), 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop2", this.scene);

        const obj1 = this.scene.getObjectByName("loop1");
        const obj2 = this.scene.getObjectByName("loop2");

        obj1.position.set(-3.2, 8, 0);
        obj2.position.set(3.2, 8, 0);

        //obj1.geometry.center();
        //obj2.geometry.center();

        obj1.rotation.z = -Math.PI / 4.;
        obj2.rotation.z = Math.PI / 3.;

        const angle = this.counters[1] / 10. * Math.PI / 6;
        const r = 10;

        obj1.position.set(-0.7, r * Math.cos(angle), r * Math.sin(angle));
        obj2.position.set(-0.5, 9, -2.4);

        this.counters[1]++;
    }

    stepUnhookLoops()
    {
        const obj1 = this.scene.getObjectByName("loop1");
        const obj2 = this.scene.getObjectByName("loop2");

        const angle1 = this.counters[2] / 20. * 2.06 * Math.PI / 4.;
        const angle2 = this.counters[2] / 20. * 2.06 * Math.PI / 4.;

        const R1 = MathHelper.DistanceBtwPoints(new THREE.Vector2(obj1.position.x, obj1.position.y), new THREE.Vector2(0, 0));
        const R2 = MathHelper.DistanceBtwPoints(new THREE.Vector2(obj2.position.x, obj2.position.y), new THREE.Vector2(0, 0)); 

        obj1.position.x = R1 * Math.sin(angle1);
        obj1.position.y = R1 * Math.cos(angle1);
        
        obj2.position.x = -R2 * Math.sin(angle2);
        obj2.position.y = R2 * Math.cos(angle2);
        
        this.counters[2]++;
    }

    stepShrinkSphereMoveLoops()
    {
        const oldToroidPart = this.scene.getObjectByName("name1");
        this.scene.remove(oldToroidPart);

        const ball = this.scene.getObjectByName("ball");
        const loop1 = this.scene.getObjectByName("loop1");
        const loop2 = this.scene.getObjectByName("loop2");

        const initRadius = ball.geometry.parameters.radius;

        this.scene.remove(ball);

        this.addObjectToScene(new THREE.SphereGeometry(initRadius - 0.6, 40, 40), new THREE.MeshLambertMaterial( {color: this.color} ), "ball", this.scene);

        const newBall = this.scene.getObjectByName("ball");
        newBall.position.x = 1.3;
        newBall.position.y = -3;

        loop1.position.x -= 0.25;
        loop2.position.x += 0.25;

        this.counters[3]++;
    }

    stepFinalizeLoopsRotation()
    {
        if(this.counters[4] == 0)
        {
            this.rotationChangeLoopLeft = (this.scene.getObjectByName("loop1").rotation.z) / 20.;
            this.rotationChangeLoopRight = (this.scene.getObjectByName("loop2").rotation.z) / 40.;
        }

        const loop1 = this.scene.getObjectByName("loop1");
        const loop2 = this.scene.getObjectByName("loop2");

        loop1.rotation.z += this.rotationChangeLoopLeft;
        loop2.rotation.z += this.rotationChangeLoopRight;

        loop1.position.x += 0.04;
        loop2.position.x -= 0.04;

        const ball = this.scene.getObjectByName("ball");
        if(ball.geometry.parameters.radius >= 0)
        {
            this.scene.remove(ball);
            this.addObjectToScene(new THREE.SphereGeometry(ball.geometry.parameters.radius - 0.1, 40, 40), new THREE.MeshLambertMaterial( {color: this.color} ), "ball", this.scene);
            const newBall = this.scene.getObjectByName("ball");
            newBall.position.x = 1.3;
            newBall.position.y = ball.position.y + 0.2;
        } 

        else if(ball.geometry.radius < 0)
        {
            this.scene.remove(ball);
        }

        this.counters[4]++;
    }

    parametrizedFunction(c, d, target) {
        const u = 0.40;
        const a = 2 * Math.PI * c;
        const t = ((Math.PI - a) * u + a);
        const fi = 2 * Math.PI * d;
    
        const R = 5;
        const r = 1;
    
        const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));
    
        let x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
        let y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
        let z = r * Math.sin(fi);
    
        if(y > this.maxY && x > 0)
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
        }
    
        target.set(x, y, z);
    }

    parametrizedTorusXConstants(a, b, target)
    {
        const phi = 2 * Math.PI * a;
        const theta = 2 * Math.PI * b;

        const R = 6;
        const r = 0.5;

        const x = r * Math.sin(theta);
        const y = (R + r * Math.cos(theta)) * Math.cos(phi);
        const z = (R + r * Math.cos(theta)) * Math.sin(phi);

        target.set(x, y, z);
    }
}