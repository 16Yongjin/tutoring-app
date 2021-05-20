import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;

  .badge {
    font-size: 0.8rem;
    padding: 0 0.4rem;
    text-align: center;
    display: inline;
    color: white;
    min-height: 1.25rem;
  }

  @media screen and (max-width: 576px) {
    .adaptive {
      display: none;
    }
  }
`
const levels = [
  'Beginner',
  'Beginner',
  'Beginner',
  'Beginner',
  'Intermediate',
  'Intermediate',
  'Intermediate',
  'Advanced',
  'Advanced',
  'Proficient',
  'Proficient',
]

const ColorScheme: Record<string, string> = {
  Beginner: '#0E9DFA',
  Intermediate: '#AAD958',
  Advanced: '#FE7423',
  Proficient: '#FE3955',
}

export const LevelBadge = ({ level, xs }: { level: number; xs?: boolean }) => {
  const levelString = levels[level]
  const backgroundColor = ColorScheme[levelString]

  return (
    <Wrapper>
      <div className="badge" style={{ backgroundColor }}>
        <div>{level}</div>
      </div>
      <div className={xs ? 'is-hidden-mobile' : ''}>{levelString}</div>
    </Wrapper>
  )
}
