import { twMerge } from "tailwind-merge"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Link } from "react-aria-components"
import { useScheduleParams } from "@/lib/schedule-params"

export default function WeekNavigator() {
  const { currentWeekHref, nextWeekHref, prevWeekHref } = useScheduleParams()

  return (
    <div className={twMerge("flex items-center justify-between", "gap-4")}>
      <Link
        key={prevWeekHref}
        className="flex cursor-pointer items-center rounded-md text-neutral-600 hover:bg-neutral-200"
        href={prevWeekHref}
      >
        <ChevronLeftIcon size={20} />
      </Link>
      <Link
        href={currentWeekHref}
        className="hover:text-gold-500 flex cursor-pointer items-center rounded-md font-medium underline-offset-2
          hover:underline"
      >
        Today
      </Link>
      <Link
        key={nextWeekHref}
        className="flex cursor-pointer items-center rounded-md text-neutral-600 hover:bg-neutral-200"
        href={nextWeekHref}
      >
        <ChevronRightIcon size={20} />
      </Link>
    </div>
  )
}
