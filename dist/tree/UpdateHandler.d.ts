import { TreeNode } from "./Node";
import { RedBlackTree } from "./RedBlackTree";
export declare class UpdateHandler<T> {
    protected readonly tree: RedBlackTree<T>;
    constructor(tree: RedBlackTree<T>);
    rightRotate(subTreeRoot: TreeNode<T>, pivot: TreeNode<T>): void;
    leftRotate(subTreeRoot: TreeNode<T>, pivot: TreeNode<T>): void;
    swapColor(node1: TreeNode<T>, node2: TreeNode<T>): void;
}
