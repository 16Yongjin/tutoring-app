import { APIClient } from '../apiClient'
import * as AuthAPI from './api'

export const login = APIClient.of(AuthAPI.Login)
