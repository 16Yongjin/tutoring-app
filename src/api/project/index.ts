import { APIClient } from '../apiClient'
import { ProjectAPI } from './api'

export const getAllProjects = APIClient.of(ProjectAPI.Projects)

export const getFeaturedProjects = APIClient.of(ProjectAPI.FeaturedProjects)
