import React from 'react'
import Router from './Router'
import './App.css'
import { QueryClientProvider } from 'react-query'
import { queryClient } from './query/queryClient'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  )
}

export default App
