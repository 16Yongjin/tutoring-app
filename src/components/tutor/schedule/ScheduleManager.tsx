import { useMemo } from 'react'
import { Card, Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { Schedule, Tutor } from '../../../api/tutors/entity'
import dayjs from 'dayjs'
import { timeIndeces, timetable } from '../../../data/timetable'
import { ScheduleButton } from './ScheduleButton'
import * as api from '../../../api'
import { useQueryClient } from 'react-query'
const { Title } = Typography

const Container = styled.div`
  content-visibility: auto;

  .timetable {
    position: relative;

    &-wrapper {
      margin-top: 1rem;
      position: relative;

      & > div {
        padding: 0;
      }
    }
  }

  .timetile {
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
    height: 2.5rem;

    &-header {
      height: 3rem;
      position: sticky !important;
      top: 0;
      z-index: 999;
      background: white;
    }
  }

  .timeline {
    background-color: #fafafa;
  }
`

export const ScheduleManager = ({ tutor }: { tutor: Tutor }) => {
  const queryClient = useQueryClient()
  const onAddSchedule = async (dateStr: string) => {
    await api.tutors.addSchedules({
      tutorId: tutor.id,
      schedule: dayjs(dateStr).toDate(),
    })
    queryClient.invalidateQueries(`tutor/${tutor.id}`)
  }
  const onRemoveSchedule = async (schedule: Schedule) => {
    await api.tutors.removeSchedules({
      tutorId: tutor.id,
      schedule: new Date(schedule.startTime),
    })
    queryClient.invalidateQueries(`tutor/${tutor.id}`)
  }

  const dateToKey = (date: string) => dayjs(date).format('YYYY. MM. DD. HH:mm')

  const scheduleMap = useMemo(() => {
    return tutor.schedules.reduce((acc, v) => {
      acc[dateToKey(v.startTime)] = v
      return acc
    }, {} as Record<string, Schedule>)
  }, [tutor.schedules])

  const dates = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6].map((d) =>
        dayjs().add(d, 'day').format('YYYY. MM. DD.')
      ),
    []
  )

  return (
    <Container className="mt-8">
      <header>
        <Title level={3}>스케쥴 관리</Title>
      </header>

      <main>
        <Card type="inner" className="timetable-wrapper">
          <Row className="timetable">
            <Col xs={3} className="timeline">
              <Row className="timetile timetile-header center"></Row>
              {timetable.map((time) => (
                <Row key={time} className="timetile center">
                  {time}
                </Row>
              ))}
            </Col>
            {dates.map((date) => (
              <Col key={date} xs={3}>
                <Row className="timetile timetile-header center">
                  {dayjs(date).format('MM. DD. ddd')}
                </Row>
                {timeIndeces.map((timeIdx) => {
                  const dateStr = `${date} ${timetable[timeIdx]}`
                  return (
                    <Row key={timeIdx} className="timetile center">
                      <ScheduleButton
                        dateStr={dateStr}
                        schedule={scheduleMap[dateStr]}
                        onAddSchedule={onAddSchedule}
                        onRemoveSchedule={onRemoveSchedule}
                      />
                    </Row>
                  )
                })}
              </Col>
            ))}
          </Row>
        </Card>
      </main>
    </Container>
  )
}
