/**
 * 计分函数
 */
export interface ScoreFunction<T> {
    (element: T): number;
}

/**
 * 二进制堆数据结构
 */
export class BinaryHeap<T> {
    private elements: T[] = [];
    private readonly scoreFunction: ScoreFunction<T>;

    constructor(scoreFunction: ScoreFunction<T>) {
        this.scoreFunction = scoreFunction;
    }

    /**
     * 将元素放入堆
     *
     * @param element
     */
    push(element: T): void {
        // Add the new element to the end of the array.
        this.elements.push(element);
        // Allow it to sink down.
        this.sinkDown(this.elements.length - 1);
    }

    /**
     * 移除并返回第一个元素
     */
    pop(): T {
        // Store the first element so we can return it later.
        const first = this.elements[0];
        // Get the element at the end of the array.
        const end = this.elements.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.elements.length > 0) {
            if (!end) {
                throw new TypeError(
                    "[BinaryHeap]: pop() expected is object, actual is undefined"
                );
            }
            this.elements[0] = end;
            this.bubbleUp(0);
        }
        return first;
    }

    /**
     * 移除指定元素
     *
     * @param element
     */
    remove(element: T): void {
        const i = this.elements.indexOf(element);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        const end = this.elements.pop();

        if (i !== this.elements.length - 1) {
            if (!end) {
                throw new TypeError(
                    "[BinaryHeap]: remove() expected is object, actual is undefined"
                );
            }
            this.elements[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(element)) {
                this.sinkDown(i);
            } else {
                this.bubbleUp(i);
            }
        }
    }

    /**
     * 返回堆大小
     */
    size(): number {
        return this.elements.length;
    }

    clean():void {
        this.elements=[];
    }

    /**
     * 重新排序指定元素
     *
     * @param element
     */
    rescoreElement(element: T): void {
        this.sinkDown(this.elements.indexOf(element));
    }

    /**
     * 下沉 n 个元素
     *
     * @param n
     */
    sinkDown(n: number): void {
        // Fetch the element that has to be sunk.
        const element = this.elements[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            const parentN = ((n + 1) >> 1) - 1;
            let parent = this.elements[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.elements[parentN] = element;
                this.elements[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    }

    /**
     * 提升 n 个元素
     *
     * @param n
     */
    bubbleUp(n: number): void {
        // Look up the target element and its score.
        const length = this.elements.length;
        const element = this.elements[n];
        const elemScore = this.scoreFunction(element);

        while (true) {
            // Compute the indices of the child elements.
            const child2N = (n + 1) << 1;
            const child1N = child2N - 1;

            // This is used to store the new position of the element, if any.
            let swap: number | null = null;
            let child1Score: number = 0;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                const child1 = this.elements[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                const child2 = this.elements[child2N];
                const child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.elements[n] = this.elements[swap];
                this.elements[swap] = element;
                n = swap;
            } else {
                // Otherwise, we are done.
                break;
            }
        }
    }
}
