import { twMerge } from "tailwind-merge"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Link } from "react-aria-components"
import { useScheduleParams } from "./utilities"

export default function ScheduleNavigator() {
  const { currentWeekHref, nextWeekHref, prevWeekHref } = useScheduleParams()

  return (
    <div className={twMerge("flex items-stretch justify-between", "gap-4")}>
      <Link
        key={prevWeekHref}
        className="flex cursor-pointer items-center rounded-md text-neutral-600 hover:bg-neutral-200"
        href={prevWeekHref}
      >
        <ChevronLeftIcon size={16} />
      </Link>
      <Link
        href={currentWeekHref}
        className="flex cursor-pointer items-center rounded-md text-sm font-medium underline-offset-2 hover:underline"
      >
        Today
      </Link>
      <Link
        key={nextWeekHref}
        className="flex cursor-pointer items-center rounded-md text-neutral-600 hover:bg-neutral-200"
        href={nextWeekHref}
      >
        <ChevronRightIcon size={16} />
      </Link>
    </div>
  )
}
