/*
    This is an abstract class.
*/

export class Animation
{
    constructor()
    {
        this.objectNames = [];

        if(this.constructor === Animation)
        {
            throw new Error("This is an abstract class.");
        }
    }

    doStep()
    {
        throw new Error("Function doStep() should be implemented.");
    }

    begin(speed)
    {
        throw new Error("Function begin() should be implemented.");
    }

    removeAllObjects(scene) {
	
        for(const objName of this.objectNames)
        {
            const obj = scene.getObjectByName(objName);
            scene.remove(obj);
        }
    
        this.objectNames.length = 0;
    }
    
    addObjectToScene(geometry, material, name, scene) {
        material.side = THREE.DoubleSide;
    
        const mesh = new THREE.Mesh (geometry, material);
        mesh.name = name;
    
        this.objectNames.push(name);
    
        scene.add(mesh);
    }
}