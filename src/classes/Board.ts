import Coordinates from '../types/Coordinates'
import Direction from '../enums/SpacialDirection.js'
import Item from './Item.js'
import itemColors from '../data/item_colors.js'
import getPositionAtCanvas from '../functions/get_position_at_canvas.js'
import res, { parseResToRef } from '../functions/res.js'
import resolveAsMatrix from '../functions/resolve_as_matrix.js'
import { ITEM_SIZE, MARGIN } from '../data/styles.js'
import { REFERENCE as SCENE_TOP } from '../data/constants.js'

// Board can control the position of the items, its order and the flow of the scene animation

class Board {

  private readonly GRID = 4
  private PIXELS_TO_NEXT_ITEM = ITEM_SIZE + MARGIN
  private paused = false
  private readonly items: Item[] = []

  // Calc the position in the scene using coordinates
  private calcPosition( row:number, column:number ): Coordinates {
    const x: number = ( row + 1 ) * MARGIN + row * ITEM_SIZE,
      y: number = ( column + 1 ) * MARGIN + column * ITEM_SIZE
    return { x, y }

  }

  // Detect an item in this position
  private detectItem( x:number, y:number ): Item | null {
    let item: Item | null = null
    for( const thisItem of this.items ) {
      // Using reference resolution
      const { refX, refY } = thisItem
      // Checking if these coordinates are between any item
      const itemTopX: number = refX + ITEM_SIZE,
        itemTopY: number = refY + ITEM_SIZE  // Calculatin the end of every item
      const sameX: boolean = ( refX <= x ) && ( x <= itemTopX ),
        sameY: boolean = ( refY <= y ) && ( y <= itemTopY )  // Checking if x;y are between this
      if( sameX && sameY ) {
        // Finding the item
        item = thisItem
        break
      }
    }
    return item
  }

  // Update frames of the canvas (creating an animation)
  private runFrames( scene:CanvasRenderingContext2D ) {
    const fixedSceneTop: number = res( SCENE_TOP )
    scene.clearRect( 0, 0, fixedSceneTop, fixedSceneTop )  // Erasing last frame
    for( const item of this.items ) {
      Item.print( item, scene )  // Drawing items
    }
    requestAnimationFrame( () => this.runFrames( scene ) )
  }

  // Detects a blank space in this position (x;y)
  private detectBlank( x:number, y:number ): boolean {
    // Checking if the coordinates are inside the scene
    const xInScene: boolean = ( 0 <= x ) && ( x <= SCENE_TOP ),
      yInScene: boolean = ( 0 <= y ) && ( y <= SCENE_TOP )
    if( !xInScene || !yInScene ) { return false }  // Filtering "out of scene"
    // Returning if there are no an item in this position
    return this.detectItem( x, y ) === null
  }

  // Detects a blank space adjacent to this item
  private checkAdjacentBlankSpace( item:Item ): Direction | null {
    const { PIXELS_TO_NEXT_ITEM } = this
    const { refX, refY } = item
    // Testing all sides of the item
    const up: boolean = this.detectBlank( refX, refY - PIXELS_TO_NEXT_ITEM ),
      left: boolean = this.detectBlank( refX - PIXELS_TO_NEXT_ITEM, refY ),
      right: boolean = this.detectBlank( refX + PIXELS_TO_NEXT_ITEM, refY ),
      down: boolean = this.detectBlank( refX, refY + PIXELS_TO_NEXT_ITEM )
    let direction: Direction | null = null  // null if it is surrounded
    // Inicating the direction of the detected blank space (if it exists)
    if( up ) { direction = Direction.UP }
    else if( left ) { direction = Direction.LEFT }
    else if( right ) { direction = Direction.RIGHT }
    else if( down ) { direction = Direction.DOWN }
    return direction
  }

  // Represents a single "touch" in the board
  private touch = ( event:PointerEvent ) => {
    if( this.paused ) { return }  // Avoiding touches
    let { x, y } = getPositionAtCanvas( this.$scene, event )
    const maxRes: number = this.$scene.clientWidth
    // Converting the canvas resolution to the reference resolution
    x = parseResToRef( x, maxRes )
    y = parseResToRef( y, maxRes )
    const item: Item | null = this.detectItem( x, y )
    if( item ) {
      const direction: Direction | null = this.checkAdjacentBlankSpace( item )
      if( !direction ) {
        // Feedback if it is surrounded
        const movements: Direction[] = [ Direction.RIGHT, Direction.LEFT, Direction.RIGHT, Direction.LEFT ]
        item.shake( 160, 6, movements, this )
      }
      else {
        item.moveTo( this.PIXELS_TO_NEXT_ITEM, direction, this )
      }
    }
  }
  
  constructor(
    private readonly $scene: HTMLCanvasElement
  ) {
    const scene: CanvasRenderingContext2D = $scene.getContext( '2d' )
    for( let _this = 0; _this < itemColors.length; _this++ ) {
      const color: string = itemColors[ _this ]
      const { x:row, y:column } = resolveAsMatrix( _this, this.GRID )
      const { x, y } = this.calcPosition( row, column )
      const item = new Item( _this + 1, color, ITEM_SIZE, x, y )
      this.items.push( item )
    }
    this.runFrames( scene )
    $scene.addEventListener( 'click', this.touch )
  }

  // Allow board modifications
  public play() {
    this.paused = false
  }

  // Avoid board modifications
  public pause() {
    this.paused = true
  }

}

export default Board