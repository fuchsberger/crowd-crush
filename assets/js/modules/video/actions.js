import types from "./types"

const add = video => ({ type: types.ADD, video })
const load = videos => ({ type: types.LOAD, videos });
const deleteAll = videos => ({ type: types.DELETE_ALL, videos });
const modify = video => ({ type: types.MODIFY, video })
const sort = columnName => ({ type: types.SORT, columnName });

export default {
  add,
  load,
  deleteAll,
  modify,
  sort
};
