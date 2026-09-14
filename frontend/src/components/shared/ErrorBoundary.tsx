'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Captured by Shivmax Error Boundary:', error, errorInfo);
    // Ready for Sentry / LogRocket:
    // if (typeof window !== 'undefined' && window.Sentry) Sentry.captureException(error);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#090d15] border border-white/[0.12] shadow-2xl space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#141a29] border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4af37] block">
                Sovereign Recovery Protocol
              </span>
              <h2 className="text-2xl font-serif font-light text-white">
                Experience Interrupted
              </h2>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                A temporary visual anomaly was encountered. The platform state has been safely isolated.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-black bg-gradient-to-r from-[#d4af37] to-[#fbf5b7] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
              <span>Restore Experience</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
