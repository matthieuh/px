import React from 'react'
import { UserDataContextProvider } from './contexts/user-data'
import Notes from './components/Notes'

export default () => {
  return (
    <UserDataContextProvider>
      <Notes />
    </UserDataContextProvider>
  )
}
