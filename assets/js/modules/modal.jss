// Action Types
const CLEAR_MODAL = 'crowd-crush/modal/CLEAR_MODAL';
const SET_MODAL = 'crowd-crush/modal/SET_MODAL';

// Reducer
const initialState = {
  error: null,
  info:  null,
  modal: null
};

export default function reducer(state = initialState, {
  type,
  preserve = false,
  ...modal
}) {
  switch (type) {
    case CLEAR_MODAL:
      return preserve ? { ...state, ...initialState } : { ...initialState }

    case SET_MODAL:
      return preserve ? { ...state, ...modal } : { ...initialState, ...modal }

    default: return state;
  }
}

// Sync Actions
export const clearModal = (preserve=false) => ({
  type: CLEAR_MODAL,
  preserve
});

export const modalError = (error = null) => ({
  type: SET_MODAL,
  preserve: true,
  error
});

export const modalInfo = (info = null) => ({
  type: SET_MODAL,
  preserve: true,
  info
});

export const showModal = (modal, opts = {}) => ({
  type: SET_MODAL,
  modal,
  ...opts
});