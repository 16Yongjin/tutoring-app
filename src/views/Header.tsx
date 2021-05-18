import React, { useState } from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { store } from '../store'

const Header = styled.header`
  height: 4rem;
  padding: 0 1rem;

  .icon {
    margin-top: 0.25rem;
    height: 3.5rem;
    width: 3.5rem;
  }

  .container {
    display: flex;
    justify-content: space-between;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 4rem;
  }

  .link {
    color: black;
    font-size: 1rem;
  }

  .action {
    display: flex;
    align-items: center;

    &-name {
      font-weight: 500;
    }
  }
`

export const MainHeader = observer(() => {
  const [userStore] = useState(store.userStore)

  return (
    <Header>
      <div className="container">
        <Link to="/">
          <img className="icon" src="/icon.png" alt="icon" />
        </Link>
        <nav className="nav">
          <Link className="link" to="/">
            Home
          </Link>
          <Link className="link" to="/about">
            About
          </Link>
          <Link className="link" to="/materials">
            Materials
          </Link>
          <Link className="link" to="/users">
            Tutors
          </Link>
        </nav>
        <div className="action">
          {userStore.user ? (
            <Button shape="round" onClick={() => userStore.logout()}>
              <span className="action-name">Log out</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button shape="round">
                <span className="action-name">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Header>
  )
})
