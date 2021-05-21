import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const Dashboard = () => {
  return (
    <Section className="section">
      <div className="container">
        <header>
          <h2 className="title">Dashboard</h2>
        </header>
      </div>
    </Section>
  )
}
