import * as RadixSelect from '@radix-ui/react-select'
import { MdArrowDownward, MdArrowDropDown, MdArrowUpward } from 'react-icons/md'

interface SelectProps {
  options: Array<{ label: string, value: string }>
  value?: string
  onChange?: (val: string) => void
  placeholder?: string
}

export function Select ({ options, value, onChange, placeholder }: SelectProps) {
  return (
    <RadixSelect.Root
      value={value}
      onValueChange={onChange}
    >
      <RadixSelect.Trigger className="bg-brand-600 hover:bg-brand-500 text-zinc-200 px-3 py-1 rounded flex justify-between gap-1">
        <RadixSelect.Value placeholder={placeholder} />

        <RadixSelect.Icon>
          <MdArrowDropDown size={24} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content className="overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-md shadow-lg">
          <RadixSelect.ScrollUpButton className="flex items-center justify-center h-6 bg-transparent text-brand-600 cursor-default">
            <MdArrowUpward size={24} />
          </RadixSelect.ScrollUpButton>

          <RadixSelect.Viewport className="p-1">
            {options.map(option => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="px-3 rounded text-brand-600 select-none"
              >
                <RadixSelect.ItemText>
                  {option.label}
                </RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex items-center justify-center h-6 bg-transparent text-brand-600 cursor-default">
            <MdArrowDownward size={24} />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
