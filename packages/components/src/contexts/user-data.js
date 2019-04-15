import React from 'react'
let UserDataContext = React.createContext()

const initialState = {
  todos: []
}

function reducer(state, action) {
  switch (action.type) {
    case "INIT_STATE":
      return action.payload
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (action.payload.id === todo.id)
            return { ...todo, ...action.payload }
          return todo
        })
      }
    case "TOGGLE_COMPLETED":
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (action.payload === todo.id)
            return { ...todo, completed: !todo.completed }
          return todo
        })
      }
    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      }
    default:
      return state
  }
}

function UserDataContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const value = { state, dispatch }

  return (
    <UserDataContext.Provider value={value}>
      {props.children}
    </UserDataContext.Provider>
  )
}

const UserDataContextConsumer = UserDataContext.Consumer

export { UserDataContext, UserDataContextProvider, UserDataContextConsumer }
