import React, { Component } from 'react'
import PictureCanvas from './PictureCanvas/PictureCanvas'
import Controls from './Controls/Controls'
import Picture from './../../Picture'
import IPos from '../../models/IPos.model'
import IPixel from '../../models/IPixel.model'

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

  public handlePosChange = (pos: IPos) => {
    const { tool } = this.state
    const toolFunction = this[tool]
    if (toolFunction) {
      return toolFunction(pos)
    }
  }

  public handleToolChange = (tool: string) => {
    this.setState({
      tool
    })
  }

  public handleColorChange = (color: string) => {
    this.setState({
      color
    })
  }

  private draw = (startPos: IPos) => {
    const drawPixel = (pos: IPos) => {
      const { picture, color } = this.state
      const pixel = { x: pos.x, y: pos.y, color }
      this.setState({
        picture: picture.draw([pixel])
      })
    }
    drawPixel(startPos)
    return drawPixel
  }

  private rectangle = (startPos: IPos) => {
    const { picture, color } = this.state

    const drawRectangle = (pos: IPos) => {
      const xStart = Math.min(startPos.x, pos.x)
      const yStart = Math.min(startPos.y, pos.y)
      const xEnd = Math.max(startPos.x, pos.x)
      const yEnd = Math.max(startPos.y, pos.y)
      const drawn = []
      for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
          drawn.push({ x, y, color })
        }
      }

      this.setState({
        picture: picture.draw(drawn)
      })
    }

    drawRectangle(startPos)
    return drawRectangle
  }

  private fill = (clickPos: IPos) => {
    const { picture, color } = this.state
    const visitArray = new Array(picture.width * picture.height).fill(false)
    const targetColor = picture.pixel(clickPos.x, clickPos.y)
    const drawn: IPixel[] = []

    const doFill = ({ x, y }: IPos) => {
      const pixel = { x, y, color }

      visitArray[x + y * picture.width] = true
      drawn.push(pixel)
      const neighboursPos = picture.positionsAround(x, y)
      for (const nPos of neighboursPos) {
        const { x: nX, y: nY } = nPos
        if (
          picture.inside(nX, nY) &&
          !visitArray[nX + nY * picture.width] &&
          picture.pixel(nX, nY) === targetColor
        ) {
          doFill(nPos)
        }
      }
    }

    doFill(clickPos)
    this.setState({ picture: picture.draw(drawn) })
  }

  private pick = (pos: IPos) => {
    this.setState({
      color: this.state.picture.pixel(pos.x, pos.y)
    })
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
