import React, { useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Descriptions, Row, Typography } from 'antd'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { Gender } from '../../api/auth/entity'
import { Schedule, TutorInfo } from '../../api/tutors/entity'
import {
  ReserveButton,
  ReserveModal,
  ReviewCard,
  Timetable,
  TutorPreviewCard,
  TutorProfile,
  YoutubeModal,
} from '../../components/tutor'
import { StarFilled, YoutubeOutlined } from '@ant-design/icons'
import { LiteYoutubeEmbed } from 'react-lite-yt-embed'
import Modal from 'antd/lib/modal/Modal'
import dayjs, { Dayjs } from 'dayjs'
import { timeIndeces, timetable } from '../../data/timetable'

const { Title, Text } = Typography

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

export const Tutor = () => {
  const { id } = useParams<{ id: string }>()

  const tutor: TutorInfo = {
    id: 1,
    fullname: 'Hello',
    country: 'Korea',
    username: 'hi',
    email: 'hello@world.com',
    gender: Gender.MALE,
    image: 'https://via.placeholder.com/350',
    language: 'en',
    presentation:
      'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
    schedules: [
      {
        id: 0,
        startTime: dayjs()
          .subtract(1, 'hours')
          .set('minutes', 30)
          .set('seconds', 0),
        endTime: dayjs()
          .subtract(1, 'hours')
          .set('minutes', 55)
          .set('seconds', 0),
        reserved: false,
        closed: true,
      },
      {
        id: 1,
        startTime: dayjs().add(1, 'hours').set('minutes', 30).set('seconds', 0),
        endTime: dayjs().add(1, 'hours').set('minutes', 55).set('seconds', 0),
        reserved: false,
        closed: false,
      },
      {
        id: 2,
        startTime: dayjs().add(2, 'hours').set('minutes', 30).set('seconds', 0),
        endTime: dayjs().add(2, 'hours').set('minutes', 55).set('seconds', 0),
        reserved: false,
        closed: false,
      },
      {
        id: 3,
        startTime: dayjs().add(3, 'hours').set('minutes', 30).set('seconds', 0),
        endTime: dayjs().add(3, 'hours').set('minutes', 55).set('seconds', 0),
        reserved: false,
        closed: false,
      },
      {
        id: 3,
        startTime: dayjs().add(4, 'day').set('minutes', 30).set('seconds', 0),
        endTime: dayjs().add(4, 'day').set('minutes', 55).set('seconds', 0),
        reserved: false,
        closed: false,
      },
    ],
  }

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

  const dateToKey = (date: Date | Dayjs) =>
    dayjs(date).format('MM. DD. ddd_HH:mm')

  const scheduleMap = useMemo(() => {
    return tutor.schedules.reduce((acc, v) => {
      acc[dateToKey(v.startTime)] = v
      return acc
    }, {} as Record<string, Schedule>)
  }, [tutor.schedules])

  const dates = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6].map((d) =>
        dayjs().add(d, 'day').format('MM. DD. ddd')
      ),
    []
  )

  return (
    <Section className="section">
      <div className="container">
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

                <Descriptions column={1} bordered style={{ marginTop: '1rem' }}>
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
      </div>
    </Section>
  )
}
