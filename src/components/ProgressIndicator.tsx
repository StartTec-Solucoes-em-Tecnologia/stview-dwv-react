import * as Progress from '@radix-ui/react-progress'

interface ProgressIndicatorProps {
  progress: number
}

export function ProgressIndicator ({ progress }: ProgressIndicatorProps) {
  return (
    <Progress.Root
      value={progress}
      className="relative overflow-hidden bg-zinc-900 border border-zinc-200 rounded-full w-80 h-6"
    >
      <Progress.Indicator
        className="w-full h-full bg-brand-600 transition-transform"
        style={{
          transform: `translateX(-${100 - progress}%)`
        }}
      />
    </Progress.Root>
  )
}
