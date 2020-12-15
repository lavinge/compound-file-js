import { DirectoryEntry } from "./DirectoryEntry";
import { Color, TreeNode } from "../tree/Node";
export declare class DirectoryEntryNode extends TreeNode<DirectoryEntry> {
    constructor(value: DirectoryEntry, color: Color);
    getLeftChild(): DirectoryEntryNode;
    getRightChild(): DirectoryEntryNode;
    setLeftChild(leftChild: DirectoryEntryNode): void;
    setRightChild(rightChild: DirectoryEntryNode): void;
    deleteChild(node: DirectoryEntryNode): void;
    substituteNode(node: DirectoryEntryNode, substitute: DirectoryEntryNode): void;
    setColor(color: Color): void;
    invertColor(): void;
}
