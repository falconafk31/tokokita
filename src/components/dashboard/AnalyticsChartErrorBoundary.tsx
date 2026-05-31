'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class AnalyticsChartErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AnalyticsChart Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[300px] flex flex-col items-center justify-center text-[#EE4D2D] text-[13px] font-bold bg-[#fff1f0] rounded-xl border border-[#FFD6C8]">
          <span className="text-[24px] mb-2">⚠️</span>
          Gagal memuat grafik analitik.
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-1.5 bg-white border border-[#FFD6C8] rounded-lg text-[#EE4D2D] hover:bg-gray-50 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
