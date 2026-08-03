import React from 'react';
import { useLocation } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { TopToolbar } from './TopToolbar';
import { ActivityBar } from './ActivityBar';
import { ToolsBar } from './ToolsBar';
import { ToolboxPanel } from './ToolboxPanel';
import { InspectorPanel } from './InspectorPanel';
import { BottomPanel } from './BottomPanel';
import { StatusBar } from './StatusBar';
import { ContextMenu } from '../../features/designer/components/layout/ContextMenu';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isDesignerRoute = location.pathname === '/designer';
  const isPreviewRoute = location.pathname === '/preview';

  if (isPreviewRoute) {
    return (
      <div className="w-full h-full min-h-screen bg-[#090a0f] text-white overflow-auto">
        {children}
      </div>
    );
  }

  return (
    // position:fixed + inset:0 guarantees exactly the viewport with no overflow
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0e0f12',
        color: '#f3f4f6',
        fontFamily: 'Inter, system-ui, sans-serif',
        userSelect: 'none',
      }}
    >
      <ContextMenu />
      {/* ── Top Toolbar (36px) ──────────────────────────── */}
      <TopToolbar />

      {/* ── Main Workspace Row (fills all remaining height) ─ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, minWidth: 0 }}>

        {/* Fixed-width Activity Bar (48px) */}
        <ActivityBar />

        {/* Resizable Work Area: Left Drawer + Main Canvas + Right Inspector */}
        <div style={{ flex: 1, overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
          {isDesignerRoute ? (
            <Group orientation="horizontal" style={{ width: '100%', height: '100%' }}>
              {/* Left Toolbox Drawer */}
              <Panel defaultSize={20} minSize={1} style={{ overflow: 'hidden', minWidth: 0 }}>
                <ToolboxPanel />
              </Panel>

              <Separator
                style={{ width: '5px', background: '#232733', cursor: 'col-resize', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#6366f1'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#232733'; }}
              />

              {/* Center Canvas Area with ToolsBar on top and BottomPanel at bottom */}
              <Panel defaultSize={55} minSize={30} style={{ overflow: 'hidden', minWidth: 0 }}>
                <Group orientation="vertical" style={{ width: '100%', height: '100%' }}>
                  {/* Canvas Viewport Panel */}
                  <Panel defaultSize={75} minSize={20} style={{ overflow: 'hidden', minHeight: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
                      <ToolsBar />
                      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#090a0f' }}>
                        {children}
                      </div>
                    </div>
                  </Panel>

                  <Separator
                    style={{ height: '5px', background: '#232733', cursor: 'row-resize', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#6366f1'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#232733'; }}
                  />

                  {/* Bottom Console Panel */}
                  <Panel defaultSize={25} minSize={5} style={{ overflow: 'hidden', minHeight: 0 }}>
                    <BottomPanel />
                  </Panel>
                </Group>
              </Panel>

              <Separator
                style={{ width: '5px', background: '#232733', cursor: 'col-resize', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#6366f1'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#232733'; }}
              />

              {/* Right Inspector Panel */}
              <Panel defaultSize={25} minSize={1} style={{ overflow: 'hidden', minWidth: 0 }}>
                <InspectorPanel />
              </Panel>
            </Group>
          ) : (
            /* All Other Routes (e.g. /backend, /dashboard, /projects): Render Page Content Directly */
            <div style={{ width: '100%', height: '100%', minWidth: 0, overflow: 'hidden' }}>
              {children}
            </div>
          )}
        </div>
      </div>

      {/* ── Status Bar (24px) ────────────────────────────── */}
      <StatusBar />
    </div>
  );
};
