import types from "./types"

const down = key => ({ type: types.DOWN, key });
const up   = key => ({ type: types.UP, key });

export default { down, up }
