import React, { Component } from 'react'
import PictureCanvas from './PictureCanvas/PictureCanvas'
import Controls from './Controls/Controls'
import Picture from './../../Picture'
import IPixel from '../../models/IPixel.model'
import IMousePos from '../../models/IMousePos.model'

const width: number = 50
const height: number = 50
const startCanvasBg = '#ffffff'
const startColor = '#000000'
const startTool = 'draw'

class PixelEditor extends Component<any, any> {
  public constructor(props: any) {
    super(props)

    this.state = {
      picture: Picture.empty(width, height, startCanvasBg),
      tool: startTool,
      color: startColor
    }
  }

  public handlePosChange = (pos: IMousePos) => {
    const { tool } = this.state
    const toolFunction = this[tool]
    if (toolFunction) {
      return toolFunction(pos)
    }
    // console.log()

    // const newPic = picture.draw(pixels)
    // this.setState({
    //   picture: newPic
    // })
  }

  public handleToolChange = (tool: string) => {
    console.log(tool)

    this.setState({
      tool
    })
  }

  public handleColorChange = (color: string) => {
    console.log(color)

    this.setState({
      color
    })
  }

  private draw = (startPos: IMousePos) => {
    const drawPixel = (pos: IMousePos) => {
      const { picture, color } = this.state
      const pixel = { x: pos.x, y: pos.y, color }
      this.setState({
        picture: picture.draw([pixel])
      })
    }
    drawPixel(startPos)
    return drawPixel
  }

  private rectangle = (startPos: IMousePos) => {
    const drawRectangle = (pos: IMousePos) => {
      console.log('lol rectangle')
    }
    drawRectangle(startPos)
    return drawRectangle
  }

  public render() {
    const { picture, tool, color } = this.state
    return (
      <section className="app-container">
        <PictureCanvas
          picture={picture}
          tool={tool}
          color={color}
          handlePosChange={this.handlePosChange}
        />
        <Controls
          handleToolChange={this.handleToolChange}
          handleColorChange={this.handleColorChange}
          color={color}
          tool={tool}
        />
      </section>
    )
  }
}

export default PixelEditor
