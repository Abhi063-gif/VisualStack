import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Download, Copy, Check } from 'lucide-react';
import { sceneGraph } from '../features/designer/scenegraph/SceneGraph';
import type { SceneNode } from '../features/designer/scenegraph/SceneNode';
import { useSceneStore } from '../stores/SceneStore';
import { ExportService } from '../features/designer/services/exportService';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: '1440px',
  tablet: '768px',
  mobile: '375px',
};

export const PreviewPage: React.FC = () => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [copied, setCopied] = useState(false);
  useSceneStore((s) => s.nodes); // trigger re-render on scene store update

  const rootNodes = sceneGraph.getRootNodes();

  const handleCopyCode = async () => {
    const ok = await ExportService.copyJSXToClipboard();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderNodeElement = (sn: SceneNode): React.ReactNode => {
    const n = sn.node;
    const ns = n.nodeStyle || {};
    const lc = (n as any).layoutConfig;

    const style: React.CSSProperties = {
      position: n.parent ? 'relative' : 'absolute',
      left: `${Math.round(n.position.x)}px`,
      top: `${Math.round(n.position.y)}px`,
      width: `${Math.round(n.size.width)}px`,
      height: `${Math.round(n.size.height)}px`,
      transform: n.rotation ? `rotate(${n.rotation}deg)` : undefined,
      opacity: n.opacity ?? 1,
      backgroundColor: ns.fill && ns.fill !== 'transparent' ? ns.fill : undefined,
      border: ns.strokeWidth > 0 && ns.stroke ? `${ns.strokeWidth}px solid ${ns.stroke}` : undefined,
      borderRadius: ns.cornerRadius ? `${ns.cornerRadius}px` : undefined,
      boxShadow: ns.shadow
        ? `${ns.shadowOffsetX || 0}px ${ns.shadowOffsetY || 2}px ${ns.shadowBlur || 8}px ${ns.shadowColor || 'rgba(0,0,0,0.3)'}`
        : undefined,
      overflow: n.type === 'Frame' ? 'hidden' : 'visible',
    };

    if (lc && lc.enabled) {
      style.display = 'flex';
      style.flexDirection = lc.direction === 'column' ? 'column' : 'row';
      style.gap = `${lc.gap || 0}px`;
      if (lc.padding) {
        style.padding = `${lc.padding.top || 0}px ${lc.padding.right || 0}px ${lc.padding.bottom || 0}px ${lc.padding.left || 0}px`;
      }
      if (lc.justify) {
        const jMap: Record<string, string> = { start: 'flex-start', center: 'center', end: 'flex-end', 'space-between': 'space-between' };
        style.justifyContent = jMap[lc.justify] || 'flex-start';
      }
      if (lc.align) {
        const aMap: Record<string, string> = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' };
        style.alignItems = aMap[lc.align] || 'flex-start';
      }
    }

    if (['Text', 'Heading', 'Paragraph'].includes(n.type)) {
      style.color = ns.fill === 'transparent' ? '#ffffff' : (ns.fill || '#ffffff');
      delete style.backgroundColor;
      style.fontSize = ns.fontSize ? `${ns.fontSize}px` : undefined;
      style.fontFamily = ns.fontFamily || 'Inter, sans-serif';
      style.fontWeight = ns.fontWeight || 400;
      style.textAlign = (ns.textAlign as any) || 'left';
      return (
        <span key={n.id} style={style}>
          {n.textContent || 'Text'}
        </span>
      );
    }

    if (n.type === 'Button') {
      style.color = '#ffffff';
      style.cursor = 'pointer';
      style.display = 'inline-flex';
      style.alignItems = 'center';
      style.justifyContent = 'center';
      style.userSelect = 'none';
      return (
        <button key={n.id} style={style} onClick={() => alert(`Button "${n.name}" clicked!`)}>
          {n.textContent || 'Button'}
        </button>
      );
    }

    if (['Input', 'Textarea'].includes(n.type)) {
      style.outline = 'none';
      style.padding = '0 12px';
      style.color = '#ffffff';
      if (n.type === 'Textarea') {
        return <textarea key={n.id} placeholder={n.textContent || 'Type here...'} style={style} />;
      }
      return <input key={n.id} type="text" placeholder={n.textContent || 'Type here...'} style={style} />;
    }

    if (n.type === 'Image') {
      const src = (n as any).src || 'https://via.placeholder.com/150';
      return <img key={n.id} src={src} alt={n.name} style={{ ...style, objectFit: 'cover' }} />;
    }

    if (n.type === 'Icon') {
      const svgPath = (n as any).svgPath || '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
      return (
        <svg
          key={n.id}
          viewBox="0 0 24 24"
          fill="none"
          stroke={ns.fill || '#ffffff'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={style}
          dangerouslySetInnerHTML={{ __html: svgPath }}
        />
      );
    }

    // Default container (Frame / Group / Container / ComponentInstance)
    return (
      <div key={n.id} style={style}>
        {sn.children.map((c) => renderNodeElement(c))}
      </div>
    );
  };

  return (
    <div className="h-full bg-[#0e0f12] text-gray-200 flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 bg-[#14161b] border-b border-[#232733] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-300">Live Application Preview</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
            ● Active
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-[#0e0f12] p-1 rounded-lg border border-[#232733]">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded transition-colors ${device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Desktop View (1440px)"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded transition-colors ${device === 'tablet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Tablet View (768px)"
          >
            <Tablet size={14} />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded transition-colors ${device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Mobile View (375px)"
          >
            <Smartphone size={14} />
          </button>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f232d] hover:bg-[#2a3045] text-gray-300 text-xs rounded transition-colors border border-[#232733]"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy JSX'}</span>
          </button>
          <button
            onClick={() => ExportService.downloadJSXFile()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded transition-colors"
          >
            <Download size={13} />
            <span>Export Component</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#090a0d] custom-scrollbar">
        <div
          className="bg-[#14161b] border border-[#232733] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 relative"
          style={{ width: DEVICE_WIDTHS[device], minHeight: '800px' }}
        >
          {rootNodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-600">
              <p className="text-xs">Canvas is empty.</p>
              <p className="text-[11px] mt-1 text-gray-700">Add components in the Designer tab to preview here.</p>
            </div>
          ) : (
            rootNodes.map((sn) => renderNodeElement(sn))
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
