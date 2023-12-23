const REFERENCE = 1000,
  RES = 1440  // Screen resolution

// Calc the true resolution based on the reference
function res( part:number ): number {
  const result: number = part / REFERENCE * RES
  return Math.round( result )
}

export default res