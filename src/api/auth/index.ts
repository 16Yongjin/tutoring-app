import { APIClient } from '../apiClient'
import * as AuthAPI from './api'

export const login = APIClient.of(AuthAPI.Login)

export const me = APIClient.of(AuthAPI.Me)
