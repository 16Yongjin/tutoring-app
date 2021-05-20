import React, { useState } from 'react'
import { Button, Drawer } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { store } from '../store'
import { MenuOutlined } from '@ant-design/icons'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'

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

  @media screen and (max-width: 576px) {
    height: 3rem;

    .icon {
      margin-top: 0.25rem;
      height: 2.5rem;
      width: 2.5rem;
    }

    .nav {
      flex-direction: column;
      gap: 4rem;
    }

    .link {
      display: block;
      width: 100%;
    }
  }
`

export const MobileHeader = ({
  loggedIn,
  logout,
}: {
  loggedIn: boolean
  logout: Function
}) => {
  const [drawer, setDrawer] = useState(true)
  const closeDrawer = () => setDrawer(false)

  return (
    <Header>
      <div className="container center-y">
        <MenuOutlined onClick={() => setDrawer(true)} />
        <Drawer visible={drawer} onClose={closeDrawer} placement="left">
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
            <Link className="link" to="/tutors">
              Tutors
            </Link>
          </nav>
          <div className="action">
            {loggedIn ? (
              <Button shape="round" onClick={() => logout()}>
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
        </Drawer>
        <Link to="/">
          <img className="icon" src="/icon.png" alt="icon" />
        </Link>
      </div>
    </Header>
  )
}

export const LaptopHeader = ({
  loggedIn,
  logout,
}: {
  loggedIn: boolean
  logout: Function
}) => {
  return (
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
        <Link className="link" to="/tutors">
          Tutors
        </Link>
      </nav>
      <div className="action">
        {loggedIn ? (
          <Button shape="round" onClick={() => logout()}>
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
  )
}

export const MainHeader = observer(() => {
  const [userStore] = useState(store.userStore)
  const screens = useBreakpoint()

  return (
    <Header>
      {screens.xs ? (
        <MobileHeader
          loggedIn={!!userStore.user}
          logout={() => userStore.logout()}
        />
      ) : (
        <LaptopHeader
          loggedIn={!!userStore.user}
          logout={() => userStore.logout()}
        />
      )}
    </Header>
  )
})
