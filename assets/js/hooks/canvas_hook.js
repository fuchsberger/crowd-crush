const getPixelRatio = context => {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
}

const resize = (canvas, ratio) => {
  canvas.width = window.innerWidth * ratio;
  canvas.height = (window.innerHeight - 112) * ratio;
  canvas.style.position = 'fixed'
  canvas.style.top = '56px'
  canvas.style.left = '0'
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight - 112}px`;
}

export default {
  mounted() {
    let canvas = this.el
    let context = canvas.getContext("2d")
    let ratio = getPixelRatio(context)

    Object.assign(this, { canvas, context, ratio })
  },
  updated() {
    let { canvas, context, ratio } = this;

    // should be done in mount but for some reason properties don't persist there
    resize(canvas, ratio)

    let i = JSON.parse(canvas.dataset.i);
    let halfHeight = canvas.height / 2;
    let halfWidth = canvas.width / 2;
    let smallerHalf = Math.min(halfHeight, halfWidth);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(128, 0, 255, 1)";
    context.beginPath();
    context.arc(
      halfWidth + (Math.cos(i) * smallerHalf) / 2,
      halfHeight + (Math.sin(i) * smallerHalf) / 2,
      smallerHalf / 16,
      0,
      2 * Math.PI
    );
    context.fill();

  }
}
