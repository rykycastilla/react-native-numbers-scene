interface CanvasTextDims {
  width: number,
  height: number,
}

// Return dimensions of an specific text in a canvas
function getCanvasTxtDims( text:string, ctx:CanvasRenderingContext2D ): CanvasTextDims {
  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText( text )
  const height: number = actualBoundingBoxAscent + actualBoundingBoxDescent
  return { width, height }
}

export default getCanvasTxtDims