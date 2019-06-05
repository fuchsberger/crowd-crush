import { createStore, applyMiddleware, combineReducers } from "redux"
import thunkMiddleware from "redux-thunk"
import * as reducers from "./modules"

const rootReducer = combineReducers( reducers );
const middlewares = [ thunkMiddleware ];

// show redux debugger in dev mode
if (window.debug) {
  const { createLogger } = require('redux-logger');
  const loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true,
    // do not show certain events in logger
    predicate: (_getState, action) => ![
      'sim/TICK', 'keys/KEY_DOWN', 'keys/KEY_UP'
    ].includes(action.type)
  });
  middlewares.push(loggerMiddleware);
}

const store = createStore( rootReducer, applyMiddleware(...middlewares) );

export default store;
