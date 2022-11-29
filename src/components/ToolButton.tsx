import { PropsWithChildren } from 'react'

interface ToolButtonProps extends PropsWithChildren {
  tool: string
  toolShape?: string
  isSelected: boolean
  onSelectTool: () => void
  tooltip: string
}

export function ToolButton ({ children, tool, toolShape, isSelected, onSelectTool, tooltip }: ToolButtonProps) {
  return (
    <button
      className="bg-brand-600 hover:bg-brand-500 disabled:bg-brand-900 border disabled:border-brand-900 px-2 py-2 rounded text-2xl text-zinc-100"
      title={tooltip}
      onClick={onSelectTool}
      disabled={isSelected}
    >
      {children}
    </button>
  )
}
