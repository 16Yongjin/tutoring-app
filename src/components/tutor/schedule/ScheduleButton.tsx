import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { Schedule } from '../../../api/tutors/entity'

export const ScheduleButton = ({
  schedule,
  dateStr,
  onAddSchedule,
  onRemoveSchedule,
  showReserved,
}: {
  schedule?: Schedule
  showReserved: Function
  onAddSchedule: Function
  onRemoveSchedule: Function
  dateStr: string
}) => {
  if (!schedule)
    return (
      <Button
        onClick={() => onAddSchedule(dateStr)}
        shape="round"
        size="small"
        icon={<PlusOutlined />}
      />
    )

  if (schedule.reserved)
    return (
      <Button
        onClick={() => showReserved(dateStr)}
        type="primary"
        shape="round"
        size="small"
        icon={<CheckOutlined />}
      />
    )

  if (schedule.closed)
    return (
      <Button
        onClick={() => onRemoveSchedule(schedule)}
        shape="round"
        size="small"
        style={{ color: 'orange', borderColor: 'orange' }}
        icon={<CloseOutlined />}
      ></Button>
    )

  return (
    <Button
      onClick={() => onRemoveSchedule(schedule)}
      type="primary"
      shape="round"
      size="small"
      icon={<MinusOutlined />}
    />
  )
}
