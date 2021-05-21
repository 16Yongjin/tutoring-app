import { store } from '../../store'
import { Login } from './Login'

export const UserLogin = () => {
  const login = store.userStore.login.bind(store.userStore)
  return <Login title="Login" login={login} signupUrl="/signup" />
}
