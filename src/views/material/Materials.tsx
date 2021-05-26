import React from 'react'
import { observer } from 'mobx-react-lite'
import { Role } from '../../api/auth/entity'
import { MaterialSection } from '../../components/home/MaterialSection'
import { store } from '../../store'
import { AdminMaterials } from '../admin'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #f2f2f2;
  min-height: calc(100vh - 64px);
`

export const Materials = observer(({ urlPrefix }: { urlPrefix?: string }) => {
  const role = store.userStore.user?.role
  if (role === Role.ADMIN) return <AdminMaterials />

  return (
    <Container>
      <MaterialSection urlPrefix={urlPrefix || ''} />
    </Container>
  )
})
