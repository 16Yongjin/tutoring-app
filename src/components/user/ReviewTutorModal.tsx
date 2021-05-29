import { Button, notification } from 'antd'
import * as api from '../../api'
import Modal from 'antd/lib/modal/Modal'
import { Formik } from 'formik'
import { Form, Input, Rate } from 'formik-antd'
import { Appointment } from '../../api/appointments/entity'

export const ReviewTutorModal = ({
  appointment,
  onCancel,
}: {
  appointment: Appointment
  onCancel: Function
}) => {
  return (
    <Modal
      visible
      title={`Review tutor: ${appointment.tutor.fullname}`}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Formik
        enableReinitialize
        initialValues={{
          text: '',
          rating: 5,
        }}
        onSubmit={async (values, { setErrors, resetForm }) => {
          try {
            await api.reviews.createReview({
              ...values,
              tutorId: appointment.tutor.id,
              userId: appointment.user.id,
            })
            onCancel(true)
            resetForm()
            notification.success({
              message: 'Review Tutor Success!',
              duration: 5,
            })
          } catch (e) {
            notification.error({
              message: e.message,
              duration: 5,
            })
            setErrors(e.response.data.errors)
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form layout="vertical">
            <Form.Item label="Rating" name="rating">
              <Rate name="rating" />{' '}
              <span className="ml-2">{values.rating} / 5</span>
            </Form.Item>

            <Form.Item label="Review" name="text">
              <Input.TextArea
                name="text"
                placeholder="Optional"
                maxLength={1000}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button htmlType="submit" type="primary" loading={isSubmitting}>
                Ok
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
