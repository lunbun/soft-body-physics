import { Body, Connection, Point, StaticPoint, Vector2 } from './body';

export const MTP = 60; // Meters to pixels
export const PTM = 1 / MTP; // Pixels to meters

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let lastFrameTime = 0;

const pointA = new StaticPoint(new Vector2(3, 3));
const pointB = new Point(new Vector2(4, 4), 10);
const pointC = new Point(new Vector2(2, 4), 1);

const connectionAB = new Connection(pointA, pointB, 30);
const connectionBC = new Connection(pointB, pointC, 30);
const connectionCA = new Connection(pointC, pointA, 30);

const body = new Body([pointA, pointB, pointC], [connectionAB, connectionBC, connectionCA]);

function frame() {
    const delta = performance.now() - lastFrameTime;
    lastFrameTime = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    body.update(delta / 1000);
    body.draw(ctx);

    window.requestAnimationFrame(frame);
}

function main() {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d');

    window.requestAnimationFrame(frame);
}

window.addEventListener('load', main);
