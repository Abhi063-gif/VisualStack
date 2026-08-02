import { sceneGraph } from '../scenegraph/SceneGraph';
import type { SceneNode } from '../scenegraph/SceneNode';

export type CodeExportMode = 'react-tailwind' | 'react-inline' | 'html-css';

export class CodeGenerator {
  public static generateCode(mode: CodeExportMode = 'react-tailwind'): string {
    switch (mode) {
      case 'react-tailwind':
        return this.generateReactTailwind();
      case 'react-inline':
        return this.generateJSX();
      case 'html-css':
        return this.generateHTML();
      default:
        return this.generateReactTailwind();
    }
  }

  /** Generate Modern React + Tailwind CSS Component */
  public static generateReactTailwind(): string {
    const rootNodes = sceneGraph.getRootNodes();
    if (rootNodes.length === 0) {
      return `import React from 'react';

export default function GeneratedCanvas() {
  return (
    <div className="w-full h-screen bg-[#0e0f12] flex items-center justify-center text-gray-500">
      <p>No elements on canvas</p>
    </div>
  );
}`;
    }

    const childrenJSX = rootNodes.map((sn) => this.generateNodeTailwind(sn, 2)).join('\n\n');

    return `import React from 'react';

export default function GeneratedCanvas() {
  return (
    <div className="relative w-full min-h-screen bg-[#0e0f12] overflow-auto p-4">
${childrenJSX}
    </div>
  );
}`;
  }

  /** Generate Clean React JSX with Inline Styles */
  public static generateJSX(): string {
    const rootNodes = sceneGraph.getRootNodes();
    if (rootNodes.length === 0) {
      return `import React from 'react';

export default function GeneratedCanvas() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#0e0f12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
      <p>No elements on canvas</p>
    </div>
  );
}`;
    }

    const childrenJSX = rootNodes.map((sn) => this.generateNodeJSX(sn, 2)).join('\n\n');

    return `import React from 'react';

export default function GeneratedCanvas() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0e0f12', overflow: 'auto' }}>
${childrenJSX}
    </div>
  );
}`;
  }

  /** Generate Semantic HTML5 + Custom CSS */
  public static generateHTML(): string {
    const rootNodes = sceneGraph.getRootNodes();
    if (rootNodes.length === 0) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VisualStack Output</title>
</head>
<body style="margin: 0; background: #0e0f12; color: #6b7280; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
  <p>No elements on canvas</p>
</body>
</html>`;
    }

    const childrenHTML = rootNodes.map((sn) => this.generateNodeHTML(sn, 2)).join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VisualStack Output</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #0e0f12; font-family: Inter, system-ui, sans-serif; }
    .canvas-container { position: relative; width: 100%; min-height: 100vh; overflow: auto; }
  </style>
</head>
<body>
  <div class="canvas-container">
${childrenHTML}
  </div>
</body>
</html>`;
  }

  // ── React Tailwind Code Generator ──────────────────────────────────────────
  private static generateNodeTailwind(sceneNode: SceneNode, indentLevel: number): string {
    const node = sceneNode.node;
    const indent = ' '.repeat(indentLevel * 2);
    const classes: string[] = [];

    const parentNode = sceneNode.parent?.node;
    const isParentAutoLayout = parentNode && (parentNode as any).layoutConfig?.enabled;

    // Dimensions & Positioning
    classes.push(`w-[${Math.round(node.size.width)}px]`);
    classes.push(`h-[${Math.round(node.size.height)}px]`);

    if (!isParentAutoLayout) {
      classes.push('absolute');
      classes.push(`left-[${Math.round(node.position.x)}px]`);
      classes.push(`top-[${Math.round(node.position.y)}px]`);
    }

    // Node Style Properties
    const ns = node.nodeStyle || {};
    const lc = (node as any).layoutConfig;

    if (node.type !== 'Group') {
      if (ns.fill && ns.fill !== 'transparent') {
        classes.push(this.colorToTailwindBg(ns.fill));
      }

      if (ns.strokeWidth > 0 && ns.stroke && ns.stroke !== 'transparent') {
        classes.push('border');
        if (ns.strokeWidth > 1) classes.push(`border-[${ns.strokeWidth}px]`);
        classes.push(this.colorToTailwindBorder(ns.stroke));
      }

      if (ns.cornerRadius) {
        classes.push(this.radiusToTailwind(ns.cornerRadius));
      }

      if (ns.shadow) {
        classes.push('shadow-lg');
      }
    }

    // Auto-Layout (Flexbox)
    if (lc && lc.enabled) {
      classes.push('flex');
      classes.push(lc.direction === 'column' ? 'flex-col' : 'flex-row');
      if (lc.gap) classes.push(`gap-[${lc.gap}px]`);

      if (lc.padding) {
        if (lc.padding.top === lc.padding.bottom && lc.padding.left === lc.padding.right) {
          if (lc.padding.top > 0) classes.push(`p-[${lc.padding.top}px]`);
        } else {
          if (lc.padding.top) classes.push(`pt-[${lc.padding.top}px]`);
          if (lc.padding.right) classes.push(`pr-[${lc.padding.right}px]`);
          if (lc.padding.bottom) classes.push(`pb-[${lc.padding.bottom}px]`);
          if (lc.padding.left) classes.push(`pl-[${lc.padding.left}px]`);
        }
      }

      if (lc.justify) {
        const justifyMap: Record<string, string> = {
          start: 'justify-start', center: 'justify-center', end: 'justify-end', 'space-between': 'justify-between',
        };
        classes.push(justifyMap[lc.justify] || 'justify-start');
      }

      if (lc.align) {
        const alignMap: Record<string, string> = {
          start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch',
        };
        classes.push(alignMap[lc.align] || 'items-start');
      }
    }

    const tag = this.getSemanticTag(node.type);
    const classNameStr = classes.join(' ');
    const elementName = this.cleanName(node.name || node.type);

    if (['Text', 'Heading', 'Paragraph'].includes(node.type)) {
      const textClasses = [...classes];
      if (ns.fill && ns.fill !== 'transparent') {
        textClasses.push(this.colorToTailwindText(ns.fill));
      } else {
        textClasses.push('text-white');
      }

      if (ns.fontSize) textClasses.push(this.fontSizeToTailwind(ns.fontSize));
      if (ns.fontWeight) textClasses.push(`font-[${ns.fontWeight}]`);
      if (ns.fontFamily) textClasses.push(`font-['${ns.fontFamily}']`);
      if (ns.textAlign) textClasses.push(`text-${ns.textAlign}`);

      const textTag = node.type === 'Heading' ? 'h2' : node.type === 'Paragraph' ? 'p' : 'span';
      const text = node.textContent || 'Text';
      return `${indent}<${textTag} className="${textClasses.join(' ')}">
${indent}  ${text}
${indent}</${textTag}>`;
    }

    if (node.type === 'Button') {
      const btnClasses = [...classes, 'inline-flex', 'items-center', 'justify-center', 'cursor-pointer', 'text-white', 'font-medium'];
      const text = node.textContent || 'Button';
      return `${indent}<button className="${btnClasses.join(' ')}">
${indent}  ${text}
${indent}</button>`;
    }

    if (['Input', 'Textarea'].includes(node.type)) {
      const inputTag = node.type === 'Textarea' ? 'textarea' : 'input';
      const inputClasses = [...classes, 'outline-none', 'px-3', 'text-white', 'placeholder-gray-400'];
      return `${indent}<${inputTag} placeholder="${node.textContent || 'Type here...'}" className="${inputClasses.join(' ')}" />`;
    }

    if (node.type === 'Image') {
      const src = (node as any).src || 'https://via.placeholder.com/150';
      return `${indent}<img src="${src}" alt="${elementName}" className="${classNameStr}" />`;
    }

    if (node.type === 'Icon') {
      const svgPath = (node as any).svgPath || '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
      return `${indent}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="${classNameStr} text-white" dangerouslySetInnerHTML={{ __html: \`${svgPath}\` }} />`;
    }

    const children = sceneNode.children;
    if (children.length === 0) {
      return `${indent}<${tag} className="${classNameStr}">
${indent}  {/* ${elementName} */}
${indent}</${tag}>`;
    }

    const innerJSX = children.map((c) => this.generateNodeTailwind(c, indentLevel + 1)).join('\n');
    return `${indent}<${tag} className="${classNameStr}">
${innerJSX}
${indent}</${tag}>`;
  }

  // ── React Inline Style Generator ───────────────────────────────────────────
  private static generateNodeJSX(sceneNode: SceneNode, indentLevel: number): string {
    const node = sceneNode.node;
    const indent = ' '.repeat(indentLevel * 2);
    const ns = node.nodeStyle || {};
    const lc = (node as any).layoutConfig;

    const parentNode = sceneNode.parent?.node;
    const isParentAutoLayout = parentNode && (parentNode as any).layoutConfig?.enabled;

    const styles: Record<string, string | number> = {
      width: `${Math.round(node.size.width)}px`,
      height: `${Math.round(node.size.height)}px`,
    };

    if (!isParentAutoLayout) {
      styles.position = 'absolute';
      styles.left = `${Math.round(node.position.x)}px`;
      styles.top = `${Math.round(node.position.y)}px`;
    }

    if (node.rotation) styles.transform = `rotate(${node.rotation}deg)`;
    if (node.opacity !== undefined && node.opacity !== 1) styles.opacity = node.opacity;

    if (node.type !== 'Group' && ns.fill && ns.fill !== 'transparent') {
      styles.backgroundColor = ns.fill;
    }

    if (node.type !== 'Group') {
      if (ns.strokeWidth > 0 && ns.stroke && ns.stroke !== 'transparent') {
        styles.border = `${ns.strokeWidth}px solid ${ns.stroke}`;
      }
      if (ns.cornerRadius > 0) styles.borderRadius = `${ns.cornerRadius}px`;
    }

    if (ns.shadow && node.type !== 'Group') {
      styles.boxShadow = `${ns.shadowOffsetX || 0}px ${ns.shadowOffsetY || 2}px ${ns.shadowBlur || 8}px ${ns.shadowColor || 'rgba(0,0,0,0.3)'}`;
    }

    if (lc && lc.enabled) {
      styles.display = 'flex';
      styles.flexDirection = lc.direction === 'column' ? 'column' : 'row';
      styles.gap = `${lc.gap || 0}px`;
      if (lc.padding) {
        styles.padding = `${lc.padding.top || 0}px ${lc.padding.right || 0}px ${lc.padding.bottom || 0}px ${lc.padding.left || 0}px`;
      }
      if (lc.justify) {
        const justifyMap: Record<string, string> = {
          start: 'flex-start', center: 'center', end: 'flex-end', 'space-between': 'space-between',
        };
        styles.justifyContent = justifyMap[lc.justify] || 'flex-start';
      }
      if (lc.align) {
        const alignMap: Record<string, string> = {
          start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch',
        };
        styles.alignItems = alignMap[lc.align] || 'flex-start';
      }
    }

    const styleAttr = this.formatJSXStyle(styles);
    const tag = this.getSemanticTag(node.type);
    const elementName = this.cleanName(node.name || node.type);

    if (['Text', 'Heading', 'Paragraph'].includes(node.type)) {
      styles.color = ns.fill === 'transparent' ? '#ffffff' : (ns.fill || '#ffffff');
      delete styles.backgroundColor;
      if (ns.fontSize) styles.fontSize = `${ns.fontSize}px`;
      if (ns.fontFamily) styles.fontFamily = ns.fontFamily;
      if (ns.fontWeight) styles.fontWeight = ns.fontWeight;
      if (ns.textAlign) styles.textAlign = ns.textAlign;

      const textTag = node.type === 'Heading' ? 'h2' : node.type === 'Paragraph' ? 'p' : 'span';
      const text = node.textContent || 'Text';
      return `${indent}<${textTag} style={${this.formatJSXStyle(styles)}}>
${indent}  ${text}
${indent}</${textTag}>`;
    }

    if (node.type === 'Button') {
      styles.color = '#ffffff';
      styles.cursor = 'pointer';
      styles.display = 'inline-flex';
      styles.alignItems = 'center';
      styles.justifyContent = 'center';
      const text = node.textContent || 'Button';
      return `${indent}<button style={${this.formatJSXStyle(styles)}}>
${indent}  ${text}
${indent}</button>`;
    }

    if (['Input', 'Textarea'].includes(node.type)) {
      const inputTag = node.type === 'Textarea' ? 'textarea' : 'input';
      styles.outline = 'none';
      styles.padding = '0 12px';
      styles.color = '#ffffff';
      return `${indent}<${inputTag} placeholder="${node.textContent || 'Type here...'}" style={${this.formatJSXStyle(styles)}} />`;
    }

    if (node.type === 'Image') {
      const src = (node as any).src || 'https://via.placeholder.com/150';
      return `${indent}<img src="${src}" alt="${elementName}" style={${this.formatJSXStyle(styles)}} />`;
    }

    if (node.type === 'Icon') {
      const svgPath = (node as any).svgPath || '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
      return `${indent}<svg viewBox="0 0 24 24" fill="none" stroke="${ns.fill || '#ffffff'}" strokeWidth="2" style={${this.formatJSXStyle(styles)}} dangerouslySetInnerHTML={{ __html: \`${svgPath}\` }} />`;
    }

    const children = sceneNode.children;
    if (children.length === 0) {
      return `${indent}<${tag} data-node-id="${node.id}" style={${styleAttr}}>
${indent}  {/* ${elementName} */}
${indent}</${tag}>`;
    }

    const innerJSX = children.map((c) => this.generateNodeJSX(c, indentLevel + 1)).join('\n');
    return `${indent}<${tag} data-node-id="${node.id}" style={${styleAttr}}>
${innerJSX}
${indent}</${tag}>`;
  }

  // ── HTML Code Generator ───────────────────────────────────────────────────
  private static generateNodeHTML(sceneNode: SceneNode, indentLevel: number): string {
    const node = sceneNode.node;
    const indent = ' '.repeat(indentLevel * 2);
    const ns = node.nodeStyle || {};
    const lc = (node as any).layoutConfig;

    const parentNode = sceneNode.parent?.node;
    const isParentAutoLayout = parentNode && (parentNode as any).layoutConfig?.enabled;

    const inlineStyles: string[] = [
      `width: ${Math.round(node.size.width)}px;`,
      `height: ${Math.round(node.size.height)}px;`,
    ];

    if (!isParentAutoLayout) {
      inlineStyles.push(`position: absolute;`);
      inlineStyles.push(`left: ${Math.round(node.position.x)}px;`);
      inlineStyles.push(`top: ${Math.round(node.position.y)}px;`);
    }

    if (node.rotation) inlineStyles.push(`transform: rotate(${node.rotation}deg);`);
    if (node.opacity !== undefined && node.opacity !== 1) inlineStyles.push(`opacity: ${node.opacity};`);

    if (node.type !== 'Group' && ns.fill && ns.fill !== 'transparent') {
      inlineStyles.push(`background-color: ${ns.fill};`);
    }

    if (node.type !== 'Group') {
      if (ns.strokeWidth > 0 && ns.stroke && ns.stroke !== 'transparent') {
        inlineStyles.push(`border: ${ns.strokeWidth}px solid ${ns.stroke};`);
      }
      if (ns.cornerRadius > 0) inlineStyles.push(`border-radius: ${ns.cornerRadius}px;`);
    }

    if (lc && lc.enabled) {
      inlineStyles.push(`display: flex;`);
      inlineStyles.push(`flex-direction: ${lc.direction === 'column' ? 'column' : 'row'};`);
      inlineStyles.push(`gap: ${lc.gap || 0}px;`);
      if (lc.padding) {
        inlineStyles.push(`padding: ${lc.padding.top || 0}px ${lc.padding.right || 0}px ${lc.padding.bottom || 0}px ${lc.padding.left || 0}px;`);
      }
    }

    const tag = this.getSemanticTag(node.type);
    const styleStr = inlineStyles.join(' ');

    if (['Text', 'Heading', 'Paragraph'].includes(node.type)) {
      const textColor = ns.fill === 'transparent' ? '#ffffff' : (ns.fill || '#ffffff');
      const textTag = node.type === 'Heading' ? 'h2' : node.type === 'Paragraph' ? 'p' : 'span';
      const text = node.textContent || 'Text';
      return `${indent}<${textTag} style="${styleStr} color: ${textColor}; margin: 0;">${text}</${textTag}>`;
    }

    if (node.type === 'Button') {
      const text = node.textContent || 'Button';
      return `${indent}<button style="${styleStr} color: #ffffff; cursor: pointer;">${text}</button>`;
    }

    const children = sceneNode.children;
    if (children.length === 0) {
      return `${indent}<${tag} style="${styleStr}"></${tag}>`;
    }

    const innerHTML = children.map((c) => this.generateNodeHTML(c, indentLevel + 1)).join('\n');
    return `${indent}<${tag} style="${styleStr}">
${innerHTML}
${indent}</${tag}>`;
  }

  // ── Utilities ─────────────────────────────────────────────────────────────
  private static getSemanticTag(type: string): string {
    const tagMap: Record<string, string> = {
      Navbar: 'nav',
      Sidebar: 'aside',
      Section: 'section',
      Card: 'article',
      Heading: 'h2',
      Paragraph: 'p',
      Text: 'span',
      Button: 'button',
      Input: 'input',
      Textarea: 'textarea',
      Image: 'img',
    };
    return tagMap[type] || 'div';
  }

  private static formatJSXStyle(styles: Record<string, string | number>): string {
    const entries = Object.entries(styles).map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `'${v}'`}`);
    return `{ ${entries.join(', ')} }`;
  }

  private static colorToTailwindBg(color: string): string {
    const map: Record<string, string> = {
      '#ffffff': 'bg-white', '#000000': 'bg-black', '#0e0f12': 'bg-slate-950',
      '#1e293b': 'bg-slate-800', '#3b82f6': 'bg-blue-500', '#6366f1': 'bg-indigo-500',
      '#10b981': 'bg-emerald-500', '#ef4444': 'bg-red-500', 'transparent': 'bg-transparent',
    };
    return map[color.toLowerCase()] || `bg-[${color}]`;
  }

  private static colorToTailwindText(color: string): string {
    const map: Record<string, string> = {
      '#ffffff': 'text-white', '#000000': 'text-black', '#6b7280': 'text-gray-500',
      '#9ca3af': 'text-gray-400', '#3b82f6': 'text-blue-500', '#6366f1': 'text-indigo-500',
    };
    return map[color.toLowerCase()] || `text-[${color}]`;
  }

  private static colorToTailwindBorder(color: string): string {
    const map: Record<string, string> = {
      '#ffffff': 'border-white', '#000000': 'border-black', '#374151': 'border-gray-700',
      '#6366f1': 'border-indigo-500',
    };
    return map[color.toLowerCase()] || `border-[${color}]`;
  }

  private static radiusToTailwind(r: number): string {
    if (r <= 2) return 'rounded-sm';
    if (r <= 4) return 'rounded';
    if (r <= 8) return 'rounded-md';
    if (r <= 12) return 'rounded-lg';
    if (r <= 16) return 'rounded-xl';
    if (r <= 24) return 'rounded-2xl';
    if (r >= 999) return 'rounded-full';
    return `rounded-[${r}px]`;
  }

  private static fontSizeToTailwind(size: number): string {
    if (size <= 12) return 'text-xs';
    if (size <= 14) return 'text-sm';
    if (size <= 16) return 'text-base';
    if (size <= 18) return 'text-lg';
    if (size <= 20) return 'text-xl';
    if (size <= 24) return 'text-2xl';
    if (size <= 30) return 'text-3xl';
    if (size <= 36) return 'text-4xl';
    return `text-[${size}px]`;
  }

  private static cleanName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
  }
}
