import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  FunctionComponent,
  MutableRefObject,
  useMemo,
} from 'react'
import io from 'socket.io-client'
import Peer, { SignalData } from 'simple-peer'
import { nanoid } from 'nanoid'

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
  startCamera: () => void
  stopCamera: () => void
  leaveCall: () => void
  answerCall: () => void
  startCall: () => void
  destroy: () => void
  test: () => void
  urlChange: (args: UrlChangeParams) => void
  sendChat: (args: ChatData) => void
  getReady: (args: ReadyData) => void
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
  const connectionRef = useRef<Peer.Instance>()
  const chatHandler = useRef<Function>()
  const [waitingUser, setWaitingUser] = useState(false)

  useEffect(() => {
    return () => {
      console.log('[exit socket context]')
    }
  }, [])

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

        if (isUserTutor) setTutor(userId)
        else setUser(userId)

        socketClient.emit('meToo', { roomId, isTutor })
      }
    )

    socketClient.on('hasUserToo', ({ userId, isTutor }: InitUserData) => {
      console.log('has user too', userId)
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

    socketClient.on('getReady', (readyData: ReadyData) => {
      console.log('get Ready', readyData)
      setUserReady(true)
    })

    socketClient.on('leaveRoom', clearUser)

    alertJoin({ socket: socketClient, roomId, username })
  }

  const clearUser = ({ userId, isTutor }: InitUserData) => {
    setWaitingUser(false)

    if (isTutor) setTutor('')
    else setUser('')
  }

  /**
   * 자원 정리
   * 1. Peer 객체 파괴
   * 2. Socket 파괴
   * 3. Stream 제거
   */
  const destroy = () => {
    console.log('[destroy]')
    connectionRef.current?.destroy()
    connectionRef.current = undefined
    socket?.disconnect()
    stopCamera()
    setStream(undefined)
    setSocket(null)
    setCall(null)
  }

  /** 카메라 시동 걸기
   * TODO: 비디오, 오디오 분리
   */
  const startCamera = () => {
    if (stream) return

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream)

        if (myVideo.current) myVideo.current.srcObject = currentStream
      })
  }

  /** 내 카메라 멈추기 */
  const stopCamera = () => {
    if (!stream) return

    console.log('[stop camera]')
    stream?.getTracks().forEach((track) => track.stop())
    if (myVideo.current) myVideo.current.pause()
    if (myVideo.current) myVideo.current.srcObject = null
    if (stream) connectionRef.current?.removeStream(stream)
    setStream(undefined)
  }

  const joinRoom = (roomId: string) => {
    socket?.emit('joinRoom', roomId)
  }

  const getReady = ({ roomId, isTutor }: ReadyData) => {
    setWaitingUser(true)
    socket?.emit('getReady', { roomId, isTutor })

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
      socket.emit('startCall', { signal, userId: tutor || user })
    })

    peer.on('stream', (currentStream) => {
      console.log('userVideo', userVideo)
      if (userVideo.current) userVideo.current.srcObject = currentStream
    })

    socket.on('callAccepted', (signal: SignalData) => {
      console.log('[전화 수락됨]')
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  /** 전화 받기 */
  const answerCall = () => {
    console.log('[answer call]')
    setCallAccepted(true)
    console.log(stream, call, socket)

    // if (!stream) console.log('no stream')
    if (!call) return console.log('no Call')
    if (!socket) return console.log('no socket')

    console.log('[피어 생성]')
    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (signal) => {
      socket.emit('answerCall', { signal, userId: tutor || user })
    })

    peer.on('stream', (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream
    })

    peer.signal(call.signal)

    connectionRef.current = peer
  }

  /** URL 변경 시 */
  const urlChange = ({ roomId, url, hash, pathname }: UrlChangeParams) => {
    socket?.emit('urlChange', { roomId, url, hash, pathname })
  }

  /** 전화 끊기 */
  const leaveCall = () => {
    setCallEnded(true)
    stopCamera()
    connectionRef.current?.destroy()
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
        startCamera,
        stopCamera,
        startCall,
        leaveCall,
        answerCall,
        destroy,
        test,
        urlChange,
        sendChat,
        chatHandler,
        currentLocation,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
