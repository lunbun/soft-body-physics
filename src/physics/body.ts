import { Connection, SpringConnection } from './connection';
import { BoundingBox, MTP, Vector2 } from './math';
import { DynamicPoint, Point } from './point';

export class Body {
    stroke: string = 'black';
    strokeWidth: number = 1;
    pointRadius: number = 2.5;
    fill: string = 'transparent';
    showPoints: boolean = false;
    showInternalConnections: boolean = false;

    readonly connections: Connection[];

    private _boundingBox: BoundingBox;

    constructor(readonly points: Point[], readonly edges: Connection[], readonly internal: Connection[]) {
        this.connections = [...this.edges, ...this.internal];
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



    solveCollision(other: Body) {
        // Check if the bounding boxes of the two bodies intersect
        if (!this.boundingBox.intersects(other.boundingBox)) {
            return;
        }

        this.points.forEach(point => point.solveCollision(other));
    }

    updateConnections() {
        this.connections.forEach(connection => connection.update());
    }

    update(delta: number) {
        this.points.forEach(point => point.update(delta));
    }



    draw(ctx: CanvasRenderingContext2D) {
        if (this.showInternalConnections) {
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;

            // Draw internal connections
            for (const connection of this.internal) {
                ctx.beginPath();
                ctx.moveTo(connection.a.position.x * MTP, connection.a.position.y * MTP);
                ctx.lineTo(connection.b.position.x * MTP, connection.b.position.y * MTP);
                ctx.closePath();
                ctx.stroke();
            }
        }

        // Draw edges separately from internal connections so that we can fill within the edges
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.fillStyle = this.fill;

        ctx.beginPath();
        ctx.moveTo(this.points[0].position.x * MTP, this.points[0].position.y * MTP);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].position.x * MTP, this.points[i].position.y * MTP);
        }
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        if (this.showPoints) {
            // Draw points
            for (const point of this.points) {
                ctx.fillStyle = point.color;
                ctx.beginPath();
                ctx.arc(point.position.x * MTP, point.position.y * MTP, this.pointRadius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}

export class SquareBody extends Body {
    constructor(x: number, y: number, width: number, height: number, mass: number, stiffness: number) {
        const points = [
            new DynamicPoint(new Vector2(x - width / 2, y - height / 2), mass / 4),
            new DynamicPoint(new Vector2(x + width / 2, y - height / 2), mass / 4),
            new DynamicPoint(new Vector2(x + width / 2, y + height / 2), mass / 4),
            new DynamicPoint(new Vector2(x - width / 2, y + height / 2), mass / 4)
        ];

        const edges = [
            new SpringConnection(points[0], points[1], stiffness),
            new SpringConnection(points[1], points[2], stiffness),
            new SpringConnection(points[2], points[3], stiffness),
            new SpringConnection(points[3], points[0], stiffness)
        ];

        const internal = [
            new SpringConnection(points[0], points[2], stiffness),
            new SpringConnection(points[1], points[3], stiffness)
        ];

        super(points, edges, internal);
    }
}