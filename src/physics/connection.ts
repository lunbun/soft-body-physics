import { MTP } from './math';
import { Point } from './point';

export abstract class Connection {
    readonly length: number;

    constructor(readonly a: Point, readonly b: Point) {
        this.length = this.a.position.distance(this.b.position);
    }

    abstract update(delta: number): void;

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.a.position.x * MTP, this.a.position.y * MTP);
        ctx.lineTo(this.b.position.x * MTP, this.b.position.y * MTP);
        ctx.stroke();
    }
}

export class SpringConnection extends Connection {
    constructor(a: Point, b: Point, readonly stiffness: number) {
        super(a,  b);
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
}

export class FixedConnection extends Connection {
    update(delta: number): void {
        // TODO: implement
    }
}