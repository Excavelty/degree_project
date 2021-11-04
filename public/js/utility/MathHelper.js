/*
    Class with only static functions providing some additional math calculations.
*/
export class MathHelper
{
    /*
        Function returning cosinus of angle using cosinus theorem
        Parameters: a, b, c (Float) - lengths of triangle sides
        Returns: cosAngle (Float) - cosinus of angle between a and b sides
    */
    static CosinusTheorem(a, b, c)
    {
        const cosAngle = (a * a + b * b - c * c) / (2 * a * b);

        return cosAngle;
    }

    /*
        Function returning distance between two points in two-dimensional space.
        Parameters: p1, p2 (structs containing x and y fields - {x, y})
        Returns: distance (Float)
    */
    static DistanceBtwPoints(p1, p2)
    {
        const distanceX = Math.abs(p1.x - p2.x);
        const distanceY = Math.abs(p2.y - p1.y);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        return distance;
    }

    /* Deprecated?
    static GetRotationQuaternion(axisUnitVector, rotation)
    {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axisUnitVector, rotation);

        return quaternion;
    }
    */
}