export const MTP = 60; // Meters to pixels
export const PTM = 1 / MTP; // Pixels to meters

// Immutable
export class Vector2 {
    static readonly ZERO = new Vector2(0, 0);

    constructor(readonly x: number, readonly y: number) {
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    mul(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    div(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }
    
    square(): Vector2 {
        return new Vector2(this.x * this.x, this.y * this.y);
    }

    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    magnitude(): number {
        return Math.sqrt(this.magnitudeSquared());
    }

    distance(other: Vector2): number {
        return this.sub(other).magnitude();
    }
}

// Immutable
export class BoundingBox {
    readonly topLeft: Vector2;
    readonly bottomRight: Vector2;

    constructor(corner1: Vector2, corner2: Vector2) {
        const minX = Math.min(corner1.x, corner2.x);
        const maxX = Math.max(corner1.x, corner2.x);
        const minY = Math.min(corner1.y, corner2.y);
        const maxY = Math.max(corner1.y, corner2.y);

        this.topLeft = new Vector2(minX, minY);
        this.bottomRight = new Vector2(maxX, maxY);
    }

    get width(): number {
        return this.bottomRight.x - this.topLeft.x;
    }

    get height(): number {
        return this.bottomRight.y - this.topLeft.y;
    }

    intersects(other: BoundingBox): boolean {
        return !(
            this.topLeft.x > other.bottomRight.x ||
            this.bottomRight.x < other.topLeft.x ||
            this.topLeft.y > other.bottomRight.y ||
            this.bottomRight.y < other.topLeft.y
        );
    }

    // Returns a new bounding box that contains the point
    expandToContain(point: Vector2): BoundingBox {
        const minX = Math.min(this.topLeft.x, point.x);
        const maxX = Math.max(this.bottomRight.x, point.x);
        const minY = Math.min(this.topLeft.y, point.y);
        const maxY = Math.max(this.bottomRight.y, point.y);

        return new BoundingBox(new Vector2(minX, minY), new Vector2(maxX, maxY));
    }
}




// https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p: Vector2, q: Vector2, r: Vector2)
{
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
    return true;
    
    return false;
}
  
// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p: Vector2, q: Vector2, r: Vector2)
{
  
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);
    
    if (val == 0) return 0; // collinear
    
    return (val > 0)? 1: 2; // clock or counterclock wise
}
  
// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
export function lineSegmentIntersects(p1: Vector2, q1: Vector2, p2: Vector2, q2: Vector2)
{
  
    // Find the four orientations needed for general and
    // special cases
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);
    
    // General case
    if (o1 != o2 && o3 != o4)
        return true;
    
    // Special Cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;
    
    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;
    
    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;
    
    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;
    
    return false; // Doesn't fall in any of the above cases
}