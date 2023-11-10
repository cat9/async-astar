
export class GridNode{
    public x:number;
    public y:number;
    public weight:number;

    public f:number=0;
    public g:number=0;
    public h:number=0;
    public visited :boolean=false;
    public closed :boolean=false;
    public parent :GridNode|null=null;

    constructor(x:number, y:number, weight:number) {
        this.x = x;
        this.y = y;
        this.weight = weight;
    }

    toString():string {
        return "[" + this.x + " " + this.y + "]";
    }

    getCost(fromNeighbor:GridNode):number {
        // Take diagonal weight into consideration.
        if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * 1.41421;
        }
        return this.weight;
    }

    isWall():boolean {
        return this.weight === 0;
    }

    clean():void {
        this.f=0;
        this.g=0;
        this.h=0;
        this.visited=false;
        this.closed=false;
        this.parent=null;
    }
}
