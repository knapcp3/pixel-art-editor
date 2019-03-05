import React, { Component, RefObject } from 'react'
import IPos from '../../../models/IPos.model'
import { getMousePosition } from './../../../modules/helpers'
import { scale } from '../../../config/config'
import Picture from '../../../Picture'

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
    this.drawOnCanvas(picture)
  }

  public componentDidUpdate(prevProps: any) {
    const { picture } = this.props

    if (picture !== prevProps.picture) {
      this.drawOnCanvas(picture)
    }
  }

  public handleMouseClick = (event: any): void => {
    if (event.button !== 0) {
      return
    }

    const canvas = this.pictureCanvasRef.current!
    let mousePos: IPos = getMousePosition(canvas, event)
    const toolOnMove = this.props.handlePosChange(mousePos)

    if (!toolOnMove) {
      return
    }

    const moved = (moveEv: any) => {
      if (moveEv.buttons === 0) {
        canvas.removeEventListener('mousemove', moved)
      }
      const lastPos: IPos = mousePos
      mousePos = getMousePosition(canvas, moveEv)

      if (lastPos.x === mousePos.x && lastPos.y === mousePos.y) {
        return
      }

      toolOnMove(mousePos)
    }

    canvas.addEventListener('mousemove', moved)
    event.preventDefault()
  }

  private drawOnCanvas(picture: Picture) {
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        this.cx.fillStyle = picture.pixel(x, y)
        this.cx.fillRect(x * scale, y * scale, scale, scale)
      }
    }
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
