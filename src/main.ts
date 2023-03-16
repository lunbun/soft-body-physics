import { Body } from './physics/body';
import { FixedConnection, SpringConnection } from './physics/connection';
import { Vector2 } from './physics/math';
import { DynamicPoint, StaticPoint } from './physics/point';
import { World } from './physics/world';

export const TPS = 60; // Ticks per second
export const SPT = 1 / TPS; // Seconds per tick

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let lastFrameTime = 0;
let timeSinceLastTick = 0;

const world = new World();

const pointA = new StaticPoint(new Vector2(3, 3));
const pointB = new DynamicPoint(new Vector2(4, 4), 1);
const pointC = new DynamicPoint(new Vector2(2, 4), 1);

const connectionAB = new SpringConnection(pointA, pointB, 30);
const connectionBC = new SpringConnection(pointB, pointC, 30);
const connectionCA = new SpringConnection(pointC, pointA, 30);

const groundA = new StaticPoint(new Vector2(0, 6));
const groundB = new StaticPoint(new Vector2(6, 6));
const groundC = new StaticPoint(new Vector2(6, 8));
const groundD = new StaticPoint(new Vector2(0, 8));
const groundAB = new FixedConnection(groundA, groundB);
const groundBC = new FixedConnection(groundB, groundC);
const groundCD = new FixedConnection(groundC, groundD);
const groundDA = new FixedConnection(groundD, groundA);

world.addBody(new Body([pointA, pointB, pointC], [connectionAB, connectionBC, connectionCA]));
world.addBody(new Body([groundA, groundB, groundC, groundD], [groundAB, groundBC, groundCD, groundDA]));

function update(delta: number) {
    timeSinceLastTick += delta;

    while (timeSinceLastTick >= SPT) {
        timeSinceLastTick -= SPT;

        world.update(SPT);
    }
}

function frame() {
    const delta = (performance.now() - lastFrameTime) / 1000;
    lastFrameTime = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update(delta);
    world.draw(ctx);

    window.requestAnimationFrame(frame);
}

function main() {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d');

    window.requestAnimationFrame(frame);
}

window.addEventListener('load', main);
