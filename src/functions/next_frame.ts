// It resolves itself when a new frame is ready to b drawed
async function nextFrame() {
  const delay: Promise<number> = new Promise( resolve => {
    requestAnimationFrame( resolve )
  } )
  await delay
}

export default nextFrame