import IPos from '../models/IPos.model'
import Picture from '../Picture'

export function getMousePosition(
  elem: HTMLElement,
  event: any,
  scale: number
): IPos {
  const { clientX, clientY } = event
  const { left, top } = elem.getBoundingClientRect()
  const newPos = {
    x: Math.floor((clientX - left) / scale),
    y: Math.floor((clientY - top) / scale)
  }

  return newPos
}

export function drawOnCanvas(
  picture: Picture,
  canvas: HTMLCanvasElement,
  scale: number
) {
  const cx: CanvasRenderingContext2D = canvas.getContext('2d')!
  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y)
      cx.fillRect(x * scale, y * scale, scale, scale)
    }
  }
}

export function createNode(type: string, props: any, ...children: any): any {
  const dom = document.createElement(type)
  if (props) {
    Object.assign(dom, props)
  }
  for (const child of children) {
    if (typeof child !== 'string') {
      dom.appendChild(child)
    } else {
      dom.appendChild(document.createTextNode(child))
    }
  }
  return dom
}

export function pictureFromImage(image: HTMLImageElement) {
  const width = Math.min(100, image.width)
  const height = Math.min(100, image.height)
  const canvas = createNode('canvas', { width, height })
  const cx: CanvasRenderingContext2D = canvas.getContext('2d')
  cx.drawImage(image, 0, 0)
  const pixels = []
  const { data } = cx.getImageData(0, 0, width, height)

  function hex(n: number) {
    return n.toString(16).padStart(2, '0')
  }
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = data.slice(i, i + 3)
    pixels.push('#' + hex(r) + hex(g) + hex(b))
  }
  return new Picture(width, height, pixels)
}
