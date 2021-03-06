import { APIClient } from '../apiClient'
import * as TutorAPI from './api'

export const getTutors = APIClient.of(TutorAPI.GetTutors)

export const searchTutors = APIClient.of(TutorAPI.SearchTutors)

export const getTutorsByAdmin = APIClient.of(TutorAPI.GetTutorsByAdmin)

export const getTutor = APIClient.of(TutorAPI.GetTutor)

export const updateTutor = APIClient.of(TutorAPI.UpdateTutor)

export const getTutorSchedules = APIClient.of(TutorAPI.GetTutorSchedules)

export const addSchedules = APIClient.of(TutorAPI.AddSchedule)

export const removeSchedules = APIClient.of(TutorAPI.RemoveSchedules)
