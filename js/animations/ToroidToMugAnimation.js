import { Animation } from "./Animation.js";
import { MathHelper } from "../utility/MathHelper.js";

export class ToroidToMugAnimation extends Animation
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

        this.circleData = {
            radius: 0,
            x: 0,
            y: 0,
            z: 0
        }
        
        this.farthestPoint = {
            x: 0,
            y: 0
        }
        
        this.highestPoint = {
            x: 0,
            y: 0
        }
        
        this.maxY = 0;
        this.maxX = 0;
    }

    /* @override */
    doStep()
    {
        if(this.counters[0] < 20)
        {
            this.stepResolveToCylinder();
        }

        if(this.counters[1] < 14 && this.counters[0] > 12)
        {
            this.stepShrinkTopRotateCylinders();
        }

        if((this.counters[1] >= 14 && this.counters[2] < 20) || this.counters[3] < 20)
        {
            this.stepAdjustHandleMoveCylinder();
        }
    }

    /* @override */
    begin(speed)
    {
        console.log(this.counters);
        window.setInterval(this.doStep.bind(this), speed);
    }

    stepResolveToCylinder()
    {
        this.removeAllObjects(this.scene);

        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1", this.scene);
        this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedUpper.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2", this.scene);	

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
        }

        obj2.rotation.z = Math.PI / 2 + angle + 0.4 * (10 - this.counters[0]) / 9;
        obj2.position.x = this.circleData.x;
        obj2.position.y = this.circleData.y;
        obj2.position.z = this.circleData.z;
        obj2.geometry.center();

        const repeatedCylinderGeometry = new THREE.CylinderGeometry(this.circleData.radius, this.circleData.radius, 1, 32, 32);
            
        this.addObjectToScene(repeatedCylinderGeometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ), 'name4', this.scene);

        const obj3 = this.scene.getObjectByName('name4');
        obj3.rotation.z = -obj2.rotation.z;
        obj3.position.x = -this.circleData.x
        obj3.position.y = this.circleData.y;
        obj3.position.z = this.circleData.z;

        this.circleData.x = this.circleData.y = this.circleData.z = this.maxY = this.maxX = this.circleData.radius = Number.NEGATIVE_INFINITY;

        const obj = this.scene.getObjectByName('name2');
        obj.rotation.x = Math.PI;
        obj.position.y += (12 - this.counters[0]/20 * 10);

        this.counters[0]++;
    }

    stepShrinkTopRotateCylinders()
    {
        this.removeAllObjects(this.scene);

		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1", this.scene);
		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedUpperFinish.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2", this.scene);	

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

		this.counters[1]++;
    }

    stepAdjustHandleMoveCylinder()
    {
        this.removeAllObjects(this.scene);

		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedFunction.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name1", this.scene);
		this.addObjectToScene(new THREE.ParametricGeometry( this.parametrizedUpperFinish.bind(this), 40, 40 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ), "name2", this.scene);	

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

		if(this.counters[2] >= 20)
		{
			obj2.position.x = this.circleData.x - this.counters[3] / 20 * 20;
			this.counters[3]++;
		}
	
		obj2.position.y = this.circleData.y;
		obj2.position.z = this.circleData.z;
		obj2.geometry.center();

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
		if(this.counters[2] <= 10)
		{
			obj.position.y += (this.counters[2] * 1.5) / 10 * 1;
		}

		else
		{
			obj.position.y += 1.5;
		}

		if(this.counters[2] < 20)
		{
			this.counters[2]++;
		}

		else
		{
			this.counters[3]++;
		}
    }

    parametrizedFunction(c, d, target) {
        const u = 0.68 + 0.32 * (this.counters[0] / 20.);
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