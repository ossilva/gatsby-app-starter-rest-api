import React, { useReducer } from 'react'
import Context from 'components/common/Context'
import userReducer from './userReducer'

export default ({ children }) => {
  const [user, dispatchUserAction] = useReducer(userReducer, {})

  return (
    <Context.Provider
      value={{
        user,
        dispatchUserAction,
      }}
    >
      {children}
    </Context.Provider>
  )
}
