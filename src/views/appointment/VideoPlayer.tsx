import React from 'react'
import { SocketContext } from '../../socket/SocketContext'
import { Button } from 'antd'
import styled from 'styled-components'
import { VideoCameraOutlined } from '@ant-design/icons'
import { Appointment } from '../../api/appointments/entity'

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
      max-height: 100%;
      background-color: #444;
    }

    &-thumbnail {
      border-radius: 50%;
      aspect-ratio: 1 / 1;
      background-position: center;
      background-size: cover;
      height: 80%;
    }
  }

  .my-video {
    max-width: 100%;
    max-height: 100%;
    border: 2px solid #eee;
    border-radius: 5px;

    &-wrapper {
      position: absolute;
      z-index: 999;
      bottom: 6px;
      right: 6px;
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

export class VideoPlayer extends React.Component<{
  id: string
  appointment: Appointment
}> {
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
          callInProgress,
          startCall,
          answerCall,
          leaveCall,
          test,
        }) => (
          <Section>
            <div className="video-container">
              <div className="opponent-video-wrapper center">
                {callInProgress ? (
                  <video
                    className="opponent-video"
                    playsInline
                    muted
                    ref={userVideo}
                    autoPlay
                  />
                ) : (
                  <div
                    className="opponent-video center"
                    style={{
                      height: '100%',
                    }}
                  >
                    <div
                      className="opponent-video-thumbnail"
                      style={{
                        backgroundImage: `url(${this.props.appointment.tutor.image})`,
                      }}
                    ></div>
                  </div>
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
