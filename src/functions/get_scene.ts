const loadDOM: Promise<void> = new Promise( resolve => {
  window.addEventListener( 'load', () => resolve() )
} )

// Load the scene from DOM
async function getScene(): Promise<HTMLCanvasElement> {
  await loadDOM
  return document.querySelector( '#scene' ) as HTMLCanvasElement
}

export default getScene