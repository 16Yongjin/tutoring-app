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
  TutorDashboard,
  TutorDetail,
  TutorLogin,
  Tutors,
  TutorSignup,
  UserLogin,
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

          <Route path="/tutor">
            <TutorDashboard />
          </Route>

          <Route path="/tutors/login">
            <TutorLogin />
          </Route>

          <Route path="/tutors/signup">
            <TutorSignup />
          </Route>

          <Route path="/tutors/:id">
            <TutorDetail />
          </Route>

          <Route path="/tutors">
            <Tutors />
          </Route>

          <Route exact path="/login">
            <UserLogin />
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
