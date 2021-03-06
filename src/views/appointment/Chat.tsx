import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { SocketContext, ChatData } from '../../socket/SocketContext'
import { Button, Input } from 'antd'
import styled from 'styled-components'
import { nanoid } from 'nanoid'
import { SendOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useScroll } from 'react-use'
import { Appointment } from '../../api/appointments/entity'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  height: 100%;

  .chat {
    &-container {
      overflow-y: auto;
      padding: 0.5rem;
    }

    &-box {
      display: flex;
      flex-direction: column;
    }

    &-info {
      display: flex;
      color: #ccc;
      font-size: 0.9rem;
      margin-top: 1rem;
    }

    &-balloon {
      display: flex;
      background-color: #f8f8f8;
      border-radius: 1rem;
      margin: 2px 0;

      &-wrapper {
        display: flex;
      }
    }

    &-text {
      margin-top: 0.1rem;
      margin-bottom: 0.2rem;
      margin-right: 0.75rem;
      margin-left: 0.75rem;
      font-size: 1rem;
      word-break: break-all;
    }
  }

  .my-chat {
    .chat {
      &-info {
        justify-content: flex-end;
      }

      &-balloon {
        background-color: #1890ff;
        color: white;

        &-wrapper {
          justify-content: flex-end;
        }
      }
    }
  }

  .system-chat {
    text-align: center;
    font-size: 0.8rem;
    color: #ccc;
  }

  .actions {
    margin: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .new-chat-alarm {
    position: absolute;
    bottom: 48px;
    right: 50%;
    color: white;
    transform: translateX(50%);
  }
`
const SystemChatBox = ({ chat }: { chat: ChatData }) => (
  <div className={`chat-box system-chat`}>
    <span className="chat-text">{chat.text}</span>
  </div>
)

const UserChatBox = ({ chat }: { chat: ChatData }) => (
  <div
    className={`chat-box ${chat.me ? 'my-chat' : 'other-chat'}`}
    key={chat.id}
  >
    {!chat.hideInfo && (
      <div className="chat-info">
        {chat.name} {dayjs(chat.date).format('HH:mm a')}
      </div>
    )}
    <div className="chat-balloon-wrapper">
      <span className="chat-balloon">
        <span className="chat-text">{chat.text}</span>
      </span>
    </div>
  </div>
)

export const Chat = ({
  roomId,
  username,
  appointment,
  setHasNewChatting,
  isTutor,
}: {
  roomId: string
  username: string
  appointment: Appointment
  setHasNewChatting: Function
  isTutor: boolean
}) => {
  const { chatHandler, sendChat, initSocket, destroy } =
    useContext(SocketContext)
  const [chats, setChats] = useState<ChatData[]>([])
  const [text, setText] = useState('')
  const [hasNewChat, setHasNewChat] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { y: containerScrollY } = useScroll(containerRef)

  const hideNewChatMsgIfScrollDown = () => {
    const container = containerRef.current
    if (!container) return

    // ???????????? ????????? ????????? ??????
    const scrolledDown =
      container.scrollTop + container.offsetHeight + 40 < container.scrollHeight

    if (scrolledDown) setHasNewChat(false)
  }

  const scrollDown = () => {
    const container = containerRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
    setHasNewChat(false)
  }

  const checkScroll = () => {
    const container = containerRef.current
    if (!container) return

    console.log(
      container.scrollTop,
      container.offsetHeight,
      container.scrollHeight
    )
    // ???????????? ?????? ????????? ??????
    const scrolledUp =
      container.scrollTop + container.offsetHeight + 40 <
        container.scrollHeight || container.scrollHeight === 0

    if (scrolledUp) setHasNewChat(true)
    else scrollDown()
  }

  const addChat = useCallback(
    (chat: ChatData) => {
      chat.me = !chat.system && chat.name === username
      chat.dateStr = dayjs(chat.date).format('HH:mm a')

      const lastChat = chats[chats.length - 1]
      if (lastChat) {
        chat.hideInfo =
          !lastChat.system &&
          lastChat.me === chat.me &&
          lastChat.dateStr === chat.dateStr
      }

      setChats([...chats, chat])

      setHasNewChatting(true)

      if (chat.me) scrollDown()
      else checkScroll()
    },
    [chats, username]
  )

  const setChatHandler = () => {
    chatHandler.current = addChat
    return () => (chatHandler.current = undefined)
  }

  useEffect(setChatHandler, [chatHandler, addChat])

  useEffect(hideNewChatMsgIfScrollDown, [containerScrollY])

  /** ???????????? ?????? ??? ?????? ????????? && ????????? ?????? ?????? */
  useEffect(() => {
    initSocket({
      roomId: appointment.id.toString(),
      username,
      isTutor,
    })

    return () => {
      destroy()
    }
  }, [])

  const onSendChat = () => {
    if (!text) return

    sendChat({
      roomId,
      text,
      name: username,
      date: new Date(),
      id: nanoid(),
    })

    setText('')
  }

  return (
    <Section>
      <div className="chat-container" ref={containerRef}>
        {chats.map((chat) =>
          chat.system ? (
            <SystemChatBox key={chat.id} chat={chat} />
          ) : (
            <UserChatBox key={chat.id} chat={chat} />
          )
        )}
      </div>

      <div className="actions">
        <Input
          value={text}
          placeholder="Enter Message"
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendChat()}
        />
        <Button type="primary" shape="circle" onClick={onSendChat}>
          <SendOutlined />
        </Button>
      </div>

      {hasNewChat && (
        <div className="new-chat-alarm">
          <Button type="primary" shape="round" onClick={scrollDown}>
            New Message
          </Button>
        </div>
      )}
    </Section>
  )
}
