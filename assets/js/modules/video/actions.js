import types from "./types"

const add = video => ({ type: types.ADD, video })
const load = videos => ({ type: types.LOAD, videos });
const remove = id => ({ type: types.REMOVE, id });
const modify = video => ({ type: types.MODIFY, video })
const sort = columnName => ({ type: types.SORT, columnName });

export default {
  add,
  load,
  modify,
  remove,
  sort
};
