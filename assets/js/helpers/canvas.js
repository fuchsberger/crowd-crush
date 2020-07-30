const TOPBAR_HEIGHT = 56
const BOTTOM_HEIGHT = 47

export const resize = (aspectratio, canvas) => {

  const screen_w = window.innerWidth
  const screen_h = window.innerHeight - (TOPBAR_HEIGHT + BOTTOM_HEIGHT)

  let w = screen_w
  let h = screen_h

  // scale either width or height depending on aspectratio
  if (w / h > aspectratio) w = h * aspectratio
  else h = w / aspectratio

  // calculate left/top offset
  const t = h < screen_h ? TOPBAR_HEIGHT + (screen_h - h) / 2 : TOPBAR_HEIGHT
  const l = w < screen_w ? (screen_w - w) / 2 : 0

  // update canvas
  canvas.width = w;
  canvas.height = h;
  canvas.style.position = 'fixed'
  canvas.style.top = `${t}px`
  canvas.style.left = `${l}px`
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
}
