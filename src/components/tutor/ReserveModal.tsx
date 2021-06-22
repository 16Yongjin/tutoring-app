import { Button, Col, notification, Row, Typography } from 'antd'
import { Schedule, Tutor } from '../../api/tutors/entity'
import Modal from 'antd/lib/modal/Modal'
import dayjs from 'dayjs'
import { Formik } from 'formik'
import { Form, Input, Select } from 'formik-antd'
import * as api from '../../api'
import { useQuery } from 'react-query'
import { Loading } from '../common/Loading'
import { store } from '../../store'
import { useEffect, useMemo, useState } from 'react'
import { ErrorAlert } from '../common'
import * as Yup from 'yup'

const { Title } = Typography

const AppointmentSchema = Yup.object().shape({
  material: Yup.string().min(1).required('Required'),
  course: Yup.string().min(1).required('Required'),
  request: Yup.string(),
})

export const ReserveModal = ({
  show,
  tutor,
  schedule,
  onCancel,
}: {
  show: boolean
  tutor: Tutor
  schedule: Schedule | null
  onCancel: Function
}) => {
  const [materialId, setMaterialId] = useState(-1)
  const { data: materials, isLoading } = useQuery(
    'materials',
    api.materials.getMaterials
  )
  const { data: material } = useQuery(
    ['material', materialId],
    () => api.materials.getMaterial(materialId),
    { retry: false }
  )

  const [errorMsg, setErrorMsg] = useState('')

  const firstCourseToSelect = useMemo(() => {
    if (!material) return ''

    const topic = material.topics?.[0]
    const course = topic?.courses?.[0]
    if (!course) return ''
    return `${topic.title} / ${course.title} #${course.id}`
  }, [material])

  useEffect(() => {
    if (schedule) setErrorMsg('')
  }, [schedule])

  useEffect(() => {
    if (materials) setMaterialId(materials[0]?.id)
  }, [materials])

  if (!schedule) return <div></div>

  return (
    <Modal
      centered
      width="720px"
      visible={show}
      title={
        <Title className="center" level={3} style={{ margin: '0' }}>
          {schedule
            ? `${dayjs(schedule.startTime).format(
                'YYYY. MM. DD. hh:mm'
              )} ~ ${dayjs(schedule.endTime).format('hh:mm')}`
            : ''}
        </Title>
      }
      onCancel={() => onCancel()}
      footer={null}
    >
      {isLoading || !materials ? (
        <Loading />
      ) : (
        <Formik
          validationSchema={AppointmentSchema}
          enableReinitialize
          initialValues={{
            material: materials[0]?.title,
            course: firstCourseToSelect,
            request: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            setErrorMsg('')
            try {
              const courseTitle = values.course.replace(/ #(\d+)$/, '')
              const courseId = Number(values.course.match(/ #(\d+)$/)?.[1])
              await api.appointments.makeAppointment({
                ...values,
                material: `${material?.title} / ${courseTitle}`,
                startTime: dayjs(schedule.startTime).toDate(),
                tutorId: tutor.id,
                userId: store.userStore.user!.id,
                courseId,
              })
              onCancel(true)
              notification.success({
                message: 'Appointment reserved successfully',
              })
            } catch (e) {
              console.log(e)
              setErrors(e.response.data?.errors)
              setErrorMsg(e.message)
            }
          }}
        >
          {({ isSubmitting, submitForm }) => (
            <div>
              <Row gutter={[20, 20]}>
                <Col xs={24}>
                  <ErrorAlert message={errorMsg} />
                </Col>
                <Col xs={24} md={6}>
                  <div>
                    <div className="center">
                      <img
                        style={{ width: '100%', maxWidth: '200px' }}
                        src={tutor.image}
                        alt={tutor.fullname}
                      />
                    </div>
                    <Title
                      className="center"
                      level={4}
                      style={{ marginBottom: 0, marginTop: '0.5rem' }}
                    >
                      {tutor.fullname}
                    </Title>
                  </div>
                </Col>
                <Col xs={24} md={18}>
                  <Form layout="vertical">
                    <Form.Item label="Select material" name="material">
                      <Select
                        name="material"
                        style={{ width: '100%' }}
                        onChange={setMaterialId}
                      >
                        {materials.map((material) => (
                          <Select.Option key={material.id} value={material.id}>
                            {material.title}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Select course" name="course">
                      <Select name="course" style={{ width: '100%' }}>
                        {material?.topics.map((topic) => (
                          <>
                            <Select.Option
                              disabled
                              key={'topic' + topic.id}
                              value={''}
                            >
                              {topic.title}
                            </Select.Option>

                            {topic.courses.map((course) => (
                              <Select.Option
                                key={'course' + course.id}
                                value={`${topic.title} / ${course.title} #${course.id}`}
                              >
                                {course.title}
                              </Select.Option>
                            ))}
                          </>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Any request to tutor" name="request">
                      <Input.TextArea
                        name="request"
                        placeholder="Max 200 letters"
                        maxLength={200}
                      />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <div className="center">
                <Button
                  loading={isSubmitting}
                  onClick={() => submitForm()}
                  type="primary"
                  shape="round"
                >
                  <span style={{ padding: '0 4rem' }}>Reserve</span>
                </Button>
              </div>
            </div>
          )}
        </Formik>
      )}
    </Modal>
  )
}
