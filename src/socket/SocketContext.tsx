import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  FunctionComponent,
  LegacyRef,
  MutableRefObject,
} from 'react'
import { io, Socket } from 'socket.io-client'
import Peer, { SignalData } from 'simple-peer'

export interface ISocketContext {
  call: Call | null
  callAccepted: boolean
  myVideo: any
  userVideo: any
  stream: MediaStream | null
  name: string
  callEnded: boolean
  me: string
  initSocket: () => void
  startCamera: () => void
  stopCamera: () => void
  setName: (name: string) => void
  callUser: (name: string) => void
  leaveCall: () => void
  answerCall: () => void
  joinRoom: (roomId: number) => void
  destroy: () => void
}

interface CallUserData {
  from: string
  name: string
  signal: SignalData
}

interface Call extends CallUserData {
  isReceivedCall: boolean
}

export const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const VideoContextProvider: FunctionComponent<{}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [me, setMe] = useState('')
  const [call, setCall] = useState<Call | null>(null)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState('')

  const myVideo = useRef<HTMLVideoElement>()
  const userVideo = useRef<HTMLVideoElement>()
  const connectionRef = useRef<Peer.Instance>()

  useEffect(() => {
    // return () => {
    //   console.log('[exit video context provider]')
    //   stopCamera()
    //   destroy()
    // }
    return () => {
      console.log('[exit socket context]')
    }
  }, [])

  const initSocket = () => {
    const socket = io(process.env.API_URL)
    setSocket(socket)
    socket.on('me', (id: string) => setMe(id))
    socket.on('callUser', ({ from, name, signal }: CallUserData) => {
      setCall({ isReceivedCall: true, from, name, signal })
    })
  }

  const startCamera = () => {
    if (stream) return

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        console.log('get new Stream', currentStream, stream)
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
    setStream(null)
  }

  const destroy = () => {
    console.log('[destroy]')
    connectionRef.current?.destroy()
    socket?.disconnect()
    setStream(null)
    setSocket(null)
    setCall(null)
  }

  const joinRoom = (roomId: number) => {
    socket?.emit('joinRoom', { roomId })
  }

  const answerCall = () => {
    setCallAccepted(true)

    if (!stream) return console.log('no stream')
    if (!call) return console.log('no Call')

    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (signal) => {
      socket?.emit('answerCall', { signal, to: call.from })
    })

    peer.on('stream', (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream
    })

    peer.signal(call.signal)

    connectionRef.current = peer
  }

  const callUser = (userId: string) => {
    if (!stream) return console.log('no stream')
    if (!call) return console.log('no Call')

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

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current?.destroy()
    window.location.reload()
  }

  console.log()

  return (
    <SocketContext.Provider
      value={{
        me,
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
        joinRoom,
        setName,
        callUser,
        leaveCall,
        answerCall,
        destroy,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
