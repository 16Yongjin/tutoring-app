import { APIClient } from '../apiClient'
import * as MaterialAPI from './api'

export const getMaterials = APIClient.of(MaterialAPI.GetMaterials)
export const getMaterial = APIClient.of(MaterialAPI.GetMaterial)
export const getCourse = APIClient.of(MaterialAPI.GetCourse)

export const createMaterial = APIClient.of(MaterialAPI.CreateMaterial)
export const createTopic = APIClient.of(MaterialAPI.CreateTopic)
export const createCourse = APIClient.of(MaterialAPI.CreateCourse)
export const createExercise = APIClient.of(MaterialAPI.CreateExercise)

export const updateMaterial = APIClient.of(MaterialAPI.UpdateMaterial)
export const updateTopic = APIClient.of(MaterialAPI.UpdateTopic)
export const updateCourse = APIClient.of(MaterialAPI.UpdateCourse)
export const updateExercise = APIClient.of(MaterialAPI.UpdateExercise)

export const deleteMaterial = APIClient.of(MaterialAPI.DeleteMaterial)
export const deleteTopic = APIClient.of(MaterialAPI.DeleteTopic)
export const deleteCourse = APIClient.of(MaterialAPI.DeleteCourse)
export const deleteExercise = APIClient.of(MaterialAPI.DeleteExercise)
