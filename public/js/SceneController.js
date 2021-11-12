/*
    This class provides additional layer of abstraction for some of the scene-related THREE.js features
    and is responsible for providing high-level API for triggering predefined animations.
*/
export class SceneController
{
    /*
        Static factory method of the class.
        Parameters:
        - scene (THREE.Scene)
        - camera (THREE.PerspectiveCamera)
        - controls (THREE.OrbitControls)
        Returns: sceneController (SceneController)    
    */
    static FromSceneCameraAndOrbitControls(scene, camera, controls)
    {
        const sceneController = new SceneController();
        
        sceneController.scene = scene;
        sceneController.controls = controls;
        sceneController.camera = camera;

        return sceneController;
    }

    /*
        Set camera position in 3d space.
        Parameters:
        - position (struct with x, y, z fields: {x, y, z})
    */
    setCameraPosition(position)
    {
        this.camera.position.set(position.x, position.y, position.z);
    }

    /*
        Set camera rotation in 3d space.
        Parameters:
        - rotation (struct - vector with x, y, z fields: {x, y, z})
    */
    setCameraRotation(rotation)
    {
        this.camera.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    addPointLight(color, intensity, position)
    {
        const newLight = new THREE.PointLight(color, intensity, 100);
        newLight.position.set(position.x, position.y, position.z);

        this.scene.add(newLight);
    }

    /*
        Load animation to scene controller which might be later initiated
        Parameters:
        - animation (Animation) - any animation object of class derived from Animation.    
    */
    loadAnimation(animation)
    {
        this.animation = animation;
    }

    /*
        Start loaded animation with a given frequency
        Parameters:
        - frequency (Integer) - animation frame's frequency/interval in [1 / ms]    
    */
    startAnimation(frequency)
    {
        this.animation.begin(frequency);
    }

    /*
        Execute single animation step. In this mode additional information describing animations is going to be provided
    */
    doAnimationStep()
    {
        this.animation.doStep();
    }

    /*
        Check if animation 
        Returns
        = isOver (boolean)
    */
    isAnimationOver()
    {
        const isOver = this.animation.isAnimationOver();
        return isOver;
    }
}
