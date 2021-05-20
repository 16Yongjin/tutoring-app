import { Button } from 'antd'
import React from 'react'
import { Schedule } from '../../api/tutors/entity'

export const ReserveButton = ({
  schedule,
  onReserve,
}: {
  schedule?: Schedule
  onReserve: Function
}) => {
  if (!schedule) return <span></span>

  if (schedule.reserved) return <span>Reserved</span>

  if (schedule.closed) return <span>Closed</span>

  return (
    <Button
      onClick={() => onReserve(schedule)}
      type="primary"
      shape="round"
      size="small"
    >
      Reserve
    </Button>
  )
}
