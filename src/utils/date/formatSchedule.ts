import dayjs from 'dayjs'

export const formatSchedule = ({
  startTime,
  endTime,
}: {
  startTime: string
  endTime: string
}) =>
  `${dayjs(startTime).format('YYYY. MM. DD. dddd hh:mm')} ~ ${dayjs(
    endTime
  ).format('hh:mm')}`
