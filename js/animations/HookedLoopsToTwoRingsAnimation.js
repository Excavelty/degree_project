import { Animation } from "./Animation.js";
import { MathHelper } from "../utility/MathHelper.js";

/*
    Class handling animation of two conjoined loops originating from common toroid-like object.
    It is visualization of surprising genus-2 topological object. Idea was based on an example show in video
    'Topology Riddles': https://www.youtube.com/watch?v=H8qwqGjOlSE 
*/

export class HookedLoopsToTwoRingsAnimation extends Animation
{
    /*
        Constructor of the class will pass the scene to class field.
        Not handling of scene in parent class is caused by backward compatibility and need of several changes during potential refactoring.
    */
    constructor(scene)
    {
        super();
        this.scene = scene;

        // set number of animations steps and initialize counters
        this.stepsNumber = 5;
        this.counters = new Array(5);

        for(let i = 0; i < 5; ++i)
        {
            this.counters[i] = 0;
        }

        // color of animated object
        this.color = 0x0000ff;
    
        this.rotationChangeLoopLeft = 0;
        this.rotationChangeLoopRight = 0;

        /* Initialize structures to hold data useful to indicate tangent angle and position of mugs base - bottoms ("flat" cylinders) */
        this.circleData = {
            radius: 0,
            x: 0,
            y: 0,
            z: 0
        }
        
        /* Farthes point, in fact in this animation: point closest to (0, 0, 0) which have non-negative y coordinates */
        this.farthestPoint = {
            x: 0,
            y: 0
        }
        
        /* Highest point of object */
        this.highestPoint = {
            x: 0,
            y: 0
        }
        
        this.maxY = 0;
        this.maxX = Number.POSITIVE_INFINITY;
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
    begin(frequency)
    {
        window.setInterval(this.doStep.bind(this), frequency);
    }

    /*
        Helper function for adding small bottom-base cylinders of main loop of animated object
        It is calculating tangent of the cylinders based on cosinus theorem as well as hard-coded alignement
    */
    addBottomCylindersToScene()
    {
        this.circleData.y -= this.circleData.radius;

        this.addObjectToScene(new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 0.2, 32), new THREE.MeshLambertMaterial( { color: this.color }), "cylinderLeft", this.scene);
        this.addObjectToScene(new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 0.2, 32), new THREE.MeshLambertMaterial( { color: this.color }), "cylinderRight", this.scene);

        const cylinderLeft = this.scene.getObjectByName("cylinderLeft");
        const cylinderRight = this.scene.getObjectByName("cylinderRight");
    
        this.circleData.x = this.highestPoint.x - Math.abs(this.farthestPoint.x - this.highestPoint.x) / 2.;
		this.circleData.y = this.highestPoint.y - Math.abs(this.farthestPoint.y - this.highestPoint.y) / 2;
		const cosAngle = MathHelper.CosinusTheorem(this.circleData.radius, MathHelper.DistanceBtwPoints(this.circleData, this.highestPoint), Math.abs(this.circleData.x - this.highestPoint.x));
		let angle = Math.acos(cosAngle);

        cylinderLeft.geometry.center();
        cylinderRight.geometry.center();

        cylinderLeft.rotation.z = -(angle + Math.PI / 8);
        cylinderRight.rotation.z = angle + Math.PI / 8;

        cylinderLeft.position.x = -this.circleData.x;
        cylinderLeft.position.y = this.circleData.y;
        cylinderLeft.position.z = this.circleData.z;

        cylinderRight.position.x = this.circleData.x;
        cylinderRight.position.y = this.circleData.y;
        cylinderRight.position.z = this.circleData.z;
    
        console.log(this.circleData.radius);
    }

    /*
        This step handling blowing of toroid. In fact it is animated by appearance and blowing a sphere which will eventually cover main loop and will enable unhooking
        conjoined loops.
    */
    stepBlowToroid()
    {
        this.removeAllObjects(this.scene);

        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: this.color } ), "name1", this.scene);
        this.addObjectToScene(new THREE.SphereGeometry(0.70 * this.counters[0], 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "ball", this.scene);

        const sphereObj = this.scene.getObjectByName("ball");
        sphereObj.position.set(1.3, -3.5, 0);

        this.counters[0]++;
    }

    /*
        Helper function for drawing conjoined loops. It is adding conjoined loops to scene and sets them conjoined in first part of the animation.
        This function also adds base cylinders to scene to give final look of initial state of animation.    
    */
    drawStaticLoops()
    {
        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedTorusXConstants.bind(this), 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop1", this.scene);
        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedTorusXConstants.bind(this), 40, 40), new THREE.MeshLambertMaterial( { color: this.color } ), "loop2", this.scene);

        this.addBottomCylindersToScene();

        const obj1 = this.scene.getObjectByName("loop1");
        const obj2 = this.scene.getObjectByName("loop2");

        obj1.position.set(-3.2, 8, 0);
        obj2.position.set(3.2, 8, 0);

        obj1.geometry.center();
        obj2.geometry.center();

        obj1.rotation.z = -Math.PI / 4.;
        obj2.rotation.z = Math.PI / 3.;

        //obj1.position.set(-0.7, 10, 0);
        //obj2.position.set(-0.5, 9, -2.4);
    
        obj1.position.set(1.4, 11.7, 0);
        obj2.position.set(-1.9, 10.5, -2.4);
    }

    /*
        This step handling preparing loops for unhooking. It moves left loop to the position from which loops might be easily unhooked. It uses cosinus and sinus functions
        for circle-like movement.
    */
    stepMoveLoopBeforeUnhooking()
    {
        /* Remove bottom cylinders as we do not need them anymore */
        const cylinderLeft = this.scene.getObjectByName("cylinderLeft");
        const cylinderRight = this.scene.getObjectByName("cylinderRight");

        this.scene.remove(cylinderLeft);
        this.scene.remove(cylinderRight);

        const obj1 = this.scene.getObjectByName("loop1");
        const obj2 = this.scene.getObjectByName("loop2");

        obj1.position.set(-3.2, 8, 0);
        obj2.position.set(3.2, 8, 0);

        obj1.rotation.z = -Math.PI / 4.;
        obj2.rotation.z = Math.PI / 3.;

        const angle = this.counters[1] / 10. * Math.PI / 6;
        const r = 10;

        /* Apply positions to move left loop on circular-like path) */
        //obj1.position.set(-0.7, r * Math.cos(angle), r * Math.sin(angle));
        //obj2.position.set(-0.5, 9, -2.4);

        obj1.position.set(1.4, 11.7 * Math.cos(angle), 11.7 * Math.sin(angle));
        obj2.position.set(-1.9, 10.5, -2.4);

        this.counters[1]++;
    }

    /*
        This step handling unhooking loops. It uses circle like movement with help of sinus and cosinus functions to move the loops on the sphere.
        Both loops are moved to opposite "sides" of the sphere to later connect them when shrinking central ball in the next step.
    */
    stepUnhookLoops()
    {
        const obj1 = this.scene.getObjectByName("loop1");
        const obj2 = this.scene.getObjectByName("loop2");

        //const angle1 = this.counters[2] / 20. * 2.06 * Math.PI / 4.;
        //const angle2 = this.counters[2] / 20. * 2.06 * Math.PI / 4.;
        const angle1 = this.counters[2] / 20 * 2.06 * Math.PI / 4.;
        const angle2 = this.counters[2] / 20. * 2.06 * Math.PI / 4.

        const R1 = MathHelper.DistanceBtwPoints(new THREE.Vector2(obj1.position.x, obj1.position.y), new THREE.Vector2(0, 0));
        const R2 = MathHelper.DistanceBtwPoints(new THREE.Vector2(obj2.position.x, obj2.position.y), new THREE.Vector2(0, 0)); 

        if(obj1.position.x < R1 * Math.sin(angle1))
        {

            obj1.position.x = R1 * Math.sin(angle1);
            obj1.position.y = R1 * Math.cos(angle1);
        }

        if(obj2.position.x > -R2 * Math.sin(angle2))
        {
            obj2.position.x = -R2 * Math.sin(angle2);
            obj2.position.y = R2 * Math.cos(angle2);
        }

        this.counters[2]++;
    }

    /* 
        This step is responsible for shrinking the sphere. To keep object consisten loops are getting closer to each other when ball is shrinking.
        Mostly decreasing radius length and hardcoded movement were used in this step.
    */
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
        newBall.position.y = -3.4;

        //loop1.position.x -= 0.25;
        //loop2.position.x += 0.25;

        loop1.position.x -= 0.34;
        loop2.position.x += 0.34;

        this.counters[3]++;
    }

    /*
        It is final step of animation. Its main responsibility is to start changing rotation of the loops so the final result looks more "straightforward".
        Function is also intended for continuing shrinking of the ball and its eventual removal.
    */
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

        if(this.counters[4] > 15)
        {
            this.scene.remove(ball);
        }
        else
        {
            if(ball.geometry.parameters.radius >= 0)
            {
                this.scene.remove(ball);
                this.addObjectToScene(new THREE.SphereGeometry(ball.geometry.parameters.radius - 0.1, 40, 40), new THREE.MeshLambertMaterial( {color: this.color} ), "ball", this.scene);
                const newBall = this.scene.getObjectByName("ball");
                newBall.position.x = 1.3;
                newBall.position.y = ball.position.y + 0.2;
            } 
        }

        this.counters[4]++;
    }

    /*
        This function is responsible for providing parametrization of the main loop as torus-like object. Same parametrization as in ToroidToMugAnimation was used.
        It is also responsible (as well as in ToroidToMug case) for finding points which will be helpful with calculating tangent of base-cylinders.
    */
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
    
        if(y > this.maxY)
        {
            this.maxY = y;
            this.highestPoint.x = x;
            this.highestPoint.y = y;
            this.circleData.z = z;
            this.circleData.radius = r;
        }
    
        if(Math.abs(x) < this.maxX && y > 2)
        {
            this.maxX = Math.abs(x);
            this.farthestPoint.x = x;
            this.farthestPoint.y = y;
        }
    
        target.set(x, y, z);
    }

    /*
        This function is responsible for providing basic parametrization for conjoined loops. It is just parametrization of the torus, but with big circle's plane always orthogonal to
        0X axis. Later those toruses are moved along 0Z axis and rotated along that axis to achieve effect of conjoiness.
    */
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