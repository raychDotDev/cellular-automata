import * as raylib from "raylib";

export default abstract class Scene {
    public abstract init(): void;
    public abstract update(frameTime: number): void;
    public stop(): void {}
    public draw(): void {}
    public cameraDraw(camera: raylib.Camera2D): void {}
}