export declare enum Color {
    RED = 0,
    BLACK = 1
}
export declare class TreeNode<T> {
    private readonly value;
    private leftChild;
    private rightChild;
    private parent;
    private color;
    constructor(value: T, color: Color);
    getLeftChild(): TreeNode<T>;
    setLeftChild(value: TreeNode<T>): void;
    getValue(): T;
    setRightChild(value: TreeNode<T>): void;
    getRightChild(): TreeNode<T>;
    getParent(): TreeNode<T>;
    setParent(parent: TreeNode<T>): void;
    hasChildren(): boolean;
    hasTwoChildren(): boolean;
    isLeftChild(node: TreeNode<T>): boolean;
    isRightChild(node: TreeNode<T>): boolean;
    deleteChild(node: TreeNode<T>): void;
    substituteNode(node: TreeNode<T>, substitute: TreeNode<T>): void;
    getChildrenRecursive(): TreeNode<T>[];
    getColor(): Color;
    setColor(color: Color): void;
    invertColor(): void;
    uncle(): TreeNode<T>;
    grandParent(): TreeNode<T>;
    sibling(): TreeNode<T>;
}
