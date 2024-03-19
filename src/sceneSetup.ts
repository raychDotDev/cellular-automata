import * as raylib from "raylib";
import Scene from "./scene";
import Game
 from "./game";
import SceneMain from "./sceneMain";
export default class SceneSetup extends Scene
{
    private width = 64;

    private height = 64;

    public init(): void {
    }
    public update(frameTime: number): void {
        
    }
    public draw() {
        if (raylib.GuiButton({x: Game.windowSize.x/2 - 100, y: Game.windowSize.y/2 - 25, width: 200, height: 50}, "START" ))
        {
            Game.setScene(new SceneMain(this.width, this.height));
        }

        raylib.DrawText("Width: " + this.width,Game.windowSize.x/2 - 50 , Game.windowSize.y/2 - 25 + 50, 20, raylib.WHITE);
        if(raylib.GuiButton({x: Game.windowSize.x/2 - 50, y: Game.windowSize.y/2 - 25 + 70, width: 50, height: 50}, "+4"))
        {
            this.width = Math.min(this.width + 4, 512);
        }
        if(raylib.GuiButton({x: Game.windowSize.x/2 - 50, y: Game.windowSize.y/2 - 25 + 70 + 50, width: 50, height: 50}, "-4"))
        {
            this.width = Math.max(this.width - 4, 16);
        }
        raylib.DrawText("Height: " + this.height,Game.windowSize.x/2 - 25 + 100, Game.windowSize.y/2 - 25 + 50, 20, raylib.WHITE);
        if(raylib.GuiButton({x: Game.windowSize.x/2 - 25 + 100, y: Game.windowSize.y/2 - 25 + 70, width: 50, height: 50}, "+4"))
        {
            this.height = Math.min(this.height + 4, 256);
        }
        if(raylib.GuiButton({x: Game.windowSize.x/2 - 25 + 100, y: Game.windowSize.y/2 - 25 + 70 + 50, width: 50, height: 50}, "-4"))
        {
            this.height = Math.max(this.height - 4, 16);
        }
    }
    
}