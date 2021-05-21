import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './Root'
import { LoginRequest, UserInfo } from '../api/auth/entity'
import * as api from '../api'
import { AUTH_TOKEN_KEY } from '../consts'

export class UserStore {
  rootStore: RootStore
  token: string | null = localStorage.getItem(AUTH_TOKEN_KEY)
  user: UserInfo | null = null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      token: observable,
      user: observable,
      setUser: action,
      login: action,
      logout: action,
      loadUser: action,
    })

    this.loadUser()
  }

  async loadUser() {
    if (!this.token) return

    try {
      this.user = await api.auth.me()
    } catch (e) {
      console.log(e)
    }
  }

  async login(data: LoginRequest) {
    const user = await api.auth.login(data)
    this.setUser(user)
  }

  async tutorLogin(data: LoginRequest) {
    const user = await api.auth.tutorLogin(data)
    this.setUser(user)
  }

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    this.user = null
    this.token = null
  }

  setUser(user: UserInfo) {
    this.token = user.token
    this.user = user
    localStorage.setItem(AUTH_TOKEN_KEY, user.token)
  }
}
