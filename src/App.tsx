import React from 'react'
import Router from './Router'
import './App.css'
import { QueryClientProvider } from 'react-query'
import { queryClient } from './query/queryClient'
import { VideoContextProvider } from './socket/SocketContext'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <VideoContextProvider>
        <Router />
      </VideoContextProvider>
    </QueryClientProvider>
  )
}

export default App
