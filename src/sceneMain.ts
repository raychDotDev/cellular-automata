import * as raylib from "raylib";
import Scene from "./scene";
import Game from "./game";
import World from "./world";

export default class SceneMain implements Scene
{
    private world: World;
    constructor(gridWidth: number, gridHeight: number){
        World.GridWidth = gridWidth;
        World.GridHeight = gridHeight;
        this.world = new World()
    }
    public init(): void {

    }

    public update(frameTime: number): void {
        this.world.update(frameTime);
    }

    public stop(): void {

    }
    public draw(): void {
        this.world.draw();

    }
    
    public cameraDraw(camera: raylib.Camera2D): void {

        this.world.cameraDraw(camera);
    }
    
}

