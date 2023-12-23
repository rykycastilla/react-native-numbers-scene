// Return the "first side size" to center an element
function center( childSize:number, parentSize:number ) {
  const side: number = ( parentSize - childSize ) / 2
  return Math.round( side )
}

export default center