import React, {
  createContext,
  useState,
  useRef,
  FunctionComponent,
  MutableRefObject,
  useMemo,
} from 'react'
import io from 'socket.io-client'
import Peer, { SignalData } from 'simple-peer'
import { nanoid } from 'nanoid'
import { message, notification } from 'antd'

type Location = {
  pathname: string
  url: string
  hash: string
}

type UrlChangeParams = Location & { roomId: string }

export interface ISocketContext {
  call: Call | null
  myVideo: any
  userVideo: any
  stream?: MediaStream
  /** 상대가 연결 시도 후 시그널 생성 & 전송 기다리기 */
  userReady: boolean
  callAccepted: boolean
  callEnded: boolean
  callInProgress: boolean
  /** 통화 연결 시도 후 유저 응답 기다리기 */
  waitingUser: boolean
  initSocket: (args: InitSocketData) => void
  startMedia: () => void
  stopMedia: () => void
  leaveCall: () => void
  answerCall: () => void
  startCall: () => void
  destroy: () => void
  test: () => void
  urlChange: (args: UrlChangeParams) => void
  sendChat: (args: ChatData) => void
  getReady: (args: ReadyData) => void
  toggleVideo: () => void
  toggleAudio: () => void
  videoOn: boolean
  audioOn: boolean
  chatHandler: MutableRefObject<Function | undefined>
  currentLocation: Location | null
  user: string
  tutor: string
}

type InitSocketData = {
  roomId: string
  username: string
  isTutor: boolean
}

type InitUserData = {
  userId: string
  isTutor: boolean
}
interface CallUserData {
  from: string
  name: string
  signal: SignalData
}

interface Call {
  signal: SignalData
}

export type ChatData = {
  roomId: string
  name: string
  text: string
  date: Date
  id: string
  me?: boolean
  dateStr?: string
  system?: boolean
  hideInfo?: boolean
}

type ReadyData = {
  roomId: string
  isTutor: boolean
  userId?: string
}

export const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const VideoContextProvider: FunctionComponent<{}> = ({ children }) => {
  const [socket, setSocket] = useState<any | null>(null)
  const [stream, setStream] = useState<MediaStream | undefined>(undefined)
  const [call, setCall] = useState<Call | null>(null)
  const [userReady, setUserReady] = useState(false)
  const [waitingUser, setWaitingUser] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const callInProgress = useMemo(
    () => callAccepted && !callEnded,
    [callAccepted, callEnded]
  )
  const [user, setUser] = useState<string>('')
  const [tutor, setTutor] = useState<string>('')
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)

  const myVideo = useRef<HTMLVideoElement>()
  const userVideo = useRef<HTMLVideoElement>()
  const peerRef = useRef<Peer.Instance>()
  const chatHandler = useRef<Function>()

  const [videoOn, setVideoOn] = useState(false)
  const [audioOn, setAudioOn] = useState(false)

  const test = () => {
    socket?.emit('test', 'hi')
  }

  /** 소켓 시동 걸기 */
  const initSocket = ({ roomId, username, isTutor }: InitSocketData) => {
    if (socket) return

    console.log('[init socket]')

    const socketClient = io('http://192.168.0.20:4000')
    setSocket(socketClient)
    socketClient.emit('joinRoom', {
      roomId,
      isTutor,
    })

    socketClient.on(
      'hasUser',
      ({ userId, isTutor: isUserTutor }: InitUserData) => {
        console.log('has user', userId)

        setUser(isUserTutor ? '' : userId)
        setTutor(isUserTutor ? userId : '')

        socketClient.emit('meToo', { roomId, isTutor })
      }
    )

    socketClient.on('hasUserToo', ({ userId, isTutor }: InitUserData) => {
      console.log('has user too', userId, isTutor)
      if (isTutor) setTutor(userId)
      else setUser(userId)
    })

    socketClient.on('startCall', ({ signal }: CallUserData) => {
      console.log('[start call from server]')
      console.log('set call', signal)
      setUserReady(false)
      setCall({ signal })
    })

    socketClient.on('urlChange', ({ url, hash, pathname }: Location) => {
      setCurrentLocation({ url, hash, pathname })
    })

    socketClient.on('sendChat', (chatData: ChatData) => {
      console.log('chat recievd', chatHandler, chatData)
      chatHandler.current?.(chatData)
    })

    socketClient.on('getReady', ({ isTutor, userId }: InitUserData) => {
      setUserReady(true)
      setUser(isTutor ? '' : userId!)
      setTutor(isTutor ? userId! : '')
    })

    socketClient.on('leaveRoom', clearUser)

    alertJoin({ socket: socketClient, roomId, username })
  }

  const clearUser = ({ userId, isTutor }: InitUserData) => {
    setCallAccepted(false)
    setWaitingUser(false)
    setUserReady(false)
    setCall(null)
    setTutor('')
    setUser('')
    peerRef.current?.destroy()
    peerRef.current = undefined
    message.warning(isTutor ? 'Tutor left call' : 'User left call')
  }

  /**
   * 자원 정리
   * 1. Peer 객체 파괴
   * 2. Socket 파괴
   * 3. Stream 제거
   */
  const destroy = () => {
    window.location.reload()
  }

  /** 카메라 시동 걸기
   * TODO: 비디오, 오디오 분리
   */
  const startMedia = () => {
    if (stream) return

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream)
        setVideoOn(true)
        setAudioOn(true)

        if (myVideo.current) myVideo.current.srcObject = currentStream
      })
      .catch((error) => {
        notification.error({
          message: (
            <div>
              Please Allow Camera And Audio
              <br />
              <a
                href="https://support.google.com/chrome/answer/2693767"
                rel="noreferrer"
                target="_blank"
              >
                Check out Chrome Help
              </a>
            </div>
          ),
        })
      })
  }

  const stopMedia = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setVideoOn(false)
    setAudioOn(false)
  }

  /** 내 카메라 멈추기 */
  const toggleVideo = () => {
    console.log('[toggle camera]')
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
      setVideoOn(track.enabled)
    })
  }

  const toggleAudio = () => {
    console.log('[stop audio]')
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
      setAudioOn(track.enabled)
    })
  }

  const getReady = ({ roomId, isTutor }: ReadyData) => {
    if (!stream) return startMedia()

    setWaitingUser(true)
    socket?.emit('getReady', { roomId, isTutor })

    console.log('gerready', user, tutor, call)

    if (isTutor) {
      if (user) {
        if (call) answerCall()
        else startCall()
      }
    } else {
      if (tutor) {
        if (call) answerCall()
        else startCall()
      }
    }
  }

  /** 전화 걸기 */
  const startCall = () => {
    console.log('[start call]')
    console.log(socket)
    // if (!stream) return console.error('no Stream')
    if (!socket) return console.error('no Socket')
    if (!user && !tutor) return console.error('no user')

    console.log('전화 걸기 누름')
    const peer = new Peer({ initiator: true, trickle: false, stream })

    peer.on('signal', (signal) => {
      console.log('시그널 생성 후 서버에 전달')
      console.log('[tutor]', tutor, '[user]', user)
      socket.emit('startCall', { signal, userId: tutor || user })
    })

    peer.on('stream', (currentStream) => {
      message.success('Call Connected')
      console.log('userVideo', userVideo)
      if (userVideo.current) userVideo.current.srcObject = currentStream
    })

    socket.off('callAccepted')
    socket.on('callAccepted', (signal: SignalData) => {
      console.log('[전화 수락됨]')
      setCallAccepted(true)
      peer.signal(signal)
    })

    socket.on('error', (error: Error) => {
      notification.error({
        message: error.toString(),
      })
    })

    peerRef.current = peer
  }

  /** 전화 받기 */
  const answerCall = () => {
    console.log('[answer call]')
    setCallAccepted(true)
    console.log(stream, call, socket)

    // if (!stream) console.log('no stream')
    if (!call) return console.log('no Call')
    if (!socket) return console.log('no socket')
    if (!(tutor || user)) return console.log('no tutor or user')

    console.log('[피어 생성]')
    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (signal) => {
      console.log('[전화 받기]')
      console.log('[tutor]', tutor, '[user]', user)
      socket.emit('answerCall', { signal, userId: tutor || user })
    })

    peer.on('stream', (currentStream) => {
      message.success('Call Connected')
      if (userVideo.current) userVideo.current.srcObject = currentStream
    })

    peer.signal(call.signal)

    peerRef.current = peer
  }

  /** URL 변경 시 */
  const urlChange = ({ roomId, url, hash, pathname }: UrlChangeParams) => {
    socket?.emit('urlChange', { roomId, url, hash, pathname })
  }

  /** 전화 끊기 */
  const leaveCall = () => {
    setCallEnded(true)
    stopMedia()
    peerRef.current?.destroy()
    window.location.reload()
  }

  const sendChat = (chatData: ChatData) => {
    socket?.emit('sendChat', chatData)
  }

  /** `setSocket` 해도 `socket`이 초기화되지 않아서 직접 `socket` 전달 받음 */
  const alertJoin = ({
    socket,
    roomId,
    username,
  }: {
    socket: any
    roomId: string
    username: string
  }) => {
    socket.emit('sendChat', {
      id: nanoid(),
      name: username,
      roomId: roomId,
      text: `${username} has joined the chat`,
      date: new Date(),
      system: true,
    })
  }

  return (
    <SocketContext.Provider
      value={{
        user,
        tutor,
        stream,
        call,
        userReady,
        callAccepted,
        callEnded,
        callInProgress,
        myVideo,
        userVideo,
        waitingUser,
        getReady,
        initSocket,
        startMedia,
        stopMedia,
        toggleVideo,
        toggleAudio,
        startCall,
        leaveCall,
        answerCall,
        destroy,
        test,
        urlChange,
        sendChat,
        videoOn,
        audioOn,
        chatHandler,
        currentLocation,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
