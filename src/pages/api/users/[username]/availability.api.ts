import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

dayjs.extend(utc)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date, timezoneOffset } = req.query

  if (!date || !timezoneOffset) {
    return res
      .status(400)
      .json({ message: 'date or timezoneOffset not provided' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'user does not exist' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from(
    { length: (endHour - startHour) * 2 },
    (_, index) => {
      const hour = startHour + Math.floor(index / 2)
      const minute = (index % 2) * 30

      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')

      return `${formattedHour}:${formattedMinute}`
    },
  )

  const timezoneOffsetInHours =
    typeof timezoneOffset === 'string'
      ? Number(timezoneOffset) / 60
      : Number(timezoneOffset[0]) / 60
  const referenceDateTimeZoneOffsetInHours =
    referenceDate.toDate().getTimezoneOffset() / 60

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate
          .set('hour', startHour)
          .add(timezoneOffsetInHours, 'hour')
          .toDate(),
        lte: referenceDate
          .set('hour', endHour)
          .add(timezoneOffsetInHours, 'hour')
          .toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some((blockedTime) => {
      const hourBlocked = blockedTime.date.getUTCHours() - timezoneOffsetInHours
      const minuteBlocked = blockedTime.date.getMinutes()
      return (
        `${hourBlocked.toString().padStart(2, '0')}:${minuteBlocked.toString().padStart(2, '0')}` ===
        time
      )
    })

    const [hours, minutes] = time.split(':').map(Number)
    const isTimeInPast = referenceDate
      .set('hour', Number(hours))
      .subtract(referenceDateTimeZoneOffsetInHours, 'hour')
      .set('minute', Number(minutes))
      .isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ possibleTimes, availableTimes })
}
