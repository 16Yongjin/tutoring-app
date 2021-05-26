import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  FunctionComponent,
  MutableRefObject,
} from 'react'
import io from 'socket.io-client'
import Peer, { SignalData } from 'simple-peer'

type Location = {
  pathname: string
  url: string
  hash: string
}

type UrlChangeParams = Location & { roomId: string }

export interface ISocketContext {
  call: Call | null
  callAccepted: boolean
  myVideo: any
  userVideo: any
  stream?: MediaStream
  name: string
  callEnded: boolean
  me: string
  initSocket: (roomId: number) => void
  startCamera: () => void
  stopCamera: () => void
  setName: (name: string) => void
  callUser: (name: string) => void
  leaveCall: () => void
  answerCall: () => void
  startCall: () => void
  joinRoom: (roomId: string) => void
  destroy: () => void
  test: () => void
  urlChange: (args: UrlChangeParams) => void
  sendChat: (args: ChatData) => void
  chatHandler: MutableRefObject<Function | undefined>
  currentLocation: Location | null
  user: string
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
  hideInfo?: boolean
}

export const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const VideoContextProvider: FunctionComponent<{}> = ({ children }) => {
  const [socket, setSocket] = useState<any | null>(null)
  const [stream, setStream] = useState<MediaStream | undefined>(undefined)
  const [me, setMe] = useState('')
  const [call, setCall] = useState<Call | null>(null)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState('')
  const [user, setUser] = useState<string>('')
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)

  const myVideo = useRef<HTMLVideoElement>()
  const userVideo = useRef<HTMLVideoElement>()
  const connectionRef = useRef<Peer.Instance>()
  const chatHandler = useRef<Function>()

  useEffect(() => {
    return () => {
      console.log('[exit socket context]')
    }
  }, [])

  const test = () => {
    socket?.emit('test', 'hi')
  }

  const initSocket = (roomId: number) => {
    const socket = io('http://192.168.0.20:4000')
    setSocket(socket)
    socket.emit('joinRoom', roomId)
    socket.on('me', (id: string) => setMe(id))
    // socket.on('joinUser', ({ signal }: CallUserData) => {
    //   console.log('set call!!!!!!')
    //   setCall({ signal })
    // })

    socket.on('hasUser', (userId: string) => {
      console.log('has user', userId)
      setUser(userId)
      socket.emit('meToo', { roomId })
    })

    socket.on('hasUserToo', (userId: string) => {
      console.log('has user too', userId)
      setUser(userId)
    })

    socket.on('startCall', ({ signal }: CallUserData) => {
      console.log('[start call from server]')
      console.log('set call', signal)
      setCall({ signal })
    })

    socket.on('urlChange', ({ url, hash, pathname }: Location) => {
      setCurrentLocation({ url, hash, pathname })
    })

    socket.on('sendChat', (chatData: ChatData) => {
      console.log('chat recievd', chatHandler, chatData)
      chatHandler.current?.(chatData)
    })
  }

  const startCamera = () => {
    if (stream) return

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream)
        currentStream.getTracks().forEach((t) => console.log(t))

        if (myVideo.current) myVideo.current.srcObject = currentStream
      })
  }

  const stopCamera = () => {
    if (!stream) return

    console.log('[stop camera]')
    stream?.getTracks().forEach((track) => track.stop())
    console.log('[video]', myVideo.current)
    if (myVideo.current) myVideo.current.pause()
    if (myVideo.current) myVideo.current.srcObject = null
    if (stream) connectionRef.current?.removeStream(stream)
    connectionRef.current?.destroy()
    setStream(undefined)
  }

  const toggleCamera = () => {
    if (!stream) {
      startCamera()
      if (stream) connectionRef.current?.addStream(stream)

      return
    }

    stream.getVideoTracks().forEach((track) => track.stop())
    connectionRef.current?.removeStream(stream)
  }

  const destroy = () => {
    console.log('[destroy]')
    connectionRef.current?.destroy()
    socket?.disconnect()
    // setStream(null)
    setSocket(null)
    setCall(null)
  }

  const joinRoom = (roomId: string) => {
    socket?.emit('joinRoom', roomId)
  }

  const startCall = () => {
    if (!stream) return console.error('no Stream')
    if (!socket) return console.error('no Socket')
    if (!user) return console.error('no user')

    console.log('전화 걸기 누름')
    const peer = new Peer({ initiator: true, trickle: false, stream })

    peer.on('signal', (signal) => {
      console.log('시그널 생성 후 서버에 전달')
      socket.emit('startCall', { signal, userId: user })
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

  const answerCall = () => {
    setCallAccepted(true)
    console.log(stream, call, socket)

    if (!stream) console.log('no stream')
    if (!call) return console.log('no Call')
    if (!socket) return console.log('no socket')

    console.log('[피어 생성]')
    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (signal) => {
      socket.emit('answerCall', { signal, userId: user })
    })

    peer.on('stream', (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream
    })

    peer.signal(call.signal)

    connectionRef.current = peer
  }

  const callUser = (userId: string) => {
    if (!stream) return console.log('no stream')

    const peer = new Peer({ initiator: true, trickle: false, stream })

    peer.on('signal', (signal) => {
      socket?.emit('callUser', { userToCall: userId, signal, from: me, name })
    })

    peer.on('stream', (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream
    })

    socket?.on('callAccepted', (signal: SignalData) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  const urlChange = ({ roomId, url, hash, pathname }: UrlChangeParams) => {
    socket?.emit('urlChange', { roomId, url, hash, pathname })
  }

  const leaveCall = () => {
    setCallEnded(true)
    stopCamera()
    connectionRef.current?.destroy()
    window.location.reload()
  }

  const sendChat = (chatData: ChatData) => {
    socket?.emit('sendChat', chatData)
  }

  console.log()

  return (
    <SocketContext.Provider
      value={{
        me,
        user,
        name,
        stream,
        call,
        callAccepted,
        callEnded,
        myVideo,
        userVideo,
        initSocket,
        startCamera,
        stopCamera,
        startCall,
        setName,
        callUser,
        leaveCall,
        answerCall,
        destroy,
        test,
        joinRoom,
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
