import React from 'react'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'

import { useParams } from 'react-router'
import { Col, Row } from 'antd'
import { VideoPlayer } from './VideoPlayer'
import * as api from '../../api'
import { useQuery } from 'react-query'
import { Loading } from '../../components/common'
import { APIError } from '../../api/interfaces/apiError'
import { Materials } from '../material'
import styled from 'styled-components'

const Section = styled.section`
  position: relative;
  /* background-color: #f2f2f2; */

  .material {
  }

  .chat {
    max-width: 400px;
    background-color: white;
  }
`

export const Appointment = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!/\d+/.test(id)) return <div>Invalid Appointment ID</div>

  const getAppointment = () => api.appointments.getAppointment(Number(id))
  const {
    data: appointment,
    isLoading,
    error,
  } = useQuery(`appointment/${id}`, getAppointment)

  if (error) return <div>{(error as APIError).message}</div>

  if (isLoading || !appointment) return <Loading />

  const role = store.userStore.user?.role

  return (
    <Section className="section">
      <header>Appointment {id}</header>
      <main>
        <Row wrap={false} gutter={[20, 20]}>
          <Col flex="auto" className="material">
            <Materials />
          </Col>

          <Col className="chat" flex="400px">
            <VideoPlayer id={Number(id)} />
          </Col>
        </Row>
      </main>
    </Section>
  )
})
