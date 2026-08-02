import type { DesignerNode } from '../models/DesignerNode';

export interface ISelectionStrategy {
  select(existingSelection: string[], targetNode: DesignerNode | null, isShiftKey: boolean): string[];
}

export class ClickSelectionStrategy implements ISelectionStrategy {
  public select(existingSelection: string[], targetNode: DesignerNode | null, isShiftKey: boolean): string[] {
    if (!targetNode) {
      return isShiftKey ? existingSelection : [];
    }

    if (isShiftKey) {
      if (existingSelection.includes(targetNode.id)) {
        return existingSelection.filter((id) => id !== targetNode.id);
      } else {
        return [...existingSelection, targetNode.id];
      }
    }

    return [targetNode.id];
  }
}

export class BoxSelectionStrategy implements ISelectionStrategy {
  public selectBox(_existingSelection: string[], hitNodes: DesignerNode[], isShiftKey: boolean, currentSelection: string[]): string[] {
    const hitIds = hitNodes.map((n) => n.id);
    if (isShiftKey) {
      return Array.from(new Set([...currentSelection, ...hitIds]));
    }
    return hitIds;
  }

  public select(existingSelection: string[], targetNode: DesignerNode | null, isShiftKey: boolean): string[] {
    return new ClickSelectionStrategy().select(existingSelection, targetNode, isShiftKey);
  }
}
