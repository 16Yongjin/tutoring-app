import { Button, Divider, notification, Typography } from 'antd'
import * as api from '../../../api'
import { Appointment } from '../../../api/appointments/entity'
import Modal from 'antd/lib/modal/Modal'
import { Formik } from 'formik'
import { Form, Input } from 'formik-antd'
import { formatSchedule } from '../../../utils/date/formatSchedule'
const { Title } = Typography

export const FeedbackModal = ({
  appointment,
  show,
  onCancel,
}: {
  appointment: Appointment
  show: boolean
  onCancel: Function
}) => {
  return (
    <Modal
      title={`약속 ${appointment.id} 피드백 남기기`}
      visible={show}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Formik
        enableReinitialize
        initialValues={{
          text: '',
        }}
        onSubmit={async (values, { setErrors, resetForm }) => {
          try {
            await api.appointments.feedbackAppointment({
              ...values,
              appointmentId: appointment.id,
            })
            onCancel(true)
            resetForm()
            notification.success({
              message: '피드백 남기기 성공',
              duration: 5,
            })
          } catch (e) {
            setErrors(e.response.data.errors)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form layout="vertical">
            <Title level={5}>시간: {formatSchedule(appointment)}</Title>
            <Title level={5}>교재: {appointment.material}</Title>
            <Title level={5}>
              사용자 이름: {appointment.user.fullname} (
              {appointment.user.username})
            </Title>

            <Divider />

            <Form.Item label="피드백 작성하기" name="text">
              <Input.TextArea
                name="text"
                placeholder="10자 이상 작성해주세요"
                maxLength={1000}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button htmlType="submit" type="primary" loading={isSubmitting}>
                완료
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
