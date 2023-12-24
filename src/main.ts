import Board from './classes/Board.js'
import getScene from './functions/get_scene.js'

async function main() {
  const $scene: HTMLCanvasElement = await getScene(),
    scene: CanvasRenderingContext2D = $scene.getContext( '2d' )
  new Board( scene )
}

main()