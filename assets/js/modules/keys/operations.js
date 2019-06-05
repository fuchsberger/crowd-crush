import actions from "./actions"

// sync operations
const down = keyCode => {
  return (dispatch) => {
    const key = getKey(keyCode);
    if(key) dispatch(actions.down(key));
  }
}

const up = keyCode => {
  return (dispatch) => {
    const key = getKey(keyCode);
    if(key) dispatch(actions.up(key));
  }
}

// HELPERS

function getKey( keyCode ) {
  switch (keyCode) {
    case 81: return 'Q';
    case 87: return 'W';
    case 69: return 'E';
    case 65: return 'A';
    case 83: return 'S';
    case 68: return 'D';
    case 90: return 'Z';
    case 88: return 'X';
    case 67: return 'C';
    case 16: return 'SHIFT';
    case 17: return 'CTRL';
    case 32: return 'SPACE';
    default: return null;
  }
}

export default { down, up };
