import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  position: relative;
  padding: 0;
  height: calc(100vh - 60px - 2rem);

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }

  .about {
    width: 100%;
    height: 100%;
    border: none;
  }
`

export const About = () => {
  return (
    <Section className="section">
      <iframe className="about" src="embed/about-embed.html" title="about" />
    </Section>
  )
}
