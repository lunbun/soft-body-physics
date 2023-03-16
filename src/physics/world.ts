import { Body } from './body';

export class World {
    private readonly bodies: Body[] = [];

    addBody(body: Body) {
        this.bodies.push(body);
    }

    update(delta: number) {
        this.bodies.forEach(body => body.updateBoundingBox());
        this.bodies.forEach(body => body.update(delta));
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.bodies.forEach(body => body.draw(ctx));
    }
}