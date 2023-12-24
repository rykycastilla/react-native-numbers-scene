import Coordinates from '../types/Coordinates'

// Convert Natural numbers to matrix coordinates
function resolveAsMatrix( num:number, topX:number ): Coordinates {
  num = Math.round( num ) ; num = Math.abs( num )  // Converting to a valid input (Natural number)
  const y: number = Math.floor( num / topX ),
    x: number = num % topX
  return { x, y }
}

export default resolveAsMatrix