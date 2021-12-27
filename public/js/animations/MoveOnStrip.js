import {Animation} from './Animation.js'

export class MoveOnStrip extends Animation 
{
        /*
        Constructor of the class will pass the scene to class field.
        Not handling of scene in parent class is caused by backward compatibility and need of several changes during potential refactoring.
    */    
        constructor(scene)
        {
            super();
            this.scene = scene;
    
            this.running = false;

            this.DIVIDER = 40;

            this.positions = [];
            this.normals = [];
            
            for(let i = 0; i < this.DIVIDER; ++i) {
                this.preparePositions(i, this.DIVIDER);
            }

            for(let i = 0; i < this.DIVIDER; ++i) {
                this.positions.push(this.positions[i]);
                this.normals.push({
                    x: -this.normals[i].x, 
                    y: -this.normals[i].y, 
                    z: -this.normals[i].z});
            }

            for(let i = 0; i < 10; ++i) {
                this.normals[i].x = -this.normals[i].x;
                this.normals[i].y = -this.normals[i].y;
                this.normals[i].z = -this.normals[i].z;
            }

            for(let i = 10; i <= 15; ++i)
            {
                this.normals[i].y += (15 - i) * 0.2;
            }

            this.normals[5].x -= 0.8;
            this.normals[5].y -= 1.2;
            this.normals[5].z -= 0.7;
            this.normals[6].y += 1;
            this.normals[7].y += 1;
            this.normals[8].z -= 1.8;

            //this.normals[8].x += 0.1;
            this.normals[9].x += 0.1;
            this.normals[9].y += 1.4;
            this.normals[9].z -= 1.4;

            for(let i = 28; i <= 37; ++i)
            {
                this.normals[i].y += (37 - i) * 0.3;
            }

            this.normals[35].y += 0.8

            for(let i = 30; i <= 40; ++i) {
                this.normals[i].x = -this.normals[i].x;
                this.normals[i].y = this.normals[i].y + 0.4;
                this.normals[i].z = -this.normals[i].z;
            }

            for(let i = 31; i <= 34; ++i) {
                this.normals[i].y += 2;
            }

            for(let i = 40; i < 50; ++i) {
                this.normals[i].x -= 2;
                this.normals[i].y -= 2;
            }

            this.normals[44].y -= 2.2;
            this.normals[44].z -= 0.8;
            this.normals[44].x += 1.;
            this.normals[45].y -= 2.;
            this.normals[45].z -= 2;

            for(let i = 48; i <= 51; ++i) {
                this.normals[i].y -= 1.5;
                this.normals[i].z -= 1.5
            }

            this.normals[40] = this.normals[39];
            this.normals[49].y += 1;

            for(let i = 45; i <= 50; ++i) {
                // this.normals[i].x += 0.3;
                this.normals[i].y += 0.5;
            }

            for(let i = 69; i < 80; ++i) {
                this.normals[i].x = -this.normals[i].x;
                this.normals[i].y = -this.normals[i].y;
                this.normals[i].z = -this.normals[i].z;
            }

            this.normals[69].y -= 2;
            this.normals[70].y -= 1;
            this.normals[71].y -= 1;

            this.material = new THREE.MeshPhongMaterial({color: 0xff0000});

            this.counter = 0;
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
                this.addObjectToScene(new THREE.SphereGeometry(0.4, 40., 40.), this.material, "sphere" + this.counter, this.scene)
                const currentSphere = this.scene.getObjectByName("sphere" + this.counter);
                
                currentSphere.position.x = this.positions[this.counter].x + 0.4 * this.normals[this.counter].x;
                currentSphere.position.y = this.positions[this.counter].y + 0.4 * this.normals[this.counter].y;
                currentSphere.position.z = this.positions[this.counter].z + 0.4 * this.normals[this.counter].z;

                name = "sphere" + (this.counter - 1);

                this.counter++;

                if(this.counter == 2 * this.DIVIDER) {
                    this.counter = 0;
                }

                let sphereToRemove = this.scene.getObjectByName(name);

                this.scene.remove(sphereToRemove);

                sphereToRemove = this.scene.getObjectByName("sphere" + (2 * this.DIVIDER - 1));

                this.scene.remove(sphereToRemove);
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
            /* continous animation */
            return false;
        }

        /*
            This function uses Mobius strip to indicate positions for animating movement on the strip's surface
        */
        preparePositions(counter, divider)
        {
            let u = counter / divider * Math.PI;
            let t = 2 * counter / divider * Math.PI;
            u = u * 2;
            const phi = u / 2;
            const major = 5.25,
                a = 0.125,
                b = 0.625;
            let x = a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi );
            const z = a * Math.cos( t ) * Math.sin( phi ) + b * Math.sin( t ) * Math.cos( phi );
            const y = ( major + a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi ) ) * Math.sin( u );
            x = ( major + a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi ) ) * Math.cos( u );

            const x_prim_t = Math.cos(u) * (-a * Math.sin(t) * Math.cos(phi) - b * Math.cos(t) * Math.sin(phi));
            const y_prim_t = Math.sin(u) * (-a * Math.sin(t) * Math.cos(phi) - b * Math.cos(t) * Math.sin(phi));
            const z_prim_t = - a * Math.sin(t) * Math.sin(phi) + b * Math.cos(t) * Math.cos(phi);
            
            const x_prim_u = Math.cos(u) * (- a * Math.cos(t) * 0.5 * Math.sin(phi) - b * Math.sin(t) * 0.5 * Math.cos(phi)) + ( major + a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi ) ) * (-Math.sin(u));
            const y_prim_u = Math.sin(u) * (- a * Math.cos(t) * 0.5 * Math.sin(phi) - b * Math.sin(t) * 0.5 * Math.cos(phi)) + ( major + a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi ) ) * Math.cos(u) ;
            const z_prim_u = a * Math.cos(t) * 0.5 * Math.cos(phi) - b * Math.sin(t) * 0.5 * Math.sin(phi);

            const newNormal = this.normalFromPartialDerivativesCrossProduct(
                {
                    x: x_prim_t,
                    y: y_prim_t,
                    z: z_prim_t
                }, 

                {
                    x: x_prim_u,
                    y: y_prim_u,
                    z: z_prim_u
                }
            )

            if(isNaN(newNormal.x) || isNaN(newNormal.y) || isNaN(newNormal.z)) {
                newNormal.x = 0;
                newNormal.y = 0;
                newNormal.z = 0;
            }

            this.normals.push({
                x: newNormal.x,
                y: newNormal.y,
                z: newNormal.z               
            });

            console.log(newNormal);

            this.positions.push({
                x: x,
                y: y,
                z: z
            })
        }

        /*
            Normal in point is being calculated as cross product of partial derivatives
        */
        normalFromPartialDerivativesCrossProduct(dt, du) {
            /* 
                According to Sarus rule: 
                | i      j      k   | 
                | dt.x  dt.y   dt.z | = (dt.y * du.z - dt.z * du.y) * i + (dt.z * du.x - dt.x * du.z) * j + (dt.x * du.y - du.x * dt.y) * k
                | du.x  du.y   du.z |
            
            */

            const normal = {
                x: dt.y * du.z - dt.z * du.y,
                y: dt.z * du.x - dt.x * du.z,
                z: dt.x * du.y - du.x * dt.y
            };

            const length = Math.sqrt(normal.x * normal.x + normal.y + normal.y + normal.z * normal.z);
            console.log("L = " + length);
            console.log(normal);

            normal.x = normal.x / length;
            normal.y = normal.y / length;
            normal.z = normal.z / length;

            const length2 = Math.sqrt(normal.x * normal.x + normal.y + normal.y + normal.z * normal.z);
            console.log("L2 = " + length2);

            return normal;
        }

        normalizeDistances() {
            for(let i = 0; i < this.DIVIDER; ++i) {
                factor = 0.2 / Math.sqrt((1. * (this.normals[i].x * this.normals[i].x + this.normals[i].y * this.normals[i].y))); 
            }
        }
}