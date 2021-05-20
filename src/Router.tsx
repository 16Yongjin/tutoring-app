import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {
  About,
  CourseDetail,
  Home,
  Login,
  MainHeader,
  MaterialDetail,
  Materials,
  Signup,
  Tutor,
  Tutors,
} from './views'
import './App.css'
import { AdminDashboard } from './views/admin'

const Router = () => {
  return (
    <BrowserRouter>
      <div>
        <MainHeader />

        <Switch>
          <Route path="/about">
            <About />
          </Route>

          <Route path="/materials/courses/:id">
            <CourseDetail />
          </Route>

          <Route path="/materials/:id">
            <MaterialDetail />
          </Route>

          <Route path="/materials">
            <Materials />
          </Route>

          <Route path="/tutors/:id">
            <Tutor />
          </Route>

          <Route path="/tutors">
            <Tutors />
          </Route>

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/signup">
            <Signup />
          </Route>

          <Route path="/admin">
            <AdminDashboard />
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default Router
