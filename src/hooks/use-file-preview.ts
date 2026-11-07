"use client";
import { useCallback, useEffect, useState } from "react";
export function useFilePreview(): [File | null, string, (file: File | null) => void] {
  const [state, setState] = useState<{ file: File | null; preview: string }>({ file: null, preview: "" });
  useEffect(() => () => { if (state.preview) URL.revokeObjectURL(state.preview); }, [state.preview]);
  const change = useCallback((file: File | null) => setState({ file, preview: file ? URL.createObjectURL(file) : "" }), []);
  return [state.file, state.preview, change];
}
