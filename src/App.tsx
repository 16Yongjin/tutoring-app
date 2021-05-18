import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { About, Home, Login, MainHeader, Materials } from './views'
import './App.css'

const App = () => {
  return (
    <Router>
      <div>
        <MainHeader />

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/materials">
            <Materials />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
