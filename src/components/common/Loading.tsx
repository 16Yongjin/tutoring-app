import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export const Loading = () => {
  return (
    <div className="center">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </div>
  )
}
