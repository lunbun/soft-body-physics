import { Point } from './point';

export abstract class Connection {
    readonly length: number;

    protected constructor(readonly a: Point, readonly b: Point) {
        this.length = this.a.position.distance(this.b.position);
    }

    abstract update(): void;
}

export class SpringConnection extends Connection {
    constructor(a: Point, b: Point, readonly stiffness: number) {
        super(a,  b);
    }

    update() {
        // Connection acts as a spring, use Hooke's law
        const difference = this.a.position.sub(this.b.position);
        const distance = difference.magnitude();
        const displacement = distance - this.length;
        const force = difference.mul(-displacement * this.stiffness);

        // Apply force to both points
        this.a.applyForce(force);
        this.b.applyForce(force.mul(-1));
    }
}

export class FixedConnection extends Connection {
    constructor(a: Point, b: Point) {
        super(a, b);
    }

    update(): void {
        // TODO: implement
    }
}