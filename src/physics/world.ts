import { Body } from './body';

export class World {
    private readonly bodies: Body[] = [];

    addBody(body: Body) {
        this.bodies.push(body);
    }

    update(delta: number) {
        this.bodies.forEach(body => body.updateBoundingBox());

        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.bodies[i].solveCollision(this.bodies[j]);
            }
        }

        this.bodies.forEach(body => body.updateConnections());

        this.bodies.forEach(body => body.update(delta));
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.bodies.forEach(body => body.draw(ctx));
    }
}