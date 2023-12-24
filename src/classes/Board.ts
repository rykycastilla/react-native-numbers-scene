import Coordinates from '../types/Coordinates'
import Item from './Item.js'
import itemColors from '../data/item_colors.js'
import resolveAsMatrix from '../functions/resolve_as_matrix.js'
import styles from '../data/styles.js'

// Board can control the position of the items, its order and the flow of the scene animation

class Board {

  private readonly GRID = 4
  private readonly items: Item[] = []

  // Calc the position in the scene using coordinates
  private calcPosition( row:number, column:number ): Coordinates {
    const x: number = ( row + 1 ) * styles.MARGIN + row * styles.ITEM_SIZE,
      y: number = ( column + 1 ) * styles.MARGIN + column * styles.ITEM_SIZE
    return { x, y }

  }

  // Update frames of the canvas (creating an animation)
  private runFrames( scene:CanvasRenderingContext2D ) {
    for( const item of this.items ) {
      Item.print( item, scene )
    }
    requestAnimationFrame( () => this.runFrames( scene ) )
  }
  
  constructor( scene:CanvasRenderingContext2D ) {
    for( let _this = 0; _this < itemColors.length; _this++ ) {
      const color: string = itemColors[ _this ]
      const { x:row, y:column } = resolveAsMatrix( _this, this.GRID )
      const { x, y } = this.calcPosition( row, column )
      const item = new Item( _this + 1, color, styles.ITEM_SIZE, x, y )
      this.items.push( item )
    }
    this.runFrames( scene )
  }

}

export default Board