import Axis from '../enums/Axis.js'
import Direction from '../enums/Direction.js'
import Item from '../classes/Item'
import nextFrame from './next_frame.js'
import safeRest from './safe_rest.js'

type MoveFunction = ( pixels:number ) => void

// Returns a function with the capability to make a move
function createMoveFunction( item:Item, axis:Axis ): MoveFunction {
  // It use "axis" to identify "x" or "y"
  const moveFunction = ( pixels:number ) => {
    if( axis === Axis.X ) {
      // Adding the pixels for this axis to the current position
      const newX: number = item.refX + pixels
      item.setPosition( newX, item.refY )
    }
    else if( axis === Axis.Y ) {
      // ...
      const newY: number = item.refY + pixels
      item.setPosition( item.refX, newY )
    }
  }
  return moveFunction
}

type FixerFunction = () => void

// Returns a function to force the final position of the animation
// * It is used to avoid incompatibilities caused by the "float numbers" inaccuracies
function createFixerFunction( pixels:number, axis:Axis, item:Item ): FixerFunction {
  let { refX:x, refY:y } = item
  // Precalculating final position
  if( axis === Axis.X ) { x += pixels }
  else if( axis === Axis.Y ) { y += pixels }
  const fixerFunction = () => {
    item.setPosition( x, y )  // Changing position
  }
  return fixerFunction
}

interface RunFramesParams {
  direction: Direction,
  duration: number,
  pixelsDifference: number,
  restProgress: number,
  previousFrameTime: number,
  moveFunction: MoveFunction,
  fixerFunction: FixerFunction,
}

async function runFrames( params:RunFramesParams ) {
  const { direction, duration, pixelsDifference, moveFunction, fixerFunction } = params
  let { previousFrameTime, restProgress } = params
  // Running frames
  while( restProgress > 0 ) {
    // Calculating lapse from the previous frame to the current
    const frameLapse = Date.now() - previousFrameTime
    previousFrameTime = Date.now()  // Updating "this frame" time to calculate "lapse" in the next frame
    // Calculating pixels needed to move, based on the frame lapse
    const frameProgress: number = pixelsDifference / duration * frameLapse
    let allowedProgress: number
    [ allowedProgress, restProgress ] = safeRest( restProgress, frameProgress )  //  Using the remmaining pixels to go
    // Moving and waiting to the next frame
    moveFunction( allowedProgress * direction )
    await nextFrame()
  }
  fixerFunction()  // Forcing right final position
}

interface AnimateParams {
  pixels: number,
  duration: number,
  moveFunction:MoveFunction,
  fixerFunction: FixerFunction,
}


// Prepare and start the animation
async function animate( params:AnimateParams ) {
  const { pixels, duration, moveFunction, fixerFunction } = params 
  // Building usefull parameters
  const direction: number = pixels < 0
    ? Direction.NEGATIVE
    : Direction.POSITIVE
  const pixelsDifference: number = Math.abs( pixels ),
    restProgress: number = pixelsDifference,
    previousFrameTime: number = Date.now()
  // Starting animation
  const runFramesParams: RunFramesParams = {
    direction,
    duration,
    pixelsDifference,
    restProgress,
    previousFrameTime,
    moveFunction,
    fixerFunction
  }
  await runFrames( runFramesParams )
}

async function moveAnimation( pixels:number, axis:Axis, item:Item, duration=200 ) {
  const moveFunction: MoveFunction = createMoveFunction( item, axis ),
    fixerFunction: FixerFunction = createFixerFunction( pixels, axis, item )
  await animate( { pixels, duration, moveFunction, fixerFunction } )
}

export default moveAnimation