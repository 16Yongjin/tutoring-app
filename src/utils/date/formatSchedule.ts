import dayjs from 'dayjs'

export const formatSchedule = ({
  startTime,
  endTime,
}: {
  startTime: string
  endTime: string
}) =>
  `${dayjs(startTime).format('YYYY. MM. DD. dddd HH:mm')} ~ ${dayjs(
    endTime
  ).format('HH:mm')}`

export const formatDateFull = (time: string) =>
  dayjs(time).format('M. DD. ddd h:mm a')

export const formatDateWithSlash = (time: string) =>
  dayjs(time).format('YYYY/MM/DD/ddd')

export const formatTimeRange = ({
  startTime,
  endTime,
}: {
  startTime: string
  endTime: string
}) => `${dayjs(startTime).format('HH:mm')} ~ ${dayjs(endTime).format('HH:mm')}`
