import { MTP } from './main';

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

export class Point {
    position: Vector2;
    velocity: Vector2;
    mass: number;

    constructor(position: Vector2, mass: number) {
        this.position = position;
        this.velocity = Vector2.ZERO;
        this.mass = mass;
    }

    applyForce(force: Vector2, delta: number) {
        this.velocity = this.velocity.add(force.div(this.mass).mul(delta));
    }

    update(delta: number) {
        // Apply gravity
        this.applyForce(new Vector2(0, 9.81).mul(this.mass), delta);

        // Hackish solution for energy loss
        this.velocity = this.velocity.mul(0.99);

        this.position = this.position.add(this.velocity.mul(delta));
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x * MTP, this.position.y * MTP, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export class StaticPoint extends Point {
    constructor(position: Vector2) {
        super(position, 0);
    }

    applyForce(force: Vector2, delta: number) {
        // Do nothing
    }

    update(delta: number) {
        // Do nothing
    }
}

export class Connection {
    readonly length: number;

    constructor(readonly a: Point, readonly b: Point, readonly stiffness: number) {
        this.length = this.a.position.distance(this.b.position);
    }

    update(delta: number) {
        // Connection acts as a spring, use Hooke's law
        const difference = this.a.position.sub(this.b.position);
        const distance = difference.magnitude();
        const displacement = distance - this.length;
        const force = difference.mul(-displacement * this.stiffness);

        // Apply force to both points
        this.a.applyForce(force, delta);
        this.b.applyForce(force.mul(-1), delta);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.a.position.x * MTP, this.a.position.y * MTP);
        ctx.lineTo(this.b.position.x * MTP, this.b.position.y * MTP);
        ctx.stroke();
    }
}

export class Body {
    constructor(private readonly points: Point[], private readonly connections: Connection[]) {
    }

    update(delta: number) {
        this.connections.forEach(connection => connection.update(delta));
        this.points.forEach(point => point.update(delta));
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.connections.forEach(connection => connection.draw(ctx));
        this.points.forEach(point => point.draw(ctx));
    }
}
