import types from "./types"

const all = videos => ({ type: types.ALL, videos });
const deleteAll = videos => ({ type: types.DELETE_ALL, videos });

export default {
  all,
  deleteAll
};