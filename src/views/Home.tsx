import React from 'react'
import { observer } from 'mobx-react-lite'
import { MainSection } from '../components/home/MainSection'
import { MaterialSection } from '../components/home/MaterialSection'
import { store } from '../store'
import { AdminDashboard } from './admin'
import { Dashboard } from './user'
import { Role } from '../api/auth/entity'

export const Home = observer(() => {
  const role = store.userStore.user?.role
  if (role === Role.ADMIN) return <AdminDashboard />
  if (role === Role.USER) return <Dashboard />
  if (role === Role.TUTOR) return <Dashboard />

  return (
    <>
      <MainSection />
      <MaterialSection />
    </>
  )
})
