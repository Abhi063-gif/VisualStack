import React from 'react';
import { GitBranch, Box, Package, Server, ArrowRight, CheckCircle2, ShieldCheck, BellRing } from 'lucide-react';

export const VisualPipeline: React.FC = () => {
  const stages = [
    { name: 'Source', icon: <GitBranch size={16} />, status: 'complete' },
    { name: 'Build', icon: <Box size={16} />, status: 'complete' },
    { name: 'Package', icon: <Package size={16} />, status: 'complete' },
    { name: 'Containerize', icon: <Server size={16} />, status: 'complete' },
    { name: 'Upload', icon: <Package size={16} />, status: 'complete' },
    { name: 'Deploy', icon: <Server size={16} />, status: 'complete' },
    { name: 'Verify', icon: <ShieldCheck size={16} />, status: 'complete' },
    { name: 'Notify', icon: <BellRing size={16} />, status: 'complete' },
  ];

  return (
    <div className="bg-[#0e0f12] border border-[#232733] rounded-lg p-4 flex flex-col gap-3">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Visual CI/CD Pipeline Flow</div>
      <div className="flex items-center gap-2 overflow-x-auto py-2 custom-scrollbar">
        {stages.map((st, idx) => (
          <React.Fragment key={st.name}>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#14161b] border border-indigo-500/40 rounded-lg text-xs font-medium text-gray-200 shadow-sm shrink-0">
              <span className="text-indigo-400">{st.icon}</span>
              <span>{st.name}</span>
              <CheckCircle2 size={14} className="text-emerald-400 ml-1" />
            </div>
            {idx < stages.length - 1 && <ArrowRight size={14} className="text-gray-600 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
