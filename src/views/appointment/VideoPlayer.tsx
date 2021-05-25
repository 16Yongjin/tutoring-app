import React from 'react'
import { SocketContext } from '../../socket/SocketContext'
import { Button, Col, Row } from 'antd'

export class VideoPlayer extends React.Component<{ id: number }> {
  static contextType = SocketContext

  componentDidMount() {
    this.context.initSocket(this.props.id)
    this.context.startCamera()
  }

  componentWillUnmount() {
    // this.context.stopCamera()
  }

  render() {
    return (
      <SocketContext.Consumer>
        {({
          stream,
          name,
          user,
          call,
          myVideo,
          userVideo,
          stopCamera,
          startCamera,
          callAccepted,
          callEnded,
          startCall,
          answerCall,
          leaveCall,
          test,
        }) => (
          <Row>
            {stream && (
              <Col xs={24}>
                <h3>{name}</h3>
                <video
                  style={{ maxWidth: '100%' }}
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                />
              </Col>
            )}

            {callAccepted && !callEnded && (
              <Col xs={24}>
                <h3>{name}</h3>
                <video
                  style={{ maxWidth: '100%' }}
                  playsInline
                  muted
                  ref={userVideo}
                  autoPlay
                />
              </Col>
            )}

            {stream ? (
              <Button onClick={stopCamera}>Turn off camera</Button>
            ) : (
              <Button onClick={startCamera}>Turn on camera</Button>
            )}

            {call && <Button onClick={() => answerCall()}>전화 받기</Button>}

            {callAccepted && !callEnded && (
              <Button onClick={leaveCall}>Hang up</Button>
            )}

            {user && <Button onClick={() => startCall()}>전화 걸기</Button>}
            <Button onClick={() => test()}>테스터</Button>
          </Row>
        )}
      </SocketContext.Consumer>
    )
  }
}
