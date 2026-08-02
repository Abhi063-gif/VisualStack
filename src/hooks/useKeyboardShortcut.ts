import { useEffect } from 'react';

export function useKeyboardShortcut(keyCombo: string, handler: (e: KeyboardEvent) => void): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const keys = keyCombo.toLowerCase().split('+');
      const matchCtrl = keys.includes('ctrl') ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
      const matchShift = keys.includes('shift') ? e.shiftKey : !e.shiftKey;
      const matchKey = keys[keys.length - 1] === e.key.toLowerCase();

      if (matchCtrl && matchShift && matchKey) {
        e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyCombo, handler]);
}
