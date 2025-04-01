import { RelativeTarget } from "@prisma/client"
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { RELATIVE_TARGETS_UI_ENUM } from "@/lib/constants"

export default function RelativeTargetSelect({
  selected,
  onSelect,
}: {
  selected: RelativeTarget
  onSelect: (selected: RelativeTarget) => void
}) {
  const [innerSelected, setInnerSelected] = useState<RelativeTarget | null>(null)

  useEffect(() => {
    setInnerSelected(selected)
  }, [selected])

  const handleSelect = (target: RelativeTarget) => {
    setInnerSelected(target)
    onSelect(target)
  }

  const options = Object.entries(RELATIVE_TARGETS_UI_ENUM).map(([key, value]) => ({
    id: key,
    ...value,
  }))
  const baseClassName = twMerge(
    "border text-sm rounded-full h-[20px] min-w-[60px] px-2 flex items-center justify-center outline-neutral-500"
  )
  const selectedClassName = RELATIVE_TARGETS_UI_ENUM[innerSelected ?? "NONE"].className

  return (
    <Select
      aria-label="Select Target"
      selectedKey={innerSelected}
      onSelectionChange={(id) => handleSelect(id as RelativeTarget)}
    >
      <Button className={twMerge(baseClassName, selectedClassName, "px-3")}>
        <SelectValue className={"text-sm"} />
      </Button>
      <Popover
        placement="bottom left"
        offset={2}
        className="bg-canvas/50 flex flex-col gap-2 rounded-lg border p-2 backdrop-blur-lg"
      >
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          Next time in focus...
        </div>
        <ListBox className="grid grid-cols-2 gap-2">
          {options.map((option) => {
            const isSelected = selected === option.id
            return (
              <ListBoxItem
                key={option.id}
                id={option.id}
                className={twMerge(
                  baseClassName,
                  option.className,
                  "h-fit cursor-pointer border py-1 hover:opacity-60",
                  isSelected ? "ring-2 ring-neutral-300 ring-offset-1" : null
                )}
              >
                {option.label}
              </ListBoxItem>
            )
          })}
        </ListBox>
      </Popover>
    </Select>
  )
}
