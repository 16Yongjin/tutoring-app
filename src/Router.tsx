import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {
  About,
  Appointment,
  CourseDetail,
  Home,
  MainHeader,
  MaterialDetail,
  Materials,
  Signup,
  TutorDetail,
  TutorLogin,
  Tutors,
  TutorSignup,
  UserLogin,
} from './views'
import './App.css'
import { AdminDashboard } from './views/admin'
import { observer } from 'mobx-react-lite'
import { store } from './store'
import { Role } from './api/auth/entity'

const Router = () => {
  const isUser = store.userStore.user?.role === Role.USER

  return (
    <BrowserRouter>
      <div>
        <MainHeader />

        <Switch>
          <Route path="/about">
            <About />
          </Route>

          <Route path="/materials/courses/:courseId">
            <CourseDetail />
          </Route>

          <Route path="/materials/:materialId">
            <MaterialDetail />
          </Route>

          <Route path="/materials">
            <Materials />
          </Route>

          <Route path="/tutors/login">
            <TutorLogin />
          </Route>

          <Route path="/tutors/signup">
            <TutorSignup />
          </Route>

          <Route path="/appointments/:appointmentId">
            <Appointment />
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

          <Route path="/tutors/:tutorId">
            <TutorDetail />
          </Route>

          {!isUser && (
            <Route path="/tutors">
              <Tutors />
            </Route>
          )}

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default observer(Router)
