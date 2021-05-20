import { LiteYoutubeEmbed } from 'react-lite-yt-embed'
import Modal from 'antd/lib/modal/Modal'

export const YoutubeModal = ({
  show,
  onCancel,
}: {
  show: boolean
  id: string
  onCancel: Function
}) => (
  <Modal width="800px" visible={show} onCancel={() => onCancel()} footer={null}>
    <div style={{ paddingTop: '2rem' }}>
      <LiteYoutubeEmbed id="6-LSMpXbGv0" />
    </div>
  </Modal>
)
