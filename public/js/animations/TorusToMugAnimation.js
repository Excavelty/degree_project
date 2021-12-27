import { Animation } from "./Animation.js";
import { MathHelper } from "../utility/MathHelper.js";

/*
    Class for handling animation of resolving torus-like geometry (genus=1 closed loop)
    into mug-like object. It is visualization of one of the most popular topological
    homeomorphisms.

    Parametrization of resolving torus-like object (loop) into straight cylinder originated from the following article:
    https://analyticphysics.com/Mathematical%20Methods/Transforming%20a%20Torus%20into%20a%20Cylinder.htm

*/

export class TorusToMugAnimation extends Animation
{
    /*
        Constructor of the class will pass the scene to class field.
        Not handling of scene in parent class is caused by backward compatibility and need of several changes during potential refactoring.
    */    
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


        /* Initialize structures to hold data useful to indicate tangent angle and position of mugs base - bottoms ("flat" cylinders) */
        this.circleData = {
            radius: 0,
            x: 0,
            y: 0,
            z: 0
        }
        
        /* Farthest point of bottom base-cylinder is in 0X+ direction */
        this.farthestPoint = {
            x: 0,
            y: 0
        }
        
        /* Farthest point of object in 0Y+ direction */
        this.highestPoint = {
            x: 0,
            y: 0
        }
        
        this.maxY = 0;
        this.maxX = 0;
    
        this.currentAnimationStep = 1;
        this.totalAnimationSteps = 65;

        this.running = false;
    }

    /* @override */
    /* 
        Counter's ranges are adjusted by hand depending on the behavior of animation 
        Function is responsible for invoking in specific frame creating proper parametrization.
    */
    doStep()
    {
        if(this.running)
        {
            if(this.counters[0] < 20)
            {
                this.stepResolveToCylinder();
                this.addStepDescription("The first part of the transformation is to deform the bottom part of the torus into a solid cylinder.\
                Note, that the deformation is continous, that is without tearing the surface.\
                Parametric equations for the torus needed in this animation are based on circle's evolvents and are described in the paper.");
                this.currentAnimationStep++;
            }

            if(this.counters[1] < 14 && this.counters[0] > 12)
            {
                this.stepShrinkTopRotateCylinders();
                this.addStepDescription("The top of the object is shrinked horizontally to start forming the mug's handle, while the bottom solid cylinder will be the mug's body.");
                this.currentAnimationStep++;
            }

            if((this.counters[1] >= 14 && this.counters[2] < 20) || (this.counters[3] < 20 && this.counters[0] >= 20))
            {
                this.stepAdjustHandleMoveCylinder();
                this.addStepDescription("In the last step we adjust the top part to look more handle-like and we create a dimple to make interior of the mug. Notice, that the dimple is a continous transformation, since we do not create an actual hole in terms of topology.");
                this.currentAnimationStep++;
            }
        }
    }

    /* @override */
    /* This function triggers animation with interval between frames specifiend in ms in frequency parameter. */
    begin(frequency)
    {
        this.running = true;
        window.setInterval(this.doStep.bind(this), frequency);
    }

    /* @override */
    isAnimationOver()
    {
        const isOver = this.counters[3] >= 20;
        return isOver;
    }

    /* 
        This step is responsible for most important part of animation: using parametrization to animate resolving lower part of torus into cylinder
    */
    stepResolveToCylinder()
    {
        this.removeAllObjects(this.scene);

        /* Add both parts of torus to scene */
        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1", this.scene);
        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedUpper.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2", this.scene);	

        /* Add base-cylinder and calculate its tangent angle using cosinus theorem */
        const geometry = new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 1, 32, 32);

        this.addObjectToScene(geometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name3', this.scene);

        const obj2 = this.scene.getObjectByName('name3');

        if(Math.abs(this.farthestPoint.x - this.highestPoint.x) < 0.001)
        {
            this.highestPoint.x -= 2 * this.circleData.radius;
        }

        this.circleData.x = this.highestPoint.x + (this.farthestPoint.x - this.highestPoint.x) / 2.;
        this.circleData.y = this.farthestPoint.y + Math.abs(this.farthestPoint.y - this.highestPoint.y) / 2;
        const cosAngle = MathHelper.CosinusTheorem(this.circleData.radius, MathHelper.DistanceBtwPoints(this.circleData, this.highestPoint), Math.abs(this.circleData.x - this.highestPoint.x));
        let angle = Math.acos(cosAngle);
        if(isNaN(angle))
        {
            angle = 0;
            obj2.rotation.z = Math.PI;
            obj2.position.x = this.circleData.x - 2;
        }

        else
        {
            obj2.rotation.z = Math.PI / 2 + angle + 0.2 * (10 - this.counters[0]) / 9;
            obj2.position.x = this.circleData.x;
        }
        obj2.position.y = this.circleData.y;
        obj2.position.z = this.circleData.z;
        obj2.geometry.center();

        /* Add second cylinder and set its position and angle based on the position of the first cylinder. */
        const repeatedCylinderGeometry = new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 1, 32, 32);
            
        this.addObjectToScene(repeatedCylinderGeometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name4', this.scene);

        const obj3 = this.scene.getObjectByName('name4');
        obj3.rotation.z = -obj2.rotation.z;
        obj3.position.x = -obj2.position.x;
        obj3.position.y = this.circleData.y;
        obj3.position.z = this.circleData.z;

        this.circleData.x = this.circleData.y = this.circleData.z = this.maxY = this.maxX = this.circleData.radius = Number.NEGATIVE_INFINITY;

        const obj = this.scene.getObjectByName('name2');
        obj.rotation.x = Math.PI;
        obj.position.y += (12 - this.counters[0]/20 * 10);

        this.counters[0]++;
    }

    /* 
        Function is responsible for medium step of the animation. It will keep shrinking top part of torus to make it look like mug handle. It will also take care of
        rotation base cylinders so it will prevent creation of unwanted empty spaces and will enable keeping consistency of animated object. 
    */    
    stepShrinkTopRotateCylinders()
    {
        // Removing all objects from scene */
        this.removeAllObjects(this.scene);

        /* Add both parts of torus to scene */
		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1", this.scene);
		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedUpperFinish.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2", this.scene);	

        /* Add base-cylinder and apply its tangent angle based on cosinus theorem */
		const geometry = new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 1, 32, 32);

		this.addObjectToScene(geometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name3', this.scene);

		const obj2 = this.scene.getObjectByName('name3');
		this.circleData.x = this.highestPoint.x + (this.farthestPoint.x - this.highestPoint.x) / 2.;
		this.circleData.y = this.farthestPoint.y + Math.abs(this.farthestPoint.y - this.highestPoint.y) / 2;
		const cosAngle = MathHelper.CosinusTheorem(this.circleData.radius, MathHelper.DistanceBtwPoints(this.circleData, this.highestPoint), Math.abs(this.circleData.x - this.highestPoint.x));
		let angle = Math.acos(cosAngle);

		if(isNaN(angle))
		{
			angle = Math.PI / 2;
		}

		obj2.rotation.z = Math.PI / 2 + angle;
		obj2.position.x = this.circleData.x;
		obj2.position.y = this.circleData.y;
		obj2.position.z = this.circleData.z;
		obj2.geometry.center();

        /* Add second base-cylinder based on position and rotation of the first base-cylinder. */
		const repeatedCylinderGeometry = new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 1, 32, 32);
		
		this.addObjectToScene(repeatedCylinderGeometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name4', this.scene);

		const obj3 = this.scene.getObjectByName('name4');
		obj3.rotation.z = -Math.PI / 2 - angle;
		obj3.position.x = -this.circleData.x
		obj3.position.y = this.circleData.y;
		obj3.position.z = this.circleData.z;

		this.circleData.x = this.circleData.y = this.circleData.z = this.maxY = this.maxX = this.circleData.radius = this.highestPoint.x = this.highestPoint.y = this.farthestPoint.x = this.farthestPoint.y = Number.NEGATIVE_INFINITY;

		const obj = this.scene.getObjectByName('name2');
		obj.rotation.x = Math.PI;
		obj.position.y += (12 - this.counters[0]/20 * 10);

        /* Increase the counter. */
		this.counters[1]++;
    }

    /* 
        This function will be responsible for handling final part of animation.
        It will adjust handle of the mug and will later move the cylinder to "create" space inside mug to give it a look of "real" mug.
    */
    stepAdjustHandleMoveCylinder()
    {
        // Remove objects from scene*/
        this.removeAllObjects(this.scene);

        /* Adding to scene parametrization for upper and bottom parts of torus changing into a mug.  */
		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1", this.scene);
		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedUpperFinish.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2", this.scene);	

        /* Create geometry for base (bottom) cylinder and add it to scene*/
		const geometry = new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 1, 32, 32);

		this.addObjectToScene(geometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name3', this.scene);

        /* Calculate tangent angle of the bottom-cylinder using consinus theorem. */
		const obj2 = this.scene.getObjectByName('name3');
		this.circleData.x = this.highestPoint.x + (this.farthestPoint.x - this.highestPoint.x) / 2.;
		this.circleData.y = this.farthestPoint.y + Math.abs(this.farthestPoint.y - this.highestPoint.y) / 2;
		const cosAngle = MathHelper.CosinusTheorem(this.circleData.radius, MathHelper.DistanceBtwPoints(this.circleData, this.highestPoint), Math.abs(this.circleData.x - this.highestPoint.x));
		let angle = Math.acos(cosAngle);

        /* In case angle is not a number, then indicate its rotation is Math.PI / 2 */
		if(isNaN(angle))
		{
			angle = Math.PI / 2;
		}

        /* Set rotation and position of the base-cylinder */
		obj2.rotation.z = Math.PI / 2 + angle;
		obj2.position.x = this.circleData.x;

        /* In proper moment - proceed with moving one of the cylinders to create interior of the mug */
		if(this.counters[2] >= 20)
		{
			obj2.position.x = this.circleData.x - this.counters[3] / 20 * 20;
			this.counters[3]++;
		}
	
		obj2.position.y = this.circleData.y;
		obj2.position.z = this.circleData.z;
		obj2.geometry.center();

        /* 
            Create second base-cylinder and set its position based on the position of the first cylinder.
        */
		const repeatedCylinderGeometry = new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 1, 32, 32);
		
		this.addObjectToScene(repeatedCylinderGeometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name4', this.scene);

		const obj3 = this.scene.getObjectByName('name4');
		obj3.rotation.z = -Math.PI / 2 - angle;
		obj3.position.x = -this.circleData.x
		obj3.position.y = this.circleData.y;
		obj3.position.z = this.circleData.z;

		this.circleData.x = this.circleData.y = this.circleData.z = this.maxY = this.maxX = this.circleData.radius = this.highestPoint.x = this.highestPoint.y = this.farthestPoint.x = this.farthestPoint.y = Number.NEGATIVE_INFINITY;

        /* Access mug's handle element and move it not to loose object's consistency.*/
		const obj = this.scene.getObjectByName('name2');
		obj.rotation.x = Math.PI;
		obj.position.y += (12 - this.counters[0]/20 * 10);
		if(this.counters[2] <= 10)
		{
			obj.position.y += (this.counters[2] * 1.5) / 10 * 1;
		}

		else
		{
			obj.position.y += 1.5;
		}

        /* Increment animation counters when needed to make smooth animation. */

		if(this.counters[2] < 20)
		{
			this.counters[2]++;
		}

		else
		{
			this.counters[3]++;
		}
    }

    /*
        Function proving parametrization for most critical part of animated object.
        The parametrization will result in drawing part of torus-like object at the very beggining and will be later "resolved"
        using equation originating from circle's evolvent into cylinder-like object (main part of a mug).

        Secondary responsibility of the function is to find parameters needed later for calculating tangent angle of cylinder bases during animation (bottoms of resolved object).
    */
    parametrizedFunction(c, d, target) {
        const u = 0.678 + 0.32 * (this.counters[0] / 20.);
        const a = 2 * Math.PI * c;
        const t = ((Math.PI - a) * u + a);
        const fi = 2 * Math.PI * d;
    
        const R = 5 - (this.counters[0] / 20) * 2;
        const r = 2 + (this.counters[0] / 20) * 2;
    
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

    /*
        Function providing parametrization for upper part of animated object.
        it is just part of torus-like object which will be moved down Y-axis to behave as handle of a mug appearing during animation.
    */
    parametrizedUpper(c, d, target)
    {
        const u = 0.68;
        const a = 2 * Math.PI * c;
        const t = ((Math.PI - a) * u + a);
        const fi = 2 * Math.PI * d;


        const R = 5;
        const r = 2 - (this.counters[0] / 20) * 1;

        const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));

        const x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
        const y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
        const z = r * Math.sin(fi);

        target.set(x, y, z);
    }

    /* 
        Function providing parametrization for upper part of animated object during late part of animation 
        This parametrization is responsible for animating adjustement of mug's handle.    
    */
    parametrizedUpperFinish(c, d, target)
    {
        const u = 0.68;
        const a = 2 * Math.PI * c;
        const t = ((Math.PI - a) * u + a);
        const fi = 2 * Math.PI * d;


        const R = this.counters[2] == 0? 5 - this.counters[1] / 10 * 1.6 : 5 - this.counters[1] / 10 * 1.6 - this.counters[2] / 20 * 0.6;
        const r = 2 - (this.counters[0] / 20) * 1;

        const multiplicator = r * Math.cos(fi) / (Math.sqrt(1 + Math.pow(t - a, 2) * Math.pow(1 - u, 2)));

        const x = R * (Math.sin(t) - (t - a) * Math.cos(t)) + multiplicator * (Math.sin(t) - (t - a) * (1 - u) * Math.cos(t));
        const y = R * (Math.cos(t) + (t - a) * Math.sin(t)) + multiplicator * (Math.cos(t) + (t - a) * (1 - u) * Math.sin(t));
        const z = r * Math.sin(fi);

        target.set(x, y, z);
    }
}