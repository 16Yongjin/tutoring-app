import { useMemo } from 'react'
import { Button, Card, Col, Row } from 'antd'
import styled from 'styled-components'
import { Schedule, Tutor } from '../../api/tutors/entity'
import { ReserveButton } from '../../components/tutor'
import dayjs from 'dayjs'
import { timeIndeces, timetable } from '../../data/timetable'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { Link } from 'react-router-dom'

const TimetableDiv = styled.div`
  content-visibility: auto;

  .timetable {
    min-width: 640px;

    &-wrapper {
      margin-top: 1rem;
      overflow-x: auto;

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
    }
  }

  .timeline {
    background-color: #fafafa;
  }

  .fake {
    filter: blur(4px);
    user-select: none;

    &.timetable {
      min-width: unset;
      overflow-x: hidden;
    }
  }

  .cta {
    h3 {
      color: white;
    }
  }
`

export const FakeTimetable = () => {
  const dates = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6].map((d) =>
        dayjs().add(d, 'day').format('MM. DD. ddd')
      ),
    []
  )
  return (
    <TimetableDiv>
      <Card type="inner" className="timetable-wrapper">
        <div className="cta abs-center">
          <Link to={`/login?next=${window.location.pathname}`}>
            <Button shape="round" type="primary">
              <h3>Login to view tutor's schedules</h3>
            </Button>
          </Link>
        </div>
        <Row className="fake timetable">
          <Col xs={3} className="timeline">
            <Row className="timetile timetile-header center">⠀</Row>
            {timetable.slice(0, 10).map((time) => (
              <Row key={time} className="timetile center">
                {time}
              </Row>
            ))}
          </Col>
          {dates.map((date) => (
            <Col key={date} xs={3}>
              <Row className="timetile timetile-header center">{date}</Row>
              {timeIndeces.slice(0, 10).map((timeIdx) => (
                <Row key={timeIdx} className="timetile center">
                  {timeIdx % 3 === 0 ? (
                    <Button type="primary">Reserve</Button>
                  ) : null}
                </Row>
              ))}
            </Col>
          ))}
        </Row>
      </Card>
    </TimetableDiv>
  )
}

const dateToKey = (date: string) => dayjs(date).format('MM. DD. ddd_HH:mm')

export const Timetable = ({
  tutor,
  onReserve,
}: {
  tutor: Tutor
  onReserve: Function
}) => {
  const getTutorSchedules = () => api.tutors.getTutorSchedules(tutor.id)
  const { data: schedules } = useQuery(
    `tutor/${tutor.id}/schedules`,
    getTutorSchedules
  )

  const scheduleMap = useMemo(() => {
    return (
      schedules?.reduce((acc, v) => {
        acc[dateToKey(v.startTime)] = v
        return acc
      }, {} as Record<string, Schedule>) || {}
    )
  }, [schedules])

  const dates = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6].map((d) =>
        dayjs().add(d, 'day').format('MM. DD. ddd')
      ),
    []
  )
  return (
    <TimetableDiv>
      <Card type="inner" className="timetable-wrapper">
        <Row className="timetable">
          <Col xs={3} className="timeline">
            <Row className="timetile timetile-header center">⠀</Row>
            {timetable.map((time) => (
              <Row key={time} className="timetile center">
                {time}
              </Row>
            ))}
          </Col>
          {dates.map((date) => (
            <Col key={date} xs={3}>
              <Row className="timetile timetile-header center">{date}</Row>
              {timeIndeces.map((timeIdx) => (
                <Row key={timeIdx} className="timetile center">
                  <ReserveButton
                    schedule={scheduleMap[`${date}_${timetable[timeIdx]}`]}
                    onReserve={onReserve}
                  />
                </Row>
              ))}
            </Col>
          ))}
        </Row>
      </Card>
    </TimetableDiv>
  )
}
