import React, { Component, RefObject } from 'react'
import IPixel from '../../../models/IPixel.model'
import IMousePos from '../../../models/IMousePos.model'
import { getMousePosition } from './../../../modules/helpers'
import { scale } from '../../../config/config'

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

    const canvas = this.pictureCanvasRef.current!
    let mousePos: IMousePos = getMousePosition(canvas, event)
    let pixel = { ...mousePos, color: this.props.color }
    this.props.handlePixelsChange([pixel])

    const moved = (moveEv: any) => {
      if (moveEv.buttons === 0) {
        canvas.removeEventListener('mousemove', moved)
      }
      const lastPos: IMousePos = mousePos
      mousePos = getMousePosition(canvas, moveEv)

      if (lastPos.x === mousePos.x && lastPos.y === mousePos.y) {
        return
      }

      pixel = { ...mousePos, color: this.props.color }
      this.props.handlePixelsChange([pixel])
    }

    canvas.addEventListener('mousemove', moved)
    event.preventDefault()
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
