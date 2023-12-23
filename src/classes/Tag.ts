import center from '../functions/center.js'
import getCanvasTxtDims from '../functions/get_canvas_txt_dims.js'

// This object build layout properties of the current item tag  

class Tag {

  value: string
  x: number
  y: number

  constructor( itemTag:number, itemSize:number, itemX:number, itemY:number, scene:CanvasRenderingContext2D ) {
    this.value = String( itemTag )
    const { width:tagWidth, height:tagHeight } = getCanvasTxtDims( this.value, scene )
    this.x = itemX + center( tagWidth, itemSize ),
    this.y = itemY + center( tagHeight, itemSize )
  }

}

export default Tag