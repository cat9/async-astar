import {Graph} from "./src/Graph";
import {AsyncAStar} from "./src/AsyncAStar";

const width =100,height=100;
const map:number[][]=generateMap(width,height);

const graph = new Graph(map,{diagonal:true});

const astar = new AsyncAStar(graph,function (steps, result){
    const endTime = new Date().getTime();
    console.log("cost time:"+(endTime-startTime));
    console.log("steps:"+steps);
    console.log(result);
},{closest:true,maxStepTimes:100});

const start = astar.graph.grid[0][0];
const end = astar.graph.grid[width/2][height/2];
const startTime = new Date().getTime();
astar.search(start,end);

while (astar.step()){}



function generateMap(width:number,height:number,wallFrequency=0.1,generateWeights=false,print=false){
    let nodes = []

    let startSet = false;
    const WALL = 0;

    for(let x = 0; x < height; x++) {
        let nodeRow = [];

        for(let y = 0; y < width; y++) {

            let isWall = Math.floor(Math.random()*(1/wallFrequency));
            if(isWall === 0) {
                nodeRow.push(WALL);
            }
            else  {
                let cell_weight = generateWeights ? Math.floor(Math.random() * 3) * 2 + 1 : 1;
                nodeRow.push(cell_weight);
                if (!startSet) {
                    startSet = true;
                }
            }
        }
        nodes.push(nodeRow);
    }

    if(print){
        console.log(nodes)
    }

    return nodes;
}


