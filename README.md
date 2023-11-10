## 简介

[async-astar](https://github.com/cat9/async-astar) 异步（分步）A*寻路算法，基于 [javascript-astar
](https://github.com/bgrins/javascript-astar)、[iam-binaryheap-typescript
](https://github.com/dualface/iam-binaryheap-typescript)，适用于cocos 或 使用ts的游戏

## 用法
复制src里面的四个文件进去自己的工程里面使用即可


### 对角线不可通行（四个方向可通行）
```typescript

var graph = new Graph([
    [1,1,1,1],
    [0,1,1,0],
    [0,0,1,1]
]);
//closest:如果目标点不能是不可通行，是否自动选择目标最近可通行的点
//maxStepTimes:单次step里面最多可迭代次数
const astar = new AsyncAStar(graph,function (steps, result){
    //寻路结果回调
    console.log("steps:"+steps);
    console.log(result);
},{closest:true,maxStepTimes:100});

var start = graph.grid[0][0];
var end = graph.grid[1][2];
astar.search(start, end);


//call on every frame update
//游戏每帧回调函数里面调用这个
astar.step();

```

### 对角线可通行（八个方向可通行）
```typescript
//开启对角线（八个方向）可通行 diagonal: true
var graphDiagonal = new Graph([
    [1,1,1,1],
    [0,1,1,0],
    [0,0,1,1]
], { diagonal: true });
const astar = new AsyncAStar(graph,function (steps, result){
    //寻路结果回调
    console.log("steps:"+steps);
    console.log(result);
},{closest:true,maxStepTimes:100});

var start = graphDiagonal.grid[0][0];
var end = graphDiagonal.grid[1][2];
astar.search(start, end);


//call on every frame update
//游戏每帧回调函数里面调用这个
astar.step();

```
### 包含权重的地图
```typescript
//包含权重的地图
// Weight can easily be added by increasing the values within the graph, and where 0 is infinite (a wall)
var graphWithWeight = new Graph([
    [1,1,2,30],
    [0,4,1.3,0],
    [0,0,5,1]
]);
const astar = new AsyncAStar(graph,function (steps, result){
    //寻路结果回调
    console.log("steps:"+steps);
    console.log(result);
},{closest:true,maxStepTimes:100});

var startWithWeight = graphWithWeight.grid[0][0];
var endWithWeight = graphWithWeight.grid[1][2];
astar.search(startWithWeight, endWithWeight);


//call on every frame update
//游戏每帧回调函数里面调用这个
astar.step();

```

## 测试
```bash
//安装依赖
npm install
//运行测试
npm run dev

```
