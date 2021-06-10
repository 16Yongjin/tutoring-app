import { Card, Col, Radio, Row } from 'antd'
import styled from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../api'
import { TutorSearchCard, ReserveModal } from '../../components/tutor'
import { Loading } from '../../components/common/Loading'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { timetable } from '../../data/timetable'
import { Schedule, Tutor } from '../../api/tutors/entity'

const Section = styled.section`
  position: relative;

  background-color: #f2f2f2;
  min-height: calc(100vh - 64px);

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }

  .main {
    margin-top: 1.5rem;
  }
`

export const TutorSearch = () => {
  const queryClient = useQueryClient()
  const [selectedDay, setSelectedDay] = useState(0)
  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, idx) =>
        dayjs().add(idx, 'day').format('DD (ddd)')
      ),
    []
  )

  const searchTutors = () =>
    api.tutors.searchTutors({
      startTime: dayjs().add(selectedDay, 'day').startOf('day').toISOString(),
      endTime: dayjs().add(selectedDay, 'day').endOf('day').toISOString(),
    })
  const { data: tutors, isLoading } = useQuery(
    `tutors/search/${selectedDay}`,
    searchTutors
  )

  const todaysTimetable = useMemo(() => {
    if (selectedDay === 0) {
      const time = dayjs().add(14, 'minutes').format('HH:mm')
      return timetable.filter((t) => t > time)
    }
    return timetable
  }, [selectedDay])

  const [reserveModalVisible, setReserveModalVisible] = useState(false)
  const [tutorToReserve, setTutorToReserve] = useState<Tutor | null>(null)
  const [scheduleToReserve, setScheduleToReserve] =
    useState<Schedule | null>(null)
  const onReserve = (tutor: Tutor, schedule: Schedule) => {
    setTutorToReserve(tutor)
    setScheduleToReserve(schedule)
    setReserveModalVisible(true)
  }

  const onCancelReserve = (updated?: boolean) => {
    setTutorToReserve(null)
    setScheduleToReserve(null)
    setReserveModalVisible(false)
    if (updated) queryClient.invalidateQueries(`tutors/search/${selectedDay}`)
  }

  return (
    <Section>
      <div className="container">
        <header>
          <Card>
            <Row className="center-y">
              <Col className="mr-4">
                <strong>Date</strong>
              </Col>
              <Col>
                <Radio.Group
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {days.map((day, idx) => (
                    <Radio.Button key={day} value={idx}>
                      {day}
                    </Radio.Button>
                  ))}
                </Radio.Group>
                <div></div>
              </Col>
            </Row>
          </Card>
        </header>

        <main className="main">
          {isLoading ? <Loading /> : null}

          {!tutors?.length && (
            <Card>
              There are no available appointments on{' '}
              {dayjs().add(selectedDay, 'day').format('YYYY. MM. DD. dddd')}
            </Card>
          )}

          <Row gutter={[16, 16]}>
            {tutors?.map((tutor) => (
              <Col key={tutor.id} xs={12} md={12} lg={8}>
                <TutorSearchCard
                  tutor={tutor}
                  timetable={todaysTimetable}
                  onReserve={(schedule: Schedule) => onReserve(tutor, schedule)}
                />
              </Col>
            ))}
          </Row>
        </main>

        {tutorToReserve && scheduleToReserve && (
          <ReserveModal
            show={reserveModalVisible}
            tutor={tutorToReserve}
            schedule={scheduleToReserve}
            onCancel={onCancelReserve}
          />
        )}
      </div>
    </Section>
  )
}
