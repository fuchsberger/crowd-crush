import types from "./types"

const load = (videos) => ({ type: types.LOAD, videos });
const deleteAll = videos => ({ type: types.DELETE_ALL, videos });
const sort = columnName => ({ type: types.SORT, columnName });

export default {
  load,
  deleteAll,
  sort
};
