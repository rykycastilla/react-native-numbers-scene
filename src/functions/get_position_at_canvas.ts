import Coordinates from '../types/Coordinates'

function getPositionAtCanvas( $canvas:HTMLCanvasElement, event:PointerEvent ): Coordinates {
  const canvasLayout: DOMRect = $canvas.getBoundingClientRect(),
    x: number = event.clientX - canvasLayout.left,
    y: number = event.clientY - canvasLayout.top
  return { x, y }
}

export default getPositionAtCanvas