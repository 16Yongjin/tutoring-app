import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'

import { Route, Switch, useHistory, useLocation, useParams } from 'react-router'
import { Button, Card, Col, Row } from 'antd'
import { VideoPlayer } from './VideoPlayer'
import * as api from '../../api'
import { useQuery } from 'react-query'
import { Loading } from '../../components/common'
import { APIError } from '../../api/interfaces/apiError'
import { UserCourseDetail, UserMaterialDetail } from '../material'
import styled from 'styled-components'
import { MaterialSection } from '../../components/home/MaterialSection'
import { Link } from 'react-router-dom'
import { SocketContext } from '../../socket/SocketContext'
import { Chat } from './Chat'
import { useIsAuth } from '../../utils/auth/useIsAuth'
import { Role } from '../../api/auth/entity'

const Section = styled.section`
  position: relative;
  background-color: #f2f2f2;
  min-height: calc(100vh);

  .grid-container {
    min-height: 100vh;
    display: grid;
    grid-template-areas:
      'materials-header video-player'
      'materials video-player'
      'materials chat';
    grid-template-columns: 3fr 480px;
    grid-template-rows: 64px 206px 3fr;
  }

  .materials {
    grid-area: materials;
    overflow-y: auto;
    max-height: 100vh;

    & .section {
      padding: 0;
      padding-right: 1rem;
    }

    &-header {
      grid-area: materials-header;

      .link-title {
        color: black;
        font-family: 'Godo';
        font-size: 1.5rem;
      }

      .ant-card-body {
        padding: 0.5rem 1.5rem;
      }
      margin-bottom: 0.5rem;
    }
  }

  .video-player {
    grid-area: video-player;
  }

  .chat {
    grid-area: chat;
    background-color: white;
    max-height: calc(100vh - 270px);
  }
`

export const Appointment = observer(() => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const history = useHistory()
  const { pathname, hash } = useLocation()
  const { urlChange, currentLocation } = useContext(SocketContext)
  const urlPrefix = `/appointments/${appointmentId}`

  const role = store.userStore.user?.role
  const isTutor = role === Role.TUTOR

  useEffect(() => {
    if (!pathname.startsWith(urlPrefix)) return

    urlChange({ roomId: appointmentId, pathname, hash, url: pathname + hash })
    console.log(pathname)
  }, [pathname, hash])

  useEffect(() => {
    console.log('currentLocation changed', currentLocation)
    if (!currentLocation) return
    if (!currentLocation.url.startsWith(urlPrefix)) return
    if (currentLocation.url === pathname + hash) return

    history.replace(currentLocation.url)

    if (currentLocation.hash)
      setTimeout(() =>
        document.querySelector(currentLocation.hash)?.scrollIntoView()
      )
    else window.scrollTo(0, 0)
  }, [currentLocation?.url])

  if (!/\d+/.test(appointmentId)) return <div>Invalid Appointment ID</div>

  const getAppointment = () =>
    api.appointments.getAppointment(Number(appointmentId))
  const {
    data: appointment,
    isLoading,
    error,
  } = useQuery(`appointment/${appointmentId}`, getAppointment)

  if (error) return <div>{(error as APIError).message}</div>

  if (isLoading || !appointment) return <Loading />

  return (
    <Switch>
      <Section>
        <main className="grid-container scrollbar">
          <header className="materials-header">
            <Card>
              <nav className="nav">
                <Link className="link" to={`${urlPrefix}/materials`}>
                  <span className="link-title">Materials</span>
                </Link>
              </nav>
            </Card>
          </header>
          <div className="materials">
            <Route exact path={`${urlPrefix}/materials/courses/:courseId`}>
              <UserCourseDetail urlPrefix={urlPrefix} />
            </Route>

            <Route
              exact
              path="/appointments/:appintmentId/materials/:materialId"
            >
              <UserMaterialDetail urlPrefix={urlPrefix} />
            </Route>

            <Route exact path={urlPrefix}>
              <MaterialSection urlPrefix={urlPrefix} />
            </Route>
            <Route exact path={`${urlPrefix}/materials`}>
              <MaterialSection urlPrefix={urlPrefix} />
            </Route>
          </div>

          <div className="video-player">
            <VideoPlayer id={Number(appointmentId)} />
          </div>
          <div className="chat">
            <Chat
              roomId={appointmentId}
              username={
                isTutor ? appointment.tutor.fullname : appointment.user.fullname
              }
            />
          </div>
        </main>
      </Section>
    </Switch>
  )
})
