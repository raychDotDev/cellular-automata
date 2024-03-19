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

    private static nextCamPos: raylib.Vector2 = Game.Camera.offset; 

    public static windowSize: raylib.Vector2 ;
    public static title: string;

    private static debug: boolean = false;

    private static scene?: Scene;

    constructor()
    {
        dotenv.config();
        World.CellSize = Number(process.env.CELL_SIZE);
        Game.windowSize = { x: Number(process.env.WINDOW_SIZE_X), y: Number(process.env.WINDOW_SIZE_Y) };
        Game.title = process.env.TITLE || "CELLULAR_AUTOMATA";
        raylib.InitWindow(Game.windowSize.x, Game.windowSize.y, Game.title);
        raylib.SetTargetFPS(120);
        raylib.SetExitKey(-1);
        raylib.GuiEnable();
    }

    public run() {
        while (!raylib.WindowShouldClose()) {
            let frametime = raylib.GetFrameTime();
            this.input();
            Game.scene?.update(frametime);
            raylib.BeginDrawing();
            raylib.BeginMode2D(Game.Camera);
            raylib.ClearBackground(raylib.BLACK);
            Game.scene?.cameraDraw(Game.Camera);

            if(Game.debug) {
                raylib.DrawFPS(10, 10);
            }

            raylib.EndMode2D();
            
            Game.scene?.draw();

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
        let zoomSpeed = 0.1;
        if(raylib.IsMouseButtonDown(raylib.MOUSE_BUTTON_RIGHT))
        {
            if(raylib.GetGestureDetected() == raylib.GESTURE_DRAG)
            {
                Game.Camera.offset = raylib.Vector2Add(Game.Camera.offset, raylib.GetMouseDelta());
            }
        }
        let wheel = raylib.GetMouseWheelMove();
        if(wheel != 0)
        {
            Game.Camera.zoom = Math.max(0, Game.Camera.zoom + zoomSpeed * wheel);

        }
    }
    public static setScene(scene: Scene) {
        this.scene?.stop();

        this.scene = scene;

        this.scene.init();
    }
} 