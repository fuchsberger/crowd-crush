import { createStore, applyMiddleware, combineReducers } from "redux"
import thunkMiddleware from "redux-thunk"
import * as reducers from "./modules"

const rootReducer = combineReducers( reducers );
const middlewares = [ thunkMiddleware ];

// show redux debugger in dev mode
if (window.debug) {
  const { createLogger } = require('redux-logger');
  const loggerMiddleware = createLogger({
    collapsed: true,
    timestamp: false,
    // do not show certain events in logger
    predicate: (_getState, action) => ![
      'sim/CHANGE_PLAYER_STATE',
      'sim/TICK',
      'keys/KEY_DOWN',
      'keys/KEY_UP',
      'sessions/START_OPERATION'
    ].includes(action.type)
  });
  middlewares.push(loggerMiddleware);
}

const store = createStore( rootReducer, applyMiddleware(...middlewares) );

export default store;
