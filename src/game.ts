import * as raylib from "raylib";
import Scene from "./scene";
import * as dotenv from "dotenv";
import World from "./world";

export default class Game {
    public static readonly Camera: raylib.Camera2D = {
        offset: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
        rotation: 0,
        zoom: 1
    };

    private windowSize: raylib.Vector2 ;
    private title: string;

    private static debug: boolean = false;

    private scene?: Scene;

    constructor()
    {
        dotenv.config();
        World.GridWidth = Number(process.env.GRID_WIDTH);
        this.windowSize = { x: Number(process.env.WINDOW_SIZE_X), y: Number(process.env.WINDOW_SIZE_Y) };
        this.title = process.env.TITLE || "CELLULAR_AUTOMATA";
        raylib.InitWindow(this.windowSize.x, this.windowSize.y, this.title);
        raylib.SetTargetFPS(60);
    }

    public run() {
        while (!raylib.WindowShouldClose()) {
            let frametime = raylib.GetFrameTime();
            this.input();
            this.scene?.update(frametime);

            raylib.BeginDrawing();
            raylib.BeginMode2D(Game.Camera);
            raylib.ClearBackground(raylib.BLACK);
            this.scene?.cameraDraw(Game.Camera);

            if(Game.debug) {
                raylib.DrawFPS(10, 10);
            }

            raylib.EndMode2D();
            
            this.scene?.draw();

            if(Game.debug) {
                raylib.DrawFPS(60, 10);
            }
            raylib.EndDrawing();
        }
    }

    public stop() {
        raylib.CloseWindow();
    }

    private input(): void {
        if(raylib.IsKeyPressed(raylib.KEY_F1)) {
            Game.debug = !Game.debug;
        }
        let camSpeed = 200;
        let zoomSpeed = 0.5;
        if(raylib.IsKeyDown(raylib.KEY_LEFT))
        {
            Game.Camera.offset.x += camSpeed * raylib.GetFrameTime();
        }
        if(raylib.IsKeyDown(raylib.KEY_RIGHT))
        {
            Game.Camera.offset.x -= camSpeed * raylib.GetFrameTime();
        }
        if(raylib.IsKeyDown(raylib.KEY_UP))
        {
            Game.Camera.offset.y += camSpeed * raylib.GetFrameTime();
        }
        if(raylib.IsKeyDown(raylib.KEY_DOWN))
        {
            Game.Camera.offset.y -= camSpeed * raylib.GetFrameTime();
        }
        if(raylib.IsKeyDown(raylib.KEY_EQUAL))
        {
            Game.Camera.zoom += zoomSpeed * raylib.GetFrameTime();
        }
        if(raylib.IsKeyDown(raylib.KEY_MINUS))
        {
            Game.Camera.zoom -= zoomSpeed * raylib.GetFrameTime();
        }
    }
    public setScene(scene: Scene) {
        this.scene?.stop();

        this.scene = scene;

        this.scene.init();
    }
} 