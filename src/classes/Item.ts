import Axis from '../enums/Axis.js'
import res from '../functions/res.js'
import Tag from './Tag.js'

// Manage Board items visibility and functionality

class Item {
  
  private readonly size: number
  private readonly radius: number
  private readonly fontSize: number
  private x = 0
  private y = 0

  // Change the position of an specific axis
  private move( pixels:number, axis:Axis ) {
    pixels = res( pixels )  // Pixels conversion
    // Moving
    if( axis === Axis.X ) { this.x += pixels }
    else if( axis === Axis.Y ) { this.y += pixels }
  }

  constructor(
    public readonly tag: number,
    private readonly color: string,
    size: number,
    initX: number,
    initY: number,
  ) {
    // Setting body properties
    this.size = res( size )
    this.radius = res( size / 5 )
    this.fontSize = res( size / 2.23 )
    // Setting coordinates
    this.move( initX, Axis.X )
    this.move( initY, Axis.Y )
  }

  // Build the background of the item
  private static printBody(  item:Item, scene:CanvasRenderingContext2D ) {
    scene.beginPath()
    scene.fillStyle = item.color
    scene.roundRect( item.x, item.y, item.size, item.size, item.radius )
    scene.fill()
  }

  // Build the tag of the item
  private static printTag( item:Item, scene:CanvasRenderingContext2D ) {
    scene.beginPath()
    // Setting text style
    scene.fillStyle = '#F3F3F3'
    scene.textBaseline = 'top'
    scene.font = `bold ${ item.fontSize }px comfortaa`
    const tag = new Tag( item.tag, item.size, item.x, item.y, scene )  // tag text layout
    scene.fillText( tag.value, tag.x, tag.y )  // Printing
  }

  // Generate a new Item on the canvas
  public static print( item:Item, scene:CanvasRenderingContext2D ) {
    this.printBody( item, scene )
    this.printTag( item, scene )
  }

}

export default Item