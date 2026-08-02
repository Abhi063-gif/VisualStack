import { ClickSelectionStrategy, BoxSelectionStrategy } from './SelectionStrategy';
import { SelectionBox } from './SelectionBox';
import { useSelectionStore } from '../../../stores/SelectionStore';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';
import { CanvasPluginHooks } from '../plugins/CanvasPluginHooks';
import type { DesignerNode } from '../models/DesignerNode';

export class SelectionManager {
  private static instance: SelectionManager;
  public selectedIds: string[] = [];
  public selectionBox: SelectionBox = new SelectionBox();
  private clickStrategy = new ClickSelectionStrategy();
  private boxStrategy = new BoxSelectionStrategy();

  private constructor() {}

  public static getInstance(): SelectionManager {
    if (!SelectionManager.instance) {
      SelectionManager.instance = new SelectionManager();
    }
    return SelectionManager.instance;
  }

  public selectNode(targetNode: DesignerNode | null, isShiftKey = false): void {
    CanvasPluginHooks.triggerBeforeSelection([targetNode?.id ?? '']);

    this.selectedIds = this.clickStrategy.select(this.selectedIds, targetNode, isShiftKey);
    this.syncState();

    CanvasPluginHooks.triggerAfterSelection(this.selectedIds);
  }

  public selectBoxNodes(hitNodes: DesignerNode[], isShiftKey = false): void {
    CanvasPluginHooks.triggerBeforeSelection(hitNodes.map((n) => n.id));

    this.selectedIds = this.boxStrategy.selectBox(this.selectedIds, hitNodes, isShiftKey, this.selectedIds);
    this.syncState();

    CanvasPluginHooks.triggerAfterSelection(this.selectedIds);
  }

  public clearSelection(): void {
    if (this.selectedIds.length === 0) return;

    CanvasPluginHooks.triggerBeforeSelection([]);
    this.selectedIds = [];
    this.syncState();
    CanvasPluginHooks.triggerAfterSelection([]);
  }

  private syncState(): void {
    useSelectionStore.getState().selectComponents(this.selectedIds);
    eventBus.emit(SystemEventType.SELECTION_CHANGED, { selectedIds: this.selectedIds });
  }
}

export const selectionManager = SelectionManager.getInstance();
