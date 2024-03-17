import * as raylib from "raylib";
import Scene from "./scene";
import Game from "./game";
import World from "./world";

export default class SceneMain implements Scene
{
    private world: World = new World();
    public init(): void {

    }

    public update(frameTime: number): void {
        this.world.update(frameTime);
    }

    public stop(): void {

    }

    public draw(): void {
        raylib.DrawText(`PAUSED: ${this.world.pause}`, 10, 10, 20, raylib.RED);
    }
    
    public cameraDraw(camera: raylib.Camera2D): void {

        this.world.draw(camera);
    }
    
}

