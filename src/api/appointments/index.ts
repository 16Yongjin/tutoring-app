import { APIClient } from '../apiClient'
import * as API from './api'

export const getAppointment = APIClient.of(API.GetAppointment)

export const getUpcomingUserAppointment = APIClient.of(
  API.GetUpcomingUserAppointment
)

export const getUpcomingTutorAppointment = APIClient.of(
  API.GetUpcomingTutorAppointment
)

export const getAdminAppointments = APIClient.of(API.GetAdminAppointments)

export const getUserAppointments = APIClient.of(API.GetUserAppointments)

export const getTutorAppointments = APIClient.of(API.GetTutorAppointments)

export const makeAppointment = APIClient.of(API.MakeAppointment)

export const removeAppointment = APIClient.of(API.RemoveAppointment)

export const feedbackAppointment = APIClient.of(API.FeedbackAppointment)
