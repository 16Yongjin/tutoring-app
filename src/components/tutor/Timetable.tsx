import React, { useMemo, useState } from 'react'
import { Alert, Card, Col, Descriptions, Row, Typography } from 'antd'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { Gender } from '../../api/auth/entity'
import { Schedule, TutorInfo } from '../../api/tutors/entity'
import {
  ReserveButton,
  ReviewCard,
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

const TimetableDiv = styled.div`
  content-visibility: auto;

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

export const Timetable = ({
  schedules,
  onReserve,
}: {
  schedules: Schedule[]
  onReserve: Function
}) => {
  const dateToKey = (date: Date | Dayjs) =>
    dayjs(date).format('MM. DD. ddd_HH:mm')

  const scheduleMap = useMemo(() => {
    return schedules.reduce((acc, v) => {
      acc[dateToKey(v.startTime)] = v
      return acc
    }, {} as Record<string, Schedule>)
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
      <Card
        type="inner"
        style={{
          marginTop: '1rem',
          overflowX: 'auto',
        }}
        bodyStyle={{ padding: '0' }}
      >
        <Row
          style={{
            minWidth: '640px',
          }}
        >
          <Col xs={3} className="timetile-timeline">
            <Row className="timetile timetile-header center">⠀</Row>
            {timetable.map((time) => (
              <Row key={time} className="timetile center">
                {time}
              </Row>
            ))}
          </Col>
          {dates.map((date) => (
            <Col key={date} xs={3}>
              <Row className="timetile timetile-header center ">{date}</Row>
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
