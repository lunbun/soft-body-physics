import { clamp, Vector2 } from './math';
import { Body } from './body';
import { testHorizontalSegmentOnLineSegmentIntersection } from './line_segment_intersection';
import { Connection } from './connection';

export abstract class Point {
    color: string = 'black';
    position: Vector2;
    velocity: Vector2;
    readonly mass: number;

    protected constructor(position: Vector2, mass: number) {
        this.position = position;
        this.velocity = Vector2.ZERO;
        this.mass = mass;
    }

    abstract applyForce(force: Vector2): void;

    abstract update(delta: number): void;

    private isInside(body: Body): boolean {
        // Check first if the point is inside the body's bounding box
        if (!body.boundingBox.contains(this.position)) {
            return false;
        }

        // https://youtu.be/3OmkehAJoyo?t=210
        
        // Find a point horizontal to this point that is outside the body
        const outsideX = body.boundingBox.bottomRight.x + 1;
        const outsidePoint = new Vector2(outsideX, this.position.y);

        // Count the number of intersections between the line from this point to the outside point and the body's edges
        let intersections = 0;
        for (const edge of body.edges) {
            const a = edge.a.position;
            const b = edge.b.position;

            // Check if the line from this point to the outside point intersects with the line from a to b
            if (testHorizontalSegmentOnLineSegmentIntersection(this.position, outsidePoint, a, b)) {
                intersections++;
            }
        }

        // If the number of intersections is odd, the point is inside the body
        return (intersections % 2 === 1);
    }

    private findClosestPointOnLineSegment(a: Vector2, b: Vector2): Vector2 {
        // https://math.stackexchange.com/a/2193733
        const v = b.sub(a);
        const u = a.sub(this.position);

        const t = clamp(-v.dot(u) / v.dot(v), 0, 1);

        return a.add(v.mul(t));
    }

    private findClosestPointOnBody(body: Body): { point: Vector2, edge: Connection } {
        let closestPoint: Vector2 = null;
        let closestEdge: Connection = null;
        let closestDistance = Infinity;

        for (const edge of body.edges) {
            const a = edge.a.position;
            const b = edge.b.position;

            const point = this.findClosestPointOnLineSegment(a, b);
            const distance = this.position.distanceSquared(point);

            if (distance < closestDistance) {
                closestPoint = point;
                closestEdge = edge;
                closestDistance = distance;
            }
        }

        return { point: closestPoint, edge: closestEdge };
    }

    solveCollision(body: Body) {
        // Check if this point is inside the body
        if (!this.isInside(body)) {
            return;
        }

        // https://youtu.be/3OmkehAJoyo?t=270
        const { point, edge } = this.findClosestPointOnBody(body);
        const a = edge.a;
        const b = edge.b;

        const normal = new Vector2(b.position.y - a.position.y, a.position.x - b.position.x);

        // Move the point out of the body
        this.position = point;

        // Solve velocity
        // https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
        const v1 = this.velocity;
        // TODO: Use weighted average based on which point is closer to our point
        const v2 = a.velocity.add(b.velocity).div(2);

        const m1 = this.mass;
        const m2 = (a.mass + b.mass) / 2;

        const newV1 = v1.mul((m1 - m2) / (m1 + m2)).add(v2.mul(2 * m2 / (m1 + m2)));
        const newV2 = v1.mul(2 * m1 / (m1 + m2)).sub(v2.mul((m1 - m2) / (m1 + m2)));

        this.velocity = newV1;
        a.velocity = newV2;
        b.velocity = newV2;
    }
}

export class DynamicPoint extends Point {
    // Resets at the start of the tick, and accumulates force throughout the tick
    private force: Vector2;

    constructor(position: Vector2, mass: number) {
        super(position, mass);

        this.force = Vector2.ZERO;
    }

    applyForce(force: Vector2): void {
        this.force = this.force.add(force);
    }

    private rk4integrate(value: Vector2, derivative: Vector2, delta: number): Vector2 {
        // TODO: figure out how tf rk4 works
        return value.add(derivative.mul(delta));
    }

    update(delta: number): void {
        // Apply gravity
        this.applyForce(new Vector2(0, 9.81).mul(this.mass));

        // Hackish solution for energy loss
        const factor = Math.pow(0.5, delta);
        this.velocity = this.velocity.mul(factor);

        const acceleration = this.force.div(this.mass)
        this.velocity = this.rk4integrate(this.velocity, acceleration, delta);
        this.position = this.rk4integrate(this.position, this.velocity, delta);

        // Reset force for next tick
        this.force = Vector2.ZERO;
    }
}

export class StaticPoint extends Point {
    constructor(position: Vector2) {
        super(position, 10);
    }

    applyForce(force: Vector2) {
        // Do nothing
    }

    update(delta: number) {
        // Do nothing
    }
}