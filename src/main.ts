import getScene from './functions/get_scene.js'
import Item from './classes/Item.js'

async function main() {
  const $scene: HTMLCanvasElement = await getScene(),
    scene: CanvasRenderingContext2D = $scene.getContext( '2d' )
  const item = new Item( 1, '#CC0000', 250, 100, 100 )
  Item.print( item, scene )
}

main()