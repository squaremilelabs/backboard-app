import { add, parse, sub } from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { iconBox, interactive } from "@/styles/class-names"
import { getISOWeekDates, getISOWeekString } from "@/lib/utils-timeslot"
import { formatDate } from "@/lib/utils-common"

export default function CalendarNavigator() {
  const { iso_week: isoWeek } = useParams<{ iso_week: string }>()
  const weekDates = getISOWeekDates(isoWeek)
  const firstDate = parse(weekDates[0], "yyyy-MM-dd", new Date())
  const nextWeek = getISOWeekString(add(firstDate, { weeks: 1 }))
  const prevWeek = getISOWeekString(sub(firstDate, { weeks: 1 }))

  return (
    <div className="flex items-stretch rounded-lg border p-4">
      <Link
        href={`/calendar/${prevWeek}`}
        className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
      >
        <ChevronLeftIcon />
      </Link>
      <div className="flex grow items-center justify-center gap-8">
        <p className="font-medium">{isoWeek}</p>
        <span className="text-sm text-neutral-500">Week of {formatDate(firstDate)}</span>
      </div>
      <Link
        href={`/calendar/${nextWeek}`}
        className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
      >
        <ChevronRightIcon />
      </Link>
    </div>
  )
}
