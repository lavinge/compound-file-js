import { Color, TreeNode } from "./Node";
import { NodeFactory } from "./RedBlackTree";
export declare class TreeLevel<T> {
    private parent;
    private readonly nodeFactory;
    constructor(parent: TreeNode<T>, nodeFactory: NodeFactory<T>);
    left(value: T, color: Color, levelBuilder?: (level: TreeLevel<T>) => void): void;
    right(value: T, color: Color, levelBuilder?: (level: TreeLevel<T>) => void): void;
}
