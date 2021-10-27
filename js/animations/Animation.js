/*
    This is an abstract class.
    It is parent class for all predefined animations in the project.
*/

export class Animation
{
    /* 
        Constructor of abstract class.
        Its only responsibility is to create objectNames field in class for storing names of objects
        existing on specific frame in scene during animation.    
    */
    constructor()
    {
        this.objectNames = [];

        if(this.constructor === Animation)
        {
            throw new Error("This is an abstract class.");
        }
    }

    /*
        This function has to be overriden in child classes.
        Its responsibility is to handle specific frame of animation.
        Implementation is highly dependant on animation's needs but general idea is to
        create objects with proper parametrization for a specific frame in animation.
    */
    doStep()
    {
        throw new Error("Function doStep() should be implemented.");
    }

    /*
        This function has to be overriden in child classes.
        Its responsibility is to trigger animation with a given interval between frames.
        Parameters:
        - speed (Integer) - frequency of frame changes in [1 / ms]
    */
    begin(frequency)
    {
        throw new Error("Function begin() should be implemented.");
    }

    /*
        This function enables removing from scene all objects added through addObjectToScene method.
        Parameters:
        - scene (THREE.Scene)
    */
    removeAllObjects(scene) {
	
        for(const objName of this.objectNames)
        {
            const obj = scene.getObjectByName(objName);
            scene.remove(obj);
        }
    
        this.objectNames.length = 0;
    }
    
    /*
        This function is responsible for adding a new mesh to scene. It adds newly added mesh's name to array of names which might be later used to receive specific object.
        Parameters:
        - geometry (THREE.Geometry) - geometry of new Mesh
        - material (THREE.Material) - material of new Mesh
        - name (String) - name of newly added Mesh
        - scene (THREE.Scene) - scene to which new Mesh will be added
    */

    addObjectToScene(geometry, material, name, scene) {
        material.side = THREE.DoubleSide;
    
        const mesh = new THREE.Mesh (geometry, material);
        mesh.name = name;
    
        this.objectNames.push(name);
    
        scene.add(mesh);
    }
}