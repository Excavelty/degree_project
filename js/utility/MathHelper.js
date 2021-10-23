export class MathHelper
{
    static CosinusTheorem(a, b, c)
    {
        const angle = (a * a + b * b - c * c) / (2 * a * b);

        return angle;
    }

    static DistanceBtwPoints(p1, p2)
    {
        const distanceX = Math.abs(p1.x - p2.x);
        const distanceY = Math.abs(p2.y - p1.y);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        return distance;
    }

    static GetRotationQuaternion(axisUnitVector, rotation)
    {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axisUnitVector, rotation);

        return quaternion;
    }
}