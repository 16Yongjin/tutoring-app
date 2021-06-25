import { LiteYoutubeEmbed } from 'react-lite-yt-embed'
import Modal from 'antd/lib/modal/Modal'
import { useMemo } from 'react'

function parseYoutubeId(url: string) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : ''
}

export const YoutubeModal = ({
  url = '',
  show,
  onCancel,
}: {
  show: boolean
  url: string
  onCancel: Function
}) => {
  const youtubeId = useMemo(() => parseYoutubeId(url), [url])

  return (
    <Modal
      centered
      width="800px"
      visible={show}
      onCancel={() => onCancel()}
      footer={null}
    >
      <div style={{ paddingTop: '2rem' }}>
        <LiteYoutubeEmbed id={youtubeId} />
      </div>
    </Modal>
  )
}
