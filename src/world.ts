import * as raylib from "raylib"; 
import Game from "./game";
import SceneSetup from "./sceneSetup";
import List from "./list";

export default class World {
    public static GridWidth: number = 0;
    public static GridHeight: number = 0;
    public static CellSize: number = 0;
    private currentGeneration: number = 0;
    private prev_tick: number = 0;
    private cells: number[][] = World.makeClearGrid();
    private cells_next: number[][] = World.makeClearGrid();
    public pause: boolean = true;
    private generations: List<number[][]> = new List();
    private simulationStep = 50;
    private static makeClearGrid(): number[][] {
        return new Array(World.GridHeight).fill(0).map(() => new Array(World.GridWidth).fill(0));
    }
    public update(frameTime: number): void {
        if(raylib.IsKeyPressed(raylib.KEY_ESCAPE))
        {
            Game.setScene(new SceneSetup());
        }

        if(raylib.IsKeyPressed(raylib.KEY_SPACE))
        {
            this.pause = !this.pause;
        }
        if(raylib.IsKeyPressed(raylib.KEY_C))
        {
            this.cells = World.makeClearGrid();
        }
        if(!this.pause)
        {
            if(performance.now() - this.prev_tick > this.simulationStep) {
                for (let y = 0; y < this.cells.length; y++) {
                    for (let x = 0; x < this.cells[y].length; x++) {
                        let cell = this.cells[y][x];
                        let nc = this.cellUpdate(x, y);
                        if (cell == 0 && nc == 3) {
                            this.cells_next[y][x] = 1;
                        }
                        else if (cell == 1 && (nc < 2 || nc > 3)) {
                            this.cells_next[y][x] = 0;
                        }
                        else {this.cells_next[y][x] = this.cells[y][x];}
                    }
                }
                this.cells = this.cells_next;
                this.cells_next = World.makeClearGrid();
                this.prev_tick = performance.now();
                this.generations.add(this.cells);
                this.currentGeneration++;
            }
        } else {
            if(raylib.IsKeyPressed(raylib.KEY_R))
            {
                for(let i = 0; i < 40; i++)
                {
                    let x = Math.floor(Math.random() * World.GridWidth);
                    let y = Math.floor(Math.random() * World.GridHeight);
                    this.setCell(x,y);
                }
            }
            if(raylib.IsMouseButtonPressed(raylib.MOUSE_BUTTON_LEFT))
            {   
                let mousePos = raylib.Vector2Subtract(raylib.GetMousePosition(), Game.Camera.offset);
                if(mousePos.x < 200 && mousePos.y < 150) return;
                let x = Math.floor((mousePos.x / Game.Camera.zoom)/16);
                let y = Math.floor((mousePos.y / Game.Camera.zoom)/16);
                this.setCell(x, y);
            }
        }
    }

    private setCell(x: number, y: number) {
        if(x > World.GridWidth || y > World.GridHeight || x < 0 || y < 0) return;

        this.cells[y][x] = (this.cells[y][x] > 0) ? 0 : 1;
    }
    private cellUpdate(x: number, y: number): number {
        let nearCells = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + this.cells[0].length) % this.cells[0].length;
                let row = (y + j + this.cells.length) % this.cells.length;
                nearCells += this.cells[row][col];
            }
        }
        nearCells -= this.cells[y][x];
        return nearCells;
    }


    public draw()
    {
        raylib.DrawText(`PAUSED: ${this.pause}`, 10, 10, 20, raylib.BLUE);
        raylib.DrawText(`Generation: ${this.currentGeneration}`, 200, 10, 20, raylib.BLUE);
        raylib.DrawText("SimulationStep: " + this.simulationStep + "ms", 10, 40, 20, raylib.BLUE);
        if(this.pause)
        {
            if(raylib.GuiButton({x: 10, y: 40 + 20, width: 20, height: 20}, "+10")){
                this.simulationStep = Math.min(this.simulationStep + 10, 2000);
            }
            if(raylib.GuiButton({x: 10 + 20, y: 40 + 20, width: 20, height: 20}, "-10")){
                this.simulationStep = Math.max(this.simulationStep - 10, 10);
            }
            if(raylib.GuiButton({x: 10, y: 40 + 40, width: 40, height: 20},"UNDO"))
            {
                this.undo();
            }
        }

    }

    public cameraDraw(camera: raylib.Camera2D): void {
        raylib.DrawRectangle(0,0, World.GridWidth * 16, World.GridHeight * 16, raylib.WHITE);
        let gridColor = this.pause ? raylib.GRAY : {r: raylib.LIGHTGRAY.r, g: raylib.LIGHTGRAY.g, b: raylib.LIGHTGRAY.b, a: 120};
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if(this.cells[y][x] > 0) raylib.DrawRectangle(x * 16 , y * 16, 16, 16, raylib.BLACK); 
                raylib.DrawLine(x * 16, 0, x * 16, 16 * World.GridHeight, gridColor);
            })
            raylib.DrawLine(0, y * 16, 16 * World.GridWidth, y * 16, gridColor);
        })
    }
    public undo(): void {
        if (this.generations.size() > 0) {
            let previousGeneration = this.generations.getLast();
            if (previousGeneration) {
                if(previousGeneration == this.cells){
                    this.generations.removeLast();
                    previousGeneration = this.generations.getLast();
                }
                if(!previousGeneration) return;
                this.cells = previousGeneration;
                this.currentGeneration--;
            }
        }
    }
}