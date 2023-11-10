import {GridNode} from "./GridNode";
import {BinaryHeap} from "./BinaryHeap";
import {Graph} from "./Graph";

export interface ResultFunction {
    (steps:number,result:GridNode[]): void;
}

export interface Heuristic {
    (pos0: GridNode, pos1: GridNode): number;
}

// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
export class Heuristics {
    static manhattan(pos0: GridNode, pos1: GridNode): number {
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    }

    static diagonal(pos0: GridNode, pos1: GridNode): number {
        let D = 1;
        let D2 = Math.sqrt(2);
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
}

export class AsyncAStar {
    public graph: Graph;
    private openHeap: BinaryHeap<GridNode>;
    private readonly heuristic: Heuristic;
    private readonly closest: boolean;
    private readonly maxStepTimes:number;

    private closestNode:GridNode;

    private isSearching:boolean;
    private searchFrames:number;
    private start: GridNode;
    private end: GridNode;
    private readonly callback:ResultFunction;


    /**
     * Perform an A* Search on a graph
     * @param {Graph} graph
     * @param callback
     * @param {Object} [options]
     * @param {boolean} [options.closest] Specifies whether to return the closest
     * path to the closest node if the target is unreachable.
     * @param {Function} [options.heuristic] Heuristic function (see
     *          Heuristics).
     *@param {Function} [options.maxStepTimes] maxStepTimes in one step).
     */
    constructor(graph: Graph,callback:ResultFunction, options:any={}) {
        options = options || {};
        this.graph = graph;
        this.callback=callback;
        this.heuristic = options.heuristic??Heuristics.manhattan;
        this.closest = options.closest??false;
        this.maxStepTimes = options.maxStepTimes??30;
        this.openHeap = new BinaryHeap<GridNode>(function (node: GridNode) {
            return node.f;
        });
        let emptyNode=new GridNode(0,0,0);
        this.closestNode=emptyNode;
        this.start=emptyNode;
        this.end=emptyNode;
        this.isSearching=false;
        this.searchFrames=0;
    }

    /**
     * Perform an A* Search on a graph given a start and end node.
     * @param {GridNode} start
     * @param {GridNode} end
     * @param callback
     */
    public search(start: GridNode, end: GridNode) {
        this.graph.cleanDirty();
        this.openHeap.clean();
        this.start=start;
        this.end=end;
        this.closestNode = start; // set the start node to be the closest if required

        start.h = this.heuristic(start, end);
        this.graph.markDirty(start);
        this.openHeap.push(start);
        this.isSearching=true;
        this.searchFrames=0;
    }

    private finishSearch(node: GridNode|null){
        this.isSearching=false;
        let path:GridNode[] = [];
        if(node!=null){
            let curr = node;
            while (curr.parent) {
                path.unshift(curr);
                curr = curr.parent;
            }
        }
        if(this.callback!=null){
            this.callback(this.searchFrames,path);
        }
    }

    public step(){
        if(this.isSearching){
            this.searchFrames++;
            let stepLeft=this.maxStepTimes;
            while (this.openHeap.size() > 0 && stepLeft>0) {
                stepLeft--;
                // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
                let currentNode = this.openHeap.pop();

                // End case -- result has been found, return the traced path.
                if (currentNode === this.end) {
                    this.finishSearch(currentNode);
                    return false;
                }

                // Normal case -- move currentNode from open to closed, process each of its neighbors.
                currentNode.closed = true;

                // Find all neighbors for the current node.
                let neighbors = this.graph.neighbors(currentNode);

                for (let i = 0, il = neighbors.length; i < il; ++i) {
                    let neighbor = neighbors[i];

                    if (neighbor.closed || neighbor.isWall()) {
                        // Not a valid node to process, skip to next neighbor.
                        continue;
                    }

                    // The g score is the shortest distance from start to current node.
                    // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                    let gScore = currentNode.g + neighbor.getCost(currentNode);
                    let beenVisited = neighbor.visited;

                    if (!beenVisited || gScore < neighbor.g) {

                        // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                        neighbor.visited = true;
                        neighbor.parent = currentNode;
                        neighbor.h = neighbor.h || this.heuristic(neighbor, this.end);
                        neighbor.g = gScore;
                        neighbor.f = neighbor.g + neighbor.h;
                        this.graph.markDirty(neighbor);
                        if (this.closest) {
                            // If the neighbour is closer than the current closestNode or if it's equally close but has
                            // a cheaper path than the current closest node then it becomes the closest node
                            if (neighbor.h < this.closestNode.h || (neighbor.h === this.closestNode.h && neighbor.g < this.closestNode.g)) {
                                this.closestNode = neighbor;
                            }
                        }

                        if (!beenVisited) {
                            // Pushing to heap will put it in proper place based on the 'f' value.
                            this.openHeap.push(neighbor);
                        } else {
                            // Already seen the node, but since it has been rescored we need to reorder it in the heap
                            this.openHeap.rescoreElement(neighbor);
                        }
                    }
                }
            }

            if (this.openHeap.size()==0) {
                if(this.closest){
                    this.finishSearch(this.closestNode);
                    return false;
                }
                // No result was found - empty array signifies failure to find path.
                this.finishSearch(null);
                return false;
            }
            return true;
        }
        return false;
    }


}
