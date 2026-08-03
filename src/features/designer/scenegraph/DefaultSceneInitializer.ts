import { sceneGraph } from './SceneGraph';
import { BaseDesignerNode } from '../nodes/base/BaseDesignerNode';
import { useSceneStore } from '../../../stores/SceneStore';

class DefaultNode extends BaseDesignerNode {}

export function initDefaultCanvasState(): void {
  if (sceneGraph.getAllNodes().length > 0) return;

  // 1. Main Desktop - 1440 Artboard Frame
  const desktopFrame = new DefaultNode({
    id: 'frame_desktop_main',
    name: 'Desktop - 1440',
    type: 'Frame',
    position: { x: 100, y: 60 },
    size: { width: 1280, height: 800 },
  });
  desktopFrame.nodeStyle.fill = '#14161d';
  desktopFrame.nodeStyle.stroke = '#363c4e';
  desktopFrame.nodeStyle.strokeWidth = 2;
  desktopFrame.nodeStyle.cornerRadius = 16;

  // 2. Hero Header Container Inside Frame
  const heroBox = new DefaultNode({
    id: 'hero_box_1',
    name: 'Hero Section',
    type: 'Frame',
    parent: 'frame_desktop_main',
    position: { x: 60, y: 60 },
    size: { width: 1160, height: 320 },
  });
  heroBox.nodeStyle.fill = '#181a20';
  heroBox.nodeStyle.stroke = '#2b3040';
  heroBox.nodeStyle.strokeWidth = 1;
  heroBox.nodeStyle.cornerRadius = 16;
  desktopFrame.children.push('hero_box_1');

  // 3. Welcome Title Text
  const titleText = new DefaultNode({
    id: 'title_text_1',
    name: 'Hero Title',
    type: 'Heading',
    parent: 'hero_box_1',
    position: { x: 40, y: 40 },
    size: { width: 850, height: 50 },
  });
  titleText.textContent = 'Welcome to VisualStack Studio';
  titleText.nodeStyle.fontSize = 32;
  titleText.nodeStyle.fontWeight = 700;
  titleText.nodeStyle.fill = '#818cf8';
  heroBox.children.push('title_text_1');

  // 4. Subtitle Paragraph Text
  const subText = new DefaultNode({
    id: 'sub_text_1',
    name: 'Hero Description',
    type: 'Paragraph',
    parent: 'hero_box_1',
    position: { x: 40, y: 105 },
    size: { width: 950, height: 45 },
  });
  subText.textContent = 'Drag components from the left sidebar onto this canvas, build logic flows, and compile to production code.';
  subText.nodeStyle.fontSize = 16;
  subText.nodeStyle.fill = '#9ca3af';
  heroBox.children.push('sub_text_1');

  // 5. Call To Action Button
  const ctaButton = new DefaultNode({
    id: 'cta_btn_1',
    name: 'Primary CTA Button',
    type: 'Button',
    parent: 'hero_box_1',
    position: { x: 40, y: 180 },
    size: { width: 180, height: 48 },
  });
  ctaButton.textContent = 'Get Started';
  ctaButton.nodeStyle.fill = '#6366f1';
  ctaButton.nodeStyle.cornerRadius = 8;
  heroBox.children.push('cta_btn_1');

  // Add all to sceneGraph and sync to useSceneStore
  sceneGraph.addNode(desktopFrame);
  sceneGraph.addNode(heroBox);
  sceneGraph.addNode(titleText);
  sceneGraph.addNode(subText);
  sceneGraph.addNode(ctaButton);

  useSceneStore.getState().syncFromSceneGraph();
}
