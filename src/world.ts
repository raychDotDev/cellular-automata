import * as raylib from "raylib"; 
import Game from "./game";

export default class World {
    public static GridWidth: number = 0;

    private prev_tick: number = 0;
    private cells: number[][] = World.makeClearGrid();
    private cells_next: number[][] = World.makeClearGrid();
    public pause: boolean = true;

    private static makeClearGrid(): number[][] {
        return new Array(World.GridWidth).fill(0).map(() => new Array(World.GridWidth).fill(0));
    }
    public update(frameTime: number): void {
        

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
            if(performance.now() - this.prev_tick > 50) {
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
            }
        } else {
            if(raylib.IsMouseButtonPressed(raylib.MOUSE_BUTTON_LEFT))
            {   
                let mousePos = raylib.Vector2Subtract(raylib.GetMousePosition(), Game.Camera.offset);
                //mousePos = raylib.GetScreenToWorld2D(mousePos, Game.Camera);
                let x = Math.floor((mousePos.x / Game.Camera.zoom)/16);
                let y = Math.floor((mousePos.y / Game.Camera.zoom)/16);
                if(x > World.GridWidth || y > World.GridWidth || x < 0 || y < 0) return;

                this.cells[y][x] = (this.cells[y][x] > 0) ? 0 : 1;
            }
        }
    }

    private cellUpdate(x: number, y: number): number {
        let nearCells = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + this.cells.length) % this.cells.length;
                let row = (y + j + this.cells.length) % this.cells.length;
                nearCells += this.cells[row][col];
            }
        }
        nearCells -= this.cells[y][x];
        return nearCells;
    }

    public draw(camera: raylib.Camera2D): void {
        raylib.DrawRectangle(0,0, World.GridWidth * 16, World.GridWidth * 16, raylib.WHITE);
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if(this.cells[y][x] > 0) raylib.DrawRectangle(x * 16 , y * 16, 16, 16, raylib.BLACK); 
                //if(this.pause) raylib.DrawRectangleLines(x*16, y*16, 16, 16, raylib.GRAY);
            }
        )})
    }
}