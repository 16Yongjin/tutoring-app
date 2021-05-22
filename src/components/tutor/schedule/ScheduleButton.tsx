import React from 'react'
import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import { Schedule } from '../../../api/tutors/entity'
import { Link } from 'react-router-dom'

export const ScheduleButton = ({
  schedule,
  dateStr,
  onAddSchedule,
  onRemoveSchedule,
}: {
  schedule?: Schedule
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
      <Link to={`/appointments/${schedule.appointmentId}`}>
        <Button
          className="success-btn"
          type="primary"
          shape="round"
          size="small"
          icon={<CheckOutlined />}
        />
      </Link>
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
