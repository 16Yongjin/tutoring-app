import { useState } from 'react'
import { Col, Row } from 'antd'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { Schedule } from '../../api/tutors/entity'
import {
  FakeTimetable,
  ReserveModal,
  ReviewCard,
  Timetable,
  YoutubeModal,
} from '../../components/tutor'
import * as api from '../../api'
import { useQuery, useQueryClient } from 'react-query'
import { Loading } from '../../components/common/Loading'
import { TutorProfile } from '../../components/tutor'
import { store } from '../../store'
import { observer } from 'mobx-react-lite'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }

  .play {
    width: 100%;
    height: 100%;

    &-icon {
      font-size: 5rem;
      color: rgba(255, 255, 255, 0.6);
      transition: color 0.2s ease-in-out;

      &:hover {
        color: rgba(255, 255, 255, 1);
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

    &-timeline {
      background-color: #fafafa;
    }
  }
`

export const TutorDetail = observer(() => {
  const { tutorId } = useParams<{ tutorId: string }>()
  const getTutor = () => api.tutors.getTutor(Number(tutorId))
  const { data: tutor } = useQuery(`tutor/${tutorId}`, getTutor)
  const queryClient = useQueryClient()

  const [videoVisible, setVideoVisible] = useState(false)
  const [reserveModalVisible, setReserveModalVisible] = useState(false)
  const [scheduleToReserve, setScheduleToReserve] =
    useState<Schedule | null>(null)
  const onReserve = (schedule: Schedule) => {
    setScheduleToReserve(schedule)
    setReserveModalVisible(true)
  }

  const onCancelReserve = (updated?: boolean) => {
    setScheduleToReserve(null)
    setReserveModalVisible(false)
    if (updated)
      queryClient
        .invalidateQueries(`tutor/${tutor?.id}/schedules`)
        .then(console.log)
  }

  return (
    <Section className="section">
      <div className="container">
        {!tutor ? (
          <Loading />
        ) : (
          <main>
            <Row gutter={[20, 20]}>
              <Col xs={24} md={10}>
                <TutorProfile tutor={tutor} setVideoVisible={setVideoVisible} />
              </Col>

              <Col xs={24} md={14}>
                <ReviewCard tutor={tutor} />

                {store.userStore.user ? (
                  <Timetable tutor={tutor} onReserve={onReserve} />
                ) : (
                  <FakeTimetable />
                )}
              </Col>
            </Row>

            <YoutubeModal
              id={'6-LSMpXbGv0'}
              show={videoVisible}
              onCancel={() => setVideoVisible(false)}
            />

            <ReserveModal
              show={reserveModalVisible}
              tutor={tutor}
              schedule={scheduleToReserve}
              onCancel={onCancelReserve}
            />
          </main>
        )}
      </div>
    </Section>
  )
})
