import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { Schedule } from '../../api/tutors/entity'

export const ReserveButton = ({
  schedule,
  onReserve,
}: {
  schedule?: Schedule
  onReserve: Function
}) => {
  if (!schedule) return <span></span>

  if (schedule.appointment)
    return (
      <Link to={`/appointments/${schedule.appointment.id}`}>
        <Button className="success-btn" shape="round" size="small">
          View
        </Button>
      </Link>
    )

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
