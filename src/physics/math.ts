export const MTP = 60; // Meters to pixels
export const PTM = 1 / MTP; // Pixels to meters

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

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

    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    magnitude(): number {
        return Math.sqrt(this.magnitudeSquared());
    }

    distanceSquared(other: Vector2): number {
        return this.sub(other).magnitudeSquared();
    }

    distance(other: Vector2): number {
        return this.sub(other).magnitude();
    }

    normalize(): Vector2 {
        return this.div(this.magnitude());
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

    contains(point: Vector2): boolean {
        return (
            this.topLeft.x <= point.x &&
            this.bottomRight.x >= point.x &&
            this.topLeft.y <= point.y &&
            this.bottomRight.y >= point.y
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