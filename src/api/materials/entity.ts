export type Exercise = {
  id: number
  index: number
  title: string
  description: string
  text: string
  createdAt: Date
  updatedAt: Date
  courseId: number
  course: Course
}

export type Course = {
  id: number
  title: string
  description: string
  level: number
  image: string
  createdAt: Date
  updatedAt: Date
  topicId: number
  topic: Topic
  exercises: Exercise[]
}

export type Topic = {
  id: number
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  materialId: number
  material: Material
  courses: Course[]
}

export type Material = {
  id: number
  title: string
  description: string
  levelStart: number
  levelEnd: number
  image: string
  createdAt: Date
  updatedAt: Date
  topics: Topic[]
}

/**
 * Get
 */

export type GetMaterialsResponse = Material[]
export type GetMaterialResponse = Material
export type GetCourseResponse = Course

/**
 * Post Create
 */

export type CreateMaterialRequest = {
  title: string
  description: string
  levelStart: number
  levelEnd: number
  image: string
}

export type CreateExerciseRequest = {
  courseId: number
  index: number
  title: string
  description: string
  text: string
}

export type CreateCourseRequest = {
  topicId: number
  title: string
  description: string
  level: number
  image: string
}

export type CreateTopicRequest = {
  materialId: number
  title: string
  description: string
}

export type CreateMaterialResponse = Material
export type CreateExerciseResponse = Exercise
export type CreateCourseResponse = Course
export type CreateTopicResponse = Topic

/**
 * Post Update
 */

type WithId = { id: number }

export type UpdateMaterialRequest = CreateMaterialRequest & WithId
export type UpdateExerciseRequest = Omit<CreateExerciseRequest, 'courseId'> &
  WithId
export type UpdateCourseRequest = Omit<CreateCourseRequest, 'topicId'> & WithId
export type UpdateTopicRequest = Omit<CreateTopicRequest, 'materialId'> & WithId

export type UpdateMaterialResponse = Material
export type UpdateExerciseResponse = Exercise
export type UpdateCourseResponse = Course
export type UpdateTopicResponse = Topic

/**
 * Delete
 */

export type DeleteMaterialResponse = Material
export type DeleteExerciseResponse = Exercise
export type DeleteCourseResponse = Course
export type DeleteTopicResponse = Topic
