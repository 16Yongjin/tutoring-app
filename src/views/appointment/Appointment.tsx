import { useContext, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'

import { Route, Switch, useHistory, useLocation, useParams } from 'react-router'
import { Badge, Card } from 'antd'
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
import { Role } from '../../api/auth/entity'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import { AppointmentControl } from './AppointmentControl'

const Section = styled.section`
  position: relative;
  background-color: #f2f2f2;
  min-height: calc(100vh);

  .grid-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-areas:
      'materials-header video-player'
      'materials video-player'
      'materials appointment-control'
      'materials chat';
    grid-template-columns: 3fr 400px;
    grid-template-rows: 56px 169px 54px auto;
  }

  @media screen and (max-width: 576px) {
  }

  .materials {
    grid-area: materials;
    overflow-y: auto;
    max-height: 100vh;

    & .section {
      padding: 1rem 1rem;
      min-height: unset;
    }

    &-header {
      height: 56px;
      grid-area: materials-header;
      z-index: 999;

      .link-title {
        color: black;
        font-family: 'Godo';
        font-size: 1.5rem;
      }

      .ant-card-body {
        padding: 0.5rem 1.5rem;
        /* box-shadow: 0 2px 2px -2px #d4d4d4; */
      }
      margin-bottom: 0.5rem;
    }
  }

  .header {
    &-actions {
      display: flex;
      height: 39px;
    }

    &-action {
      text-align: center;
      width: 100%;
      margin-bottom: 3px;
      font-weight: 500;

      &.active {
        border-bottom: 3px solid #1890ff;
      }
    }
  }

  .video-player {
    grid-area: video-player;
  }

  .appointment-control {
    height: 54px;
    grid-area: appointment-control;
  }

  .chat {
    grid-area: chat;
    background-color: white;
    height: 100%;
    max-height: calc(100vh - 225px - 42px);
  }

  @media screen and (max-width: 768px) {
    .grid-container {
      height: calc(100vh - 84px);
      overflow-y: auto;

      grid-template-areas:
        'video-player'
        'appointment-control'
        'materials';
      grid-template-columns: auto;
      grid-template-rows: 225px auto;
    }

    .video-player {
      height: 225px;
    }

    .appointment-control {
      position: sticky;
      top: -1px;
    }

    .chat {
      max-height: calc(100vh - 84px - 225px - 54px);
    }

    .materials-header {
      height: 84px;
      position: static;
      top: 0;
      width: 100%;
      margin-bottom: 0;
      z-index: 999;

      .nav {
        padding: 0.5rem 1rem;
      }

      .link-title {
        font-size: 1rem;
      }

      .ant-card-body {
        padding: 0;
      }
    }

    .materials-tab {
      .materials {
        overflow-y: unset;
        max-height: unset;
      }

      .chat {
        display: none;
      }
    }

    .chatting-tab {
      &.grid-container {
        grid-template-areas:
          'video-player'
          'appointment-control'
          'chat';
      }

      .materials {
        position: absolute;
        display: none;
      }

      .chat {
      }
    }
  }
`

const MobileAppoinmentHeader = ({
  show,
  tab,
  setTab,
  urlPrefix,
  showNewChatBadge,
}: {
  show: boolean
  tab: string
  setTab: (v: string) => void
  urlPrefix: string
  showNewChatBadge: boolean
}) => {
  return show ? (
    <header className="materials-header">
      <Card>
        <nav className="nav">
          <Link
            className="link"
            to={`${urlPrefix}/materials`}
            onClick={() => setTab('materials-tab')}
          >
            <span className="link-title">Materials</span>
          </Link>
        </nav>
      </Card>
      <Card>
        <div className="header-actions click">
          <div
            className={`header-action center ${
              tab === 'materials-tab' ? 'active' : ''
            }`}
            onClick={() => setTab('materials-tab')}
          >
            Materials
          </div>
          <div
            className={`header-action center ${
              tab === 'chatting-tab' ? 'active' : ''
            }`}
            onClick={() => setTab('chatting-tab')}
          >
            <Badge dot={showNewChatBadge}>Chatting</Badge>
          </div>
        </div>
      </Card>
    </header>
  ) : null
}

const PCAppointmentHeader = ({
  show,
  urlPrefix,
}: {
  show: boolean
  urlPrefix: string
}) => {
  return show ? (
    <header className="materials-header">
      <Card>
        <nav className="nav">
          <Link className="link" to={`${urlPrefix}/materials`}>
            <span className="link-title">Materials</span>
          </Link>
        </nav>
      </Card>
    </header>
  ) : null
}

export const Appointment = observer(() => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const history = useHistory()
  const { pathname, hash } = useLocation()
  const { urlChange, currentLocation } = useContext(SocketContext)
  const urlPrefix = `/appointments/${appointmentId}`
  const [tab, setTab] = useState('materials-tab')
  const { md } = useBreakpoint()
  const [hasNewChatting, setHasNewChatting] = useState(false)
  const showNewChatBadge = useMemo(
    () => tab !== 'chatting-tab' && hasNewChatting,
    [tab, hasNewChatting]
  )

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

  useEffect(() => {
    if (md || (hasNewChatting && tab === 'chatting-tab'))
      setHasNewChatting(false)
  }, [md, tab, hasNewChatting])

  if (!/\d+/.test(appointmentId)) return <div>Invalid Appointment ID</div>

  const getAppointment = () =>
    api.appointments.getAppointment(Number(appointmentId))

  const {
    error,
    isLoading,
    data: appointment,
  } = useQuery(`appointment/${appointmentId}`, getAppointment, { retry: 0 })

  if (error) return <div>{(error as APIError).message}</div>

  if (isLoading || !appointment) return <Loading />

  return (
    <Switch>
      <Section className={md ? 'scrollbar' : ''}>
        <MobileAppoinmentHeader
          show={!md}
          tab={tab}
          setTab={setTab}
          urlPrefix={urlPrefix}
          showNewChatBadge={showNewChatBadge}
        />

        <main className={`grid-container ${tab}`}>
          <PCAppointmentHeader show={!!md} urlPrefix={urlPrefix} />

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
            <VideoPlayer id={appointmentId} appointment={appointment} />
          </div>

          <div className="appointment-control">
            <AppointmentControl appointment={appointment} isTutor={isTutor} />
          </div>

          <div className="chat">
            <Chat
              appointment={appointment}
              roomId={appointmentId}
              username={
                isTutor ? appointment.tutor.fullname : appointment.user.fullname
              }
              isTutor={isTutor}
              setHasNewChatting={setHasNewChatting}
            />
          </div>
        </main>
      </Section>
    </Switch>
  )
})
