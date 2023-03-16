import { MTP, Vector2 } from './math';
import { Body } from './body';

export abstract class Point {
    color: string = 'black';
    position: Vector2;

    constructor(position: Vector2) {
        this.position = position;
    }

    abstract applyForce(force: Vector2, delta: number): void;

    abstract update(delta: number): void;

    // Checks if this point is inside the given body
    isInside(body: Body) {
        // https://youtu.be/3OmkehAJoyo?t=210
        
        // Find a point horizontal to this point that is outside the body
        const outsideX = body.boundingBox.bottomRight.x + 1;
        
        for (const connection of body.connections) {
            
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x * MTP, this.position.y * MTP, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export class DynamicPoint extends Point {
    velocity: Vector2;
    readonly mass: number;

    constructor(position: Vector2, mass: number) {
        super(position);

        this.velocity = Vector2.ZERO;
        this.mass = mass;
    }

    applyForce(force: Vector2, delta: number): void {
        this.velocity = this.velocity.add(force.div(this.mass).mul(delta));
    }

    update(delta: number): void {
        // Apply gravity
        this.applyForce(new Vector2(0, 9.81).mul(this.mass), delta);

        // Hackish solution for energy loss
        const factor = Math.pow(0.5, delta);
        this.velocity = this.velocity.mul(factor);

        this.position = this.position.add(this.velocity.mul(delta));
    }
}

export class StaticPoint extends Point {
    constructor(position: Vector2) {
        super(position);
    }

    applyForce(force: Vector2, delta: number) {
        // Do nothing
    }

    update(delta: number) {
        // Do nothing
    }
}