import { REFERENCE, RES } from '../data/constants.js' 

// Calc the reference value for this resolution
function parseResToRef( res:number, maxRes:number ): number {
  const result: number = res / maxRes * REFERENCE
  return Math.round( result )
}

// Calc the true resolution based on the reference
function res( part:number ): number {
  const result: number = part / REFERENCE * RES
  return Math.round( result )
}

export default res
export { parseResToRef }