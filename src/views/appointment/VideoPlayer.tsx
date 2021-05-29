import React from 'react'
import { SocketContext } from '../../socket/SocketContext'
import { Button } from 'antd'
import styled from 'styled-components'
import { VideoCameraOutlined } from '@ant-design/icons'

const Section = styled.section`
  height: 100%;

  .video-container {
    position: relative;
    height: 100%;
  }

  .opponent-video {
    max-width: 100%;
    max-height: 100%;

    &-wrapper {
      height: 100%;
      width: 100%;
      background-color: blue;
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

  .video-offline {
    color: red;
    background: linear-gradient(
      to top right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) calc(50% - 1px),
      red 50%,
      rgba(0, 0, 0, 0) calc(50% + 1px),
      rgba(0, 0, 0, 0) 100%
    );
  }
`

export class VideoPlayer extends React.Component<{ id: string }> {
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
                  <Button
                    shape="circle"
                    icon={<VideoCameraOutlined />}
                    onClick={stopCamera}
                  />
                ) : (
                  <Button
                    shape="circle"
                    icon={
                      <span className="video-offline">
                        <VideoCameraOutlined />
                      </span>
                    }
                    onClick={startCamera}
                  />
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
