import React, { Component, RefObject } from 'react'
import IPos from '../../../models/IPos.model'
import { getMousePosition, drawOnCanvas } from './../../../modules/helpers'
import { canvasScale } from '../../../config/config'

class PictureCanvas extends Component<any, any> {
  private pictureCanvasRef: RefObject<HTMLCanvasElement>

  public constructor(props: any) {
    super(props)
    this.pictureCanvasRef = React.createRef<HTMLCanvasElement>()
  }

  public componentDidMount() {
    const { picture } = this.props
    drawOnCanvas(picture, this.pictureCanvasRef.current!, canvasScale)
  }

  public componentDidUpdate(prevProps: any) {
    const { picture } = this.props

    if (picture !== prevProps.picture) {
      drawOnCanvas(
        picture,
        this.pictureCanvasRef.current!,
        canvasScale,
        prevProps.picture
      )
    }
  }

  public handleMouseClick = (event: any): void => {
    if (event.button !== 0) {
      return
    }

    const canvas = this.pictureCanvasRef.current!
    let mousePos: IPos = getMousePosition(canvas, event, canvasScale)
    const toolOnMove = this.props.handlePosChange(mousePos)

    if (!toolOnMove) {
      return
    }

    const moved = (moveEv: any) => {
      if (moveEv.buttons === 0) {
        canvas.removeEventListener('mousemove', moved)
      }
      const lastPos: IPos = mousePos
      mousePos = getMousePosition(canvas, moveEv, canvasScale)

      if (lastPos.x === mousePos.x && lastPos.y === mousePos.y) {
        return
      }

      toolOnMove(mousePos)
    }

    canvas.addEventListener('mousemove', moved)
    event.preventDefault()
  }

  public render() {
    return (
      <section>
        <canvas
          ref={this.pictureCanvasRef}
          onMouseDown={this.handleMouseClick}
        />
      </section>
    )
  }
}

export default PictureCanvas
