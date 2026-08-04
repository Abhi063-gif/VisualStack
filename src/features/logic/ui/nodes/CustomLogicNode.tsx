import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import * as Icons from 'lucide-react';
import type { LogicPort } from '../../connections/Port';
import { graphManager } from '../../graph/GraphManager';
import { useLogicStore } from '../../../../stores/LogicStore';

export interface LogicNodePropsData {
  label: string;
  nodeType: string;
  category: string;
  description: string;
  icon?: string;
  color?: string;
  inputs: LogicPort[];
  outputs: LogicPort[];
  config: Record<string, unknown>;
}

// ==================== 1. DATABASE NODE COMPONENT ====================
const DatabaseNodeView: React.FC<{ id: string; nodeData: LogicNodePropsData; selected: boolean }> = ({ id, nodeData, selected }) => {
  const { setSelectedNodeId, syncFromGraph } = useLogicStore();

  const [dbName, setDbName] = useState((nodeData.config.dbName as string) || 'User Profile');
  const [dbApiUrl, setDbApiUrl] = useState((nodeData.config.dbApiUrl as string) || 'https://api.mydb.com/v1');
  const [dbType, setDbType] = useState((nodeData.config.dbType as string) || 'PostgreSQL');
  const [isPrivateVal, setIsPrivateVal] = useState(true);
  const [storeLocalVar, setStoreLocalVar] = useState(true);
  const [varName, setVarName] = useState((nodeData.config.varName as string) || 'userData');
  const [nextPage, setNextPage] = useState((nodeData.config.nextPage as string) || 'Dashboard Screen');

  const [fields, setFields] = useState<Array<{ name: string; type: string; val: string; isPrivate: boolean }>>(
    (nodeData.config.fields as any) || [
      { name: 'username', type: 'Text', val: 'Input.username', isPrivate: false },
      { name: 'email', type: 'Email', val: 'Input.email', isPrivate: false },
      { name: 'password', type: 'Password', val: 'Input.password', isPrivate: true },
      { name: 'age', type: 'Integer', val: '18', isPrivate: false },
    ]
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    graphManager.deleteNode(id);
    syncFromGraph();
  };

  const handleAddField = () => {
    setFields([...fields, { name: 'newField', type: 'Text', val: 'Input.value', isPrivate: false }]);
  };

  const handleRemoveField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx: number, key: string, val: any) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], [key]: val };
    setFields(updated);
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative w-[540px] rounded-2xl bg-[#0c0e15] text-gray-100 shadow-2xl border transition-all duration-200 select-none ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-emerald-500/20' : 'border-[#1e2333] hover:border-[#2b3248]'
      }`}
    >
      {/* Target Input Handle on Left border */}
      <Handle
        type="target"
        position={Position.Left}
        id="exec"
        style={{
          backgroundColor: '#ffffff',
          width: '18px',
          height: '18px',
          border: '3px solid #0c0e15',
          left: '-9px',
          top: '50%',
          zIndex: 40,
        }}
        className="hover:scale-125 transition-transform cursor-crosshair shadow-lg"
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1b2030] bg-[#111420] rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Icons.Database size={18} />
          </div>
          <span className="text-base font-bold text-gray-100 tracking-tight">Database</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-rose-400 transition-colors">
            <Icons.MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Body Form */}
      <div className="p-5 space-y-4 text-xs font-sans">
        {/* Top Controls Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={dbName}
              onChange={(e) => setDbName(e.target.value)}
              className="w-full bg-[#151926] border border-[#23293e] rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-emerald-500 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-400 mb-1">Enter Database API</label>
            <input
              type="text"
              value={dbApiUrl}
              onChange={(e) => setDbApiUrl(e.target.value)}
              className="w-full bg-[#151926] border border-[#23293e] rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-emerald-500 text-xs font-mono"
            />
          </div>
        </div>

        {/* Top Controls Row 2 */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-[11px] font-medium text-gray-400 mb-1">Type of Database</label>
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              className="w-full bg-[#151926] border border-[#23293e] rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-emerald-500 text-xs font-mono cursor-pointer"
            >
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MongoDB">MongoDB</option>
              <option value="MySQL">MySQL</option>
              <option value="SQLite">SQLite</option>
            </select>
          </div>

          <div className="flex items-center justify-between bg-[#151926] border border-[#23293e] rounded-xl px-3 py-2 mt-4">
            <span className="text-[11px] font-medium text-gray-300">Private Value ?</span>
            <button
              onClick={() => setIsPrivateVal(!isPrivateVal)}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${isPrivateVal ? 'bg-emerald-500' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPrivateVal ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Middle Section: Field Table */}
        <div className="bg-[#111420] border border-[#1d2233] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-200">What He Store</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono">input</span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 text-[10px] font-medium text-gray-400 uppercase tracking-wider px-1">
            <div className="col-span-3">Field Name</div>
            <div className="col-span-2">Data Type</div>
            <div className="col-span-3">Value</div>
            <div className="col-span-1 text-center">Private</div>
            <div className="col-span-2">Password to Unlock</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {fields.map((f, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#161a27] border border-[#23293e] rounded-xl p-2">
                <div className="col-span-3 flex items-center gap-1">
                  <span className="text-gray-600 text-xs cursor-grab">⋮⋮</span>
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => handleFieldChange(i, 'name', e.target.value)}
                    className="w-full bg-[#111420] border border-[#262c42] rounded-lg px-2 py-1 text-gray-200 outline-none text-xs font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <select
                    value={f.type}
                    onChange={(e) => handleFieldChange(i, 'type', e.target.value)}
                    className="w-full bg-[#111420] border border-[#262c42] rounded-lg px-1.5 py-1 text-gray-200 outline-none text-xs font-mono cursor-pointer"
                  >
                    <option value="Text">Text</option>
                    <option value="Email">Email</option>
                    <option value="Password">Password</option>
                    <option value="Integer">Integer</option>
                    <option value="Boolean">Boolean</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <input
                    type="text"
                    value={f.val}
                    onChange={(e) => handleFieldChange(i, 'val', e.target.value)}
                    className="w-full bg-[#111420] border border-emerald-900/60 rounded-lg px-2 py-1 text-emerald-400 outline-none text-xs font-mono font-medium"
                  />
                </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleFieldChange(i, 'isPrivate', !f.isPrivate)}
                    className={`w-7 h-4 rounded-full transition-colors relative p-0.5 ${f.isPrivate ? 'bg-emerald-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${f.isPrivate ? 'translate-x-3' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="col-span-2 text-[10px] font-mono text-gray-400 flex items-center justify-center gap-1">
                  {f.isPrivate ? (
                    <>
                      <span>••••••••</span>
                      <Icons.XCircle size={10} className="text-gray-500" />
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </div>

                <div className="col-span-1 flex justify-center">
                  <button onClick={() => handleRemoveField(i)} className="text-gray-500 hover:text-rose-400 transition-colors">
                    <Icons.Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Field Button */}
          <button
            onClick={handleAddField}
            className="w-full py-2 bg-[#141824] hover:bg-[#1a2030] text-gray-300 border border-dashed border-[#3a4463] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icons.Plus size={14} />
            <span>Add Field</span>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-4 items-center pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-300">Store on Local Variable ?</span>
              <button
                onClick={() => setStoreLocalVar(!storeLocalVar)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${storeLocalVar ? 'bg-emerald-500' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${storeLocalVar ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            {storeLocalVar && (
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Variable Name</label>
                <input
                  type="text"
                  value={varName}
                  onChange={(e) => setVarName(e.target.value)}
                  className="w-full bg-[#151926] border border-[#23293e] rounded-xl px-3 py-1.5 text-gray-200 outline-none text-xs font-mono"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-400 mb-1">Next Page</label>
            <select
              value={nextPage}
              onChange={(e) => setNextPage(e.target.value)}
              className="w-full bg-[#151926] border border-[#23293e] rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-emerald-500 text-xs font-mono cursor-pointer"
            >
              <option value="Dashboard Screen">Dashboard Screen</option>
              <option value="Home Screen">Home Screen</option>
              <option value="Profile Screen">Profile Screen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output Handle on Right border */}
      <Handle
        type="source"
        position={Position.Right}
        id="exec"
        style={{
          backgroundColor: '#ffffff',
          width: '18px',
          height: '18px',
          border: '3px solid #0c0e15',
          right: '-9px',
          top: '50%',
          zIndex: 40,
        }}
        className="hover:scale-125 transition-transform cursor-crosshair shadow-lg"
      />
    </div>
  );
};

// ==================== 2. AUTHENTICATION FLOW NODE COMPONENT ====================
const AuthNodeView: React.FC<{ id: string; nodeData: LogicNodePropsData; selected: boolean }> = ({ id, nodeData, selected }) => {
  const { setSelectedNodeId, syncFromGraph } = useLogicStore();

  const [authMode, setAuthMode] = useState((nodeData.config.mode as string) || 'login');
  const [emailVal, setEmailVal] = useState('Email');
  const [passVal, setPassVal] = useState('Password');
  const [confirmPassVal, setConfirmPassVal] = useState('Confirm Password (Optional)');

  const [askVerification, setAskVerification] = useState(true);
  const [storeOnDb, setStoreOnDb] = useState(true);
  const [storeLocalVar, setStoreLocalVar] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    graphManager.deleteNode(id);
    syncFromGraph();
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative w-[480px] rounded-2xl bg-[#0d101a] text-gray-100 shadow-2xl border transition-all duration-200 select-none ${
        selected ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-indigo-500/20' : 'border-[#1e2336] hover:border-[#2b334d]'
      }`}
    >
      {/* Target Input Handle on Left */}
      <Handle
        type="target"
        position={Position.Left}
        id="exec"
        style={{
          backgroundColor: '#ffffff',
          width: '18px',
          height: '18px',
          border: '3px solid #0d101a',
          left: '-9px',
          top: '50%',
          zIndex: 40,
        }}
        className="hover:scale-125 transition-transform cursor-crosshair shadow-lg"
      />

      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-[#1b2033] bg-[#121626] rounded-t-2xl space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Icons.Shield size={18} />
            </div>
            <span className="text-base font-bold text-gray-100 tracking-tight">Authentication Flow</span>
          </div>
          <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-rose-400 transition-colors">
            <Icons.MoreHorizontal size={18} />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 pl-11">Handles user login with email verification and data storage</p>
      </div>

      {/* Body Section */}
      <div className="p-5 space-y-4 text-xs font-sans">
        {/* Mode Dropdown */}
        <select
          value={authMode}
          onChange={(e) => setAuthMode(e.target.value)}
          className="w-full bg-[#161a29] border border-[#242b44] rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-indigo-500 text-xs font-mono cursor-pointer"
        >
          <option value="login">login</option>
          <option value="signup">signup</option>
          <option value="logout">logout</option>
        </select>

        {/* 2 Column Inner Content */}
        <div className="grid grid-cols-2 gap-5">
          {/* Left Column: Input Card */}
          <div className="bg-[#121524] border border-[#1e2338] rounded-2xl p-4 space-y-3">
            <span className="font-bold text-gray-300 text-[11px]">Input</span>

            <div className="space-y-2">
              <div className="relative flex items-center">
                <Icons.Mail size={13} className="absolute left-3 text-gray-500" />
                <input
                  type="text"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  className="w-full bg-[#181c2d] border border-[#272e48] rounded-xl pl-8 pr-3 py-2 text-gray-200 outline-none text-xs font-mono"
                />
              </div>

              <div className="relative flex items-center">
                <Icons.Lock size={13} className="absolute left-3 text-gray-500" />
                <input
                  type="text"
                  value={passVal}
                  onChange={(e) => setPassVal(e.target.value)}
                  className="w-full bg-[#181c2d] border border-[#272e48] rounded-xl pl-8 pr-3 py-2 text-gray-200 outline-none text-xs font-mono"
                />
              </div>

              <div className="relative flex items-center">
                <Icons.Lock size={13} className="absolute left-3 text-gray-500" />
                <input
                  type="text"
                  value={confirmPassVal}
                  onChange={(e) => setConfirmPassVal(e.target.value)}
                  className="w-full bg-[#181c2d] border border-[#272e48] rounded-xl pl-8 pr-3 py-2 text-gray-200 outline-none text-xs font-mono text-gray-400"
                />
              </div>
            </div>

            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer">
              <span>Execute</span>
              <Icons.Play size={13} className="fill-white" />
            </button>
          </div>

          {/* Right Column: Toggle Switches & Output Handles */}
          <div className="space-y-4 py-1">
            <div className="flex items-center justify-between relative">
              <span className="text-[11px] text-gray-300">Ask for email verification?</span>
              <button
                onClick={() => setAskVerification(!askVerification)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${askVerification ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${askVerification ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <Handle
                type="source"
                position={Position.Right}
                id="verify"
                style={{
                  backgroundColor: '#ffffff',
                  width: '14px',
                  height: '14px',
                  border: '2.5px solid #0d101a',
                  right: '-24px',
                  top: '50%',
                }}
              />
            </div>

            <div className="flex items-center justify-between relative">
              <span className="text-[11px] text-gray-300">Store on database?</span>
              <button
                onClick={() => setStoreOnDb(!storeOnDb)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${storeOnDb ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${storeOnDb ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <Handle
                type="source"
                position={Position.Right}
                id="db"
                style={{
                  backgroundColor: '#ffffff',
                  width: '14px',
                  height: '14px',
                  border: '2.5px solid #0d101a',
                  right: '-24px',
                  top: '50%',
                }}
              />
            </div>

            <div className="flex items-center justify-between relative">
              <span className="text-[11px] text-gray-300">Store on local variable?</span>
              <button
                onClick={() => setStoreLocalVar(!storeLocalVar)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${storeLocalVar ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${storeLocalVar ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <Handle
                type="source"
                position={Position.Right}
                id="localvar"
                style={{
                  backgroundColor: '#ffffff',
                  width: '14px',
                  height: '14px',
                  border: '2.5px solid #0d101a',
                  right: '-24px',
                  top: '50%',
                }}
              />
            </div>

            <div className="flex items-center justify-between relative pt-1">
              <span className="text-[11px] text-gray-300">Next Page</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Icons.Eye size={15} />
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id="nextpage"
                style={{
                  backgroundColor: '#ffffff',
                  width: '14px',
                  height: '14px',
                  border: '2.5px solid #0d101a',
                  right: '-24px',
                  top: '50%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 3. START NODE COMPONENT ====================
const StartNodeView: React.FC<{ id: string; selected: boolean }> = ({ id, selected }) => {
  const { setSelectedNodeId, syncFromGraph } = useLogicStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    graphManager.deleteNode(id);
    syncFromGraph();
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`relative w-[280px] rounded-2xl bg-[#0e1017] text-gray-100 shadow-2xl border transition-all duration-200 select-none ${
        selected ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-amber-500/20' : 'border-[#1f2434] hover:border-[#2b3248]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c2132] bg-[#131622] rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Icons.Zap size={16} />
          </div>
          <span className="text-sm font-bold text-gray-100 tracking-tight">Start</span>
        </div>
        <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-rose-400 transition-colors">
          <Icons.MoreHorizontal size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3 text-xs font-sans">
        <p className="text-[11px] text-gray-400">Entry point of the flow</p>
        <div className="px-3 py-1.5 rounded-xl bg-[#161a28] border border-[#252c42] text-amber-400 font-mono text-[10px] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Active Root Trigger</span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="exec"
        style={{
          backgroundColor: '#ffffff',
          width: '18px',
          height: '18px',
          border: '3px solid #0e1017',
          right: '-9px',
          top: '50%',
          zIndex: 40,
        }}
        className="hover:scale-125 transition-transform cursor-crosshair shadow-lg"
      />
    </div>
  );
};

// ==================== MAIN CUSTOM LOGIC NODE DISPATCHER ====================
export const CustomLogicNode: React.FC<NodeProps> = memo(({ id, data, selected }) => {
  const nodeData = data as unknown as LogicNodePropsData;
  const category = nodeData.category?.toLowerCase() || '';
  const type = nodeData.nodeType?.toLowerCase() || '';

  if (category === 'database' || type.includes('db')) {
    return <DatabaseNodeView id={id} nodeData={nodeData} selected={selected} />;
  }

  if (category === 'auth' || type.includes('user') || type.includes('auth')) {
    return <AuthNodeView id={id} nodeData={nodeData} selected={selected} />;
  }

  if (category === 'events' || type.includes('event') || type.includes('start')) {
    return <StartNodeView id={id} selected={selected} />;
  }

  // General Fallback
  return <StartNodeView id={id} selected={selected} />;
});

CustomLogicNode.displayName = 'CustomLogicNode';
