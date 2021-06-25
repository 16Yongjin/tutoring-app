import React, { useMemo } from 'react'
import { Card, Col, Divider, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { Schedule, Tutor } from '../../api/tutors/entity'
import { StarFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import { ReserveButton } from './ReserveButton'
const { Title, Text } = Typography

const dateToKey = (date: string) => dayjs(date).format('HH:mm')

export const TutorSearchCard = ({
  tutor,
  timetable,
  onReserve,
}: {
  tutor: Tutor
  timetable: string[]
  onReserve: Function
}) => {
  const scheduleMap = useMemo(() => {
    return (
      tutor.schedules.reduce((acc, v) => {
        acc[dateToKey(v.startTime)] = v
        return acc
      }, {} as Record<string, Schedule>) || {}
    )
  }, [tutor])

  return (
    <Link to={`/tutors/${tutor.id}`}>
      <Card
        cover={
          <div
            className="cover-image"
            style={{ backgroundImage: `url(${tutor.image})` }}
          ></div>
        }
      >
        <Title level={3} style={{ marginBottom: 0 }}>
          {tutor.fullname}
        </Title>
        <Text>
          <span style={{ marginRight: '0.25rem', color: 'orange' }}>
            <StarFilled /> {tutor.rating}
          </span>
          <span>({tutor.reviewCount})</span>
        </Text>
        <Divider className="mb-2 mt-2" />

        {timetable.map((time) => (
          <Row key={time} justify="space-between" style={{ height: '1.75rem' }}>
            <Col>{time}</Col>
            <Col>
              <ReserveButton
                schedule={scheduleMap[time]}
                onReserve={onReserve}
              />
            </Col>
          </Row>
        ))}
      </Card>
    </Link>
  )
}
