export interface ValidationIR {
  id: string;
  targetField: string;
  rules: {
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'regex' | 'custom';
    params?: unknown;
    errorMessage: string;
  }[];
}
