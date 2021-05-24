import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'
import {
  ISocketContext,
  SocketContext,
  VideoContextProvider,
} from '../../socket/SocketContext'
import { useParams } from 'react-router'
import { Col, Row } from 'antd'
import { VideoPlayer } from './VideoPlayer'

export const Appointment = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!/\d+/.test(id)) return <div>Invalid Appointment ID</div>

  const role = store.userStore.user?.role

  return (
    <>
      <header>Appointment {id}</header>
      <main>
        <VideoPlayer />
      </main>
    </>
  )
})
