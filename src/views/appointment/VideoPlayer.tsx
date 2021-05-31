import React from 'react'
import { SocketContext } from '../../socket/SocketContext'
import { Button } from 'antd'
import styled from 'styled-components'
import {
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
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
    top: 0.5rem;
    left: 0.25rem;
    display: flex;
    flex-direction: column;

    gap: 0.5rem;
  }

  .video-offline {
    color: red;
    background: linear-gradient(
      to top left,
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
    this.context.startMedia()
  }

  componentWillUnmount() {
    this.context.stopMedia()
  }

  render() {
    return (
      <SocketContext.Consumer>
        {({
          stream,
          myVideo,
          userVideo,
          toggleVideo,
          videoOn,
          toggleAudio,
          audioOn,
          callInProgress,
        }) => (
          <Section>
            <div className="video-container">
              <div className="opponent-video-wrapper center">
                {callInProgress ? (
                  <video
                    className="opponent-video"
                    playsInline
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
                <Button
                  shape="circle"
                  icon={
                    videoOn ? (
                      <VideoCameraOutlined />
                    ) : (
                      <span className="video-offline">
                        <VideoCameraOutlined />
                      </span>
                    )
                  }
                  onClick={toggleVideo}
                />

                <Button
                  shape="circle"
                  icon={
                    audioOn ? (
                      <AudioOutlined />
                    ) : (
                      <AudioMutedOutlined style={{ color: 'red' }} />
                    )
                  }
                  onClick={toggleAudio}
                />
              </div>
            </div>
          </Section>
        )}
      </SocketContext.Consumer>
    )
  }
}
