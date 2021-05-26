import React from 'react'
import { SocketContext } from '../../socket/SocketContext'
import { Button, Col, Row } from 'antd'
import styled from 'styled-components'

const Section = styled.section`
  .video-container {
    position: relative;
  }

  .opponent-video {
    max-width: 100%;
    max-height: 100%;

    &-wrapper {
      width: 100%;
      background-color: blue;
      aspect-ratio: 16/9;
      max-height: 100%;
    }
  }

  .my-video {
    max-width: 100%;

    &-wrapper {
      background-color: red;
      position: absolute;
      z-index: 999;
      bottom: 12px;
      right: 12px;
      max-width: 20%;
    }
  }

  .video-controllers {
    position: absolute;
    top: 0;
    left: 0;
  }
`

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
          <Section>
            <div className="video-container">
              <div className="opponent-video-wrapper center">
                {callAccepted && !callEnded && (
                  <video
                    className="opponent-video"
                    playsInline
                    muted
                    ref={userVideo}
                    autoPlay
                  />
                )}

                {stream && (
                  <div className="my-video-wrapper">
                    <video
                      className="my-video"
                      playsInline
                      muted
                      ref={myVideo}
                      autoPlay
                    />
                  </div>
                )}
              </div>
              <div className="video-controllers">
                {stream ? (
                  <Button onClick={stopCamera}>Turn off camera</Button>
                ) : (
                  <Button onClick={startCamera}>Turn on camera</Button>
                )}

                {call && (
                  <Button onClick={() => answerCall()}>전화 받기</Button>
                )}

                {callAccepted && !callEnded && (
                  <Button onClick={leaveCall}>Hang up</Button>
                )}

                {user && <Button onClick={() => startCall()}>전화 걸기</Button>}
                <Button onClick={() => test()}>테스터</Button>
              </div>
            </div>
          </Section>
        )}
      </SocketContext.Consumer>
    )
  }
}
