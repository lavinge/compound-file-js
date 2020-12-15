import { TreeNode } from "./Node";
import { NodeFactory, RedBlackTree } from "./RedBlackTree";
import { UpdateHandler } from "./UpdateHandler";
export declare class InsertHandler<T> extends UpdateHandler<T> {
    private readonly nodeFactory;
    private readonly comparator;
    constructor(tree: RedBlackTree<T>, nodeFactory: NodeFactory<T>, comparator: (o1: T, o2: T) => number);
    insert(value: T): TreeNode<T>;
    simpleInsert(value: T): TreeNode<T>;
    recolorAndRotateIfNeeded(node: TreeNode<T>): void;
    rotateSubtree(grandParent: TreeNode<T>, parent: TreeNode<T>, grandChild: TreeNode<T>): void;
    recolorAfterRotate(pivot: TreeNode<T>): void;
    recolorIfRedScenario(grandChild: TreeNode<T>): void;
    rotateAndRecolorIfBlackScenario(grandChild: TreeNode<T>): void;
}
