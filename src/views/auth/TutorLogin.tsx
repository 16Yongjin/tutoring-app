import { store } from '../../store'
import { Login } from './Login'

export const TutorLogin = () => {
  const login = store.userStore.tutorLogin.bind(store.userStore)
  return <Login title="Tutor Login" login={login} signupUrl="/tutors/signup" />
}
