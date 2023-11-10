import {GridNode} from "./GridNode";

export class Graph{

    private nodes:GridNode[];
    private dirtyNodes:GridNode[]=[];
    public grid:GridNode[][];
    private diagonal:boolean;


    /**
     * A graph memory structure
     * @param {Array} gridIn 2D array of input weights
     * @param {Object} [options]
     * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
     */
    constructor(gridIn:number[][], options:any={}) {
        options = options || {};
        this.nodes = [];
        this.diagonal = options.diagonal??false;
        this.grid = [];
        for (let x = 0; x < gridIn.length; x++) {
            this.grid[x] = [];
            for (let y = 0, row = gridIn[x]; y < row.length; y++) {
                let node = new GridNode(x, y, row[y]);
                this.grid[x][y] = node;
                this.nodes.push(node);
            }
        }
        this.init();
    }



    init():void {
        this.dirtyNodes = [];
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clean();
        }
    };

    cleanDirty() {
        for (let i = 0; i < this.dirtyNodes.length; i++) {
            this.dirtyNodes[i].clean();
        }
        this.dirtyNodes = [];
    };

    markDirty(node:GridNode):void {
        this.dirtyNodes.push(node);
    };

    neighbors(node:GridNode):GridNode[] {
        let ret = [];
        let x = node.x;
        let y = node.y;
        let grid = this.grid;

        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
        }

        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
        }

        // South
        if (grid[x] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }

        // North
        if (grid[x] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }

        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                ret.push(grid[x - 1][y - 1]);
            }

            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                ret.push(grid[x + 1][y - 1]);
            }

            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                ret.push(grid[x - 1][y + 1]);
            }

            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                ret.push(grid[x + 1][y + 1]);
            }
        }

        return ret;
    };

    toString():string {
        let graphString = [];
        let nodes = this.grid;
        for (let x = 0; x < nodes.length; x++) {
            let rowDebug = [];
            let row = nodes[x];
            for (let y = 0; y < row.length; y++) {
                rowDebug.push(row[y].weight);
            }
            graphString.push(rowDebug.join(" "));
        }
        return graphString.join("\n");
    };
}



