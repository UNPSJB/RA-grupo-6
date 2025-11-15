import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

interface Action {
  type: string;
  [key: string]: any;
}

const changeState = (state = initialState, action: Action) => {
  const { type, ...rest } = action;
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
