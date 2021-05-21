import { useMemo, useState } from 'react'
import { Card, Col, Descriptions, Row, Spin } from 'antd'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { Gender } from '../../api/auth/entity'
import { Schedule, Tutor } from '../../api/tutors/entity'
import {
  ReserveModal,
  ReviewCard,
  Timetable,
  YoutubeModal,
} from '../../components/tutor'
import { YoutubeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import * as api from '../../api'
import { useQuery } from 'react-query'

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

export const TutorDetail = () => {
  const { id } = useParams<{ id: string }>()
  const getTutor = () => api.tutors.getTutor(Number(id))
  const { data: tutor } = useQuery(`tutor/${id}`, getTutor)

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
  }

  return (
    <Section className="section">
      <div className="container">
        {!tutor ? (
          <Spin />
        ) : (
          <main>
            <Row gutter={[20, 20]}>
              <Col xs={24} md={10}>
                <Card style={{ position: 'sticky', top: '20px' }}>
                  <div
                    style={{
                      aspectRatio: '1 / 1',
                      backgroundImage: `url(${tutor.image})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                    onClick={() => setVideoVisible(true)}
                  >
                    <div className="play center click">
                      <YoutubeOutlined size={40} className="play-icon" />
                    </div>
                  </div>

                  <Descriptions
                    column={1}
                    bordered
                    style={{ marginTop: '1rem' }}
                  >
                    <Descriptions.Item label="Name">
                      {tutor.fullname}
                    </Descriptions.Item>
                    <Descriptions.Item label="Country">
                      {tutor.country}
                    </Descriptions.Item>
                    <Descriptions.Item label="Gender">
                      {tutor.gender}
                    </Descriptions.Item>
                    <Descriptions.Item label="Presentation">
                      {tutor.presentation}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} md={14}>
                <ReviewCard tutorId={tutor.id} />

                <Timetable schedules={tutor.schedules} onReserve={onReserve} />
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
}
