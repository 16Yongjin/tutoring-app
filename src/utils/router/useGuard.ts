import { useHistory } from 'react-router'
import { Role } from '../../api/auth/entity'
import { store } from '../../store'

export const useTutorGuard = () => {
  const history = useHistory()
  if (store.userStore.user?.role !== Role.TUTOR) {
    history.push(`/tutors/login?next=${window.location.pathname}`)
  }
}
