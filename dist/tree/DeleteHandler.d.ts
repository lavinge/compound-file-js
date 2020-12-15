import { UpdateHandler } from "./UpdateHandler";
import { TreeNode } from "./Node";
import { RedBlackTree } from "./RedBlackTree";
export declare class DeleteHandler<T> extends UpdateHandler<T> {
    private readonly comparator;
    constructor(tree: RedBlackTree<T>, comparator: (o1: T, o2: T) => number);
    delete(node: TreeNode<T>): void;
    inOrderPredecessor(node: TreeNode<T>): TreeNode<T>;
    recover(sibling: TreeNode<T>): void;
    swap(node1: TreeNode<T>, node2: TreeNode<T>): void;
    swapChildParent(parent: TreeNode<T>, child: TreeNode<T>): void;
}
