export class SceneController
{
    static FromSceneCameraAndOrbitControls(scene, camera, controls)
    {
        const sceneController = new SceneController();
        
        sceneController.scene = scene;
        sceneController.controls = controls;
        sceneController.camera = camera;

        return sceneController;
    }

    setCameraPosition(position)
    {
        this.camera.position.set(position.x, position.y, position.z);
    }

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

    loadAnimation(animation)
    {
        this.animation = animation;
    }

    startAnimation(speed)
    {
        this.animation.begin(speed);
    }
}
