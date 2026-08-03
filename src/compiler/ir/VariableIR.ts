export interface VariableIR {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  scope: 'global' | 'screen' | 'local';
  defaultValue: unknown;
  isConstant: boolean;
  isSecret: boolean;
}
