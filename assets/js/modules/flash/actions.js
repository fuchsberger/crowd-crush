import types from "./types"

const clear = () => ({ type: types.CLEAR });
const error = ( msg ) => ({ type: types.ERROR, msg });
const info = ( msg ) => ({ type: types.INFO, msg });

export default {
  clear,
  error,
  info
};