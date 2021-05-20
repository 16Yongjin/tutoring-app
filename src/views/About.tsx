import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  position: relative;
  padding: 4rem 2rem;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const About = () => {
  return (
    <Section>
      <div className="container">
        <header className="title">
          <h2 className="title">About</h2>
        </header>
      </div>
    </Section>
  )
}
