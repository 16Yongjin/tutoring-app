import React from 'react'
import { SocketContext } from '../../socket/SocketContext'
import { Button, Col, Row } from 'antd'

export class VideoPlayer extends React.Component {
  static contextType = SocketContext

  componentDidMount() {
    this.context.startCamera()
  }

  componentWillUnmount() {
    this.context.stopCamera()
  }

  render() {
    return (
      <SocketContext.Consumer>
        {({
          stream,
          name,
          myVideo,
          stopCamera,
          startCamera,
          callAccepted,
          callEnded,
          leaveCall,
        }) => (
          <Row>
            {stream && (
              <Col xs={12}>
                <h3>{name}</h3>
                <video playsInline muted ref={myVideo} autoPlay />
              </Col>
            )}

            {stream ? (
              <Button onClick={stopCamera}>Turn off camera</Button>
            ) : (
              <Button onClick={startCamera}>Turn on camera</Button>
            )}

            {callAccepted && !callEnded && (
              <Button onClick={leaveCall}>Hang up</Button>
            )}
          </Row>
        )}
      </SocketContext.Consumer>
    )
  }
}
