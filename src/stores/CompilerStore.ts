import { create } from 'zustand';
import type { CompilerState } from './interfaces/storeInterfaces';

export const useCompilerStore = create<CompilerState>(() => ({
  isCompiling: false,
  lastCompileTime: null,
  compileErrors: [],
}));
