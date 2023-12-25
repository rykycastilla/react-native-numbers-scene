import Axis from '../enums/Axis.js'
import Board from '../classes/Board'
import Direction from '../enums/SpacialDirection.js'
import moveAnimation from '../functions/move_animation.js'
import res from '../functions/res.js'
import Tag from './Tag.js'

// Manage Board items visibility and functionality

class Item {
  
  private readonly size: number
  private readonly radius: number
  private readonly fontSize: number
  private x = 0
  private y = 0
  private rawX = 0
  private rawY = 0

  // Change the position (saving reference resolution)
  public setPosition( x:number, y:number ) {
    // Saving reference
    this.rawX = x
    this.rawY = y
    // Saving real resolution (canvas)
    this.x = res( this.rawX )
    this.y = res( this.rawY )
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
    this.setPosition( initX, initY )
  }

  // Make an animated move to the specified direction
  public async moveTo( pixels:number, direction:Direction, board:Board ) {
    board.pause()  // Avoiding board interaction
    if( direction === Direction.UP ) {
      await moveAnimation( pixels * -1, Axis.Y, this )
    }
    else if( direction === Direction.LEFT ) {
      await moveAnimation( pixels * -1, Axis.X, this )
    }
    else if( direction === Direction.RIGHT ) {
      await moveAnimation( pixels, Axis.X, this )
    }
    else if( direction === Direction.DOWN ) {
      await moveAnimation( pixels, Axis.Y, this )
    }
    board.play()  // Allowing board interaction again
  }

  get refX(): number {
    return this.rawX
  }

  get refY(): number {
    return this.rawY
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