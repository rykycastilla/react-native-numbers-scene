// Rest "b" to "a" (if the result is not 0), returning everytime an admissible value
function safeRest( a:number, b:number ): [ number, number ] {
  const allowedRest: number = ( a - b ) < 0
    ? a
    : b
  return [ allowedRest, a - allowedRest ]
}

export default safeRest