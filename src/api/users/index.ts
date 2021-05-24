import { APIClient } from '../apiClient'
import * as UserAPI from './api'

export const getUsers = APIClient.of(UserAPI.GetUsers)

export const getUser = APIClient.of(UserAPI.GetUser)

export const updateUser = APIClient.of(UserAPI.UpdateUser)
