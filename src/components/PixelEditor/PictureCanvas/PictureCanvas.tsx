import React, { Component, RefObject } from 'react'
import IPixel from '../../../models/IPixel.model'
import IMousePos from '../../../models/IMousePos.model'

const scale: number = 10

class PictureCanvas extends Component<any, any> {
  private pictureCanvasRef: RefObject<HTMLCanvasElement>
  private cx: CanvasRenderingContext2D

  public constructor(props: any) {
    super(props)
    this.pictureCanvasRef = React.createRef<HTMLCanvasElement>()
  }

  public componentDidMount() {
    this.cx = this.pictureCanvasRef.current!.getContext('2d')!

    const { picture } = this.props
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        this.cx.fillStyle = picture.pixel(x, y)
        this.cx.fillRect(x * scale, y * scale, scale, scale)
      }
    }
  }

  public componentDidUpdate(prevProps: any) {
    const { picture } = this.props

    if (picture !== prevProps.picture) {
      for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
          this.cx.fillStyle = picture.pixel(x, y)
          this.cx.fillRect(x * scale, y * scale, scale, scale)
        }
      }
    }
  }

  public handleMouseClick = (event: any): void => {
    if (event.button !== 0) {
      return
    }

    const pixels: IPixel[] = []
    const mousePos: IMousePos = getMousePosition(
      this.pictureCanvasRef.current!,
      event
    )
    const pixel = { ...mousePos, color: this.props.color }
    pixels.push(pixel)
    this.props.handlePixelsChange(pixels)
  }

  public render() {
    const { picture } = this.props

    return (
      <canvas
        width={picture.width * scale}
        height={picture.height * scale}
        ref={this.pictureCanvasRef}
        onMouseDown={this.handleMouseClick}
      />
    )
  }
}

export default PictureCanvas

function getMousePosition(elem: HTMLElement, event: any): IMousePos {
  const { clientX, clientY } = event
  const { left, top } = elem.getBoundingClientRect()
  const newPos = {
    x: Math.floor((clientX - left) / scale),
    y: Math.floor((clientY - top) / scale)
  }
  
  return newPos
}
