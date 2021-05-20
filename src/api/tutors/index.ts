import { APIClient } from '../apiClient'
import * as TutorAPI from './api'

export const getTutors = APIClient.of(TutorAPI.GetTutors)

export const getTutor = APIClient.of(TutorAPI.GetTutor)

export const updateTutor = APIClient.of(TutorAPI.UpdateTutor)

export const addSchedules = APIClient.of(TutorAPI.AddSchedules)

export const removeSchedules = APIClient.of(TutorAPI.RemoveSchedules)