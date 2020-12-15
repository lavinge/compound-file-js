import { Color, TreeNode } from "./Node";
export interface NodeFactory<T> {
    create(value: T, color: Color): TreeNode<T>;
}
export declare class RedBlackTree<T> {
    private readonly insertHandler;
    private readonly deleteHandler;
    private root;
    private readonly comparator;
    constructor(nodeFactory: NodeFactory<T>, comparator: (o1: T, o2: T) => number);
    delete(node: TreeNode<T>): void;
    insert(value: T): TreeNode<T>;
    findNode(value: T): TreeNode<T>;
    getRoot(): TreeNode<T>;
    hasRoot(): boolean;
    isRoot(node: TreeNode<T>): boolean;
    setRoot(node: TreeNode<T>): void;
}
