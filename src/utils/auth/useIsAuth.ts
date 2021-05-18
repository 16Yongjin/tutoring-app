import { useState } from 'react'
import { useHistory } from 'react-router'
import { store } from '../../store'

export const useIsAuth = () => {
  const [userStore] = useState(store.userStore)
  const history = useHistory()
  if (!userStore.user) {
    history.replace(`/login?next=${history.location.pathname}`)
  }
}
