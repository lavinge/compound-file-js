import { NodeFactory, RedBlackTree } from "./RedBlackTree";
import { TreeLevel } from "./TreeLevel";
export declare class TreeBuilder<T> {
    private readonly nodeFactory;
    private readonly tree;
    constructor(nodeFactory: NodeFactory<T>, comparator: (o1: T, o2: T) => number);
    static empty<T>(nodeFactory: NodeFactory<T>, comparator: (o1: T, o2: T) => number): TreeBuilder<T>;
    setRootNode(value: T, levelBuilder?: (level: TreeLevel<T>) => void): TreeBuilder<T>;
    build(): RedBlackTree<T>;
}
