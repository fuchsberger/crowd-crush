export const resize = (aspectratio, canvas) => {

  var context = canvas.getContext("2d")
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  const ratio = (window.devicePixelRatio || 1) / backingStore
  const screen_w = window.innerWidth * ratio
  const screen_h = (window.innerHeight - 103) * ratio
  let w = screen_w
  let h = screen_h

  // screen is wider than video -> fix height and get scaled width
  if (w / h > aspectratio) w = h * aspectratio
  else h = w / aspectratio

  // calculate left/top offset
  const t = h < screen_h ? 56 + (screen_h - h) / 2 : 56
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
