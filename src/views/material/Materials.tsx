import React from 'react'
import { observer } from 'mobx-react-lite'
import { Role } from '../../api/auth/entity'
import { MaterialSection } from '../../components/home/MaterialSection'
import { store } from '../../store'
import { AdminMaterials } from '../admin'

export const Materials = observer(() => {
  const role = store.userStore.user?.role
  if (role === Role.ADMIN) return <AdminMaterials />

  return <MaterialSection />
})
