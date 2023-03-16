import { Connection } from './connection';
import { BoundingBox } from './math';
import { Point } from './point';

export class Body {
    private _boundingBox: BoundingBox;

    constructor(readonly points: Point[], readonly connections: Connection[]) {
    }

    updateBoundingBox() {
        let box: BoundingBox = null;
        for (const point of this.points) {
            if (box === null) {
                box = new BoundingBox(point.position, point.position);
            } else {
                box = box.expandToContain(point.position);
            }
        }

        this._boundingBox = box;
    }

    get boundingBox() {
        return this._boundingBox;
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