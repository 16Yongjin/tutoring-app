import { Button, Col, Row, Spin, Typography } from 'antd'
import { Schedule, TutorInfo } from '../../api/tutors/entity'
import Modal from 'antd/lib/modal/Modal'
import dayjs from 'dayjs'
import { Formik } from 'formik'
import { Form, Input, Select } from 'formik-antd'
import * as api from '../../api'
import { useQuery } from 'react-query'

const { Title } = Typography

export const ReserveModal = ({
  show,
  tutor,
  schedule,
  onCancel,
}: {
  show: boolean
  tutor: TutorInfo
  schedule: Schedule | null
  onCancel: Function
}) => {
  const { data: materials, isLoading } = useQuery(
    'materials',
    api.materials.getMaterials
  )

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
        <Spin />
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            material: materials[0]?.title,
            request: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            console.log(values)
            try {
              // onCancel(true)
            } catch (e) {
              setErrors(e.response.data?.errors)
            }
          }}
        >
          {({ isSubmitting, submitForm }) => (
            <div>
              <Row gutter={[20, 20]}>
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
                      <Select name="material" style={{ width: '100%' }}>
                        {materials.map((material) => (
                          <Select.Option
                            key={material.id.toString()}
                            value={material.title}
                          >
                            {material.title}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Any request to tutor" name="request">
                      <Input.TextArea name="request" maxLength={200} />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <div className="center">
                <Button
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
