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

export const AdminDashboard = () => {
  return (
    <Section>
      <div className="container">
        <header>
          <h2 className="title">Dashboard</h2>
        </header>
      </div>
    </Section>
  )
}
