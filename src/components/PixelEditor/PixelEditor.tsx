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

    let count = 0

    const doFill = ({ x, y }: IPos) => {
      count++
      const pixel = { x, y, color }
      // console.log(pixel)
      visitArray[x + y * picture.width] = true
      drawn.push(pixel)

      const neighboursPos = picture.positionsAround(x, y)
      // console.log(neighboursPos)
      for (const nPos of neighboursPos) {
        // return
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
    console.log(count)
    this.setState({ picture: picture.draw(drawn) })

    /////////////////////////////////

    // var around = [
    //   { dx: -1, dy: 0 },
    //   { dx: 1, dy: 0 },
    //   { dx: 0, dy: -1 },
    //   { dx: 0, dy: 1 }
    // ]
    // const { x, y } = clickPos
    // const { picture, color } = this.state
    // const targetColor = picture.pixel(clickPos.x, clickPos.y)
    // const drawn = [{ x, y, color }]
    // for (let done = 0; done < drawn.length; done++) {
    //   for (let { dx, dy } of around) {
    //     const x = drawn[done].x + dx
    //     const y = drawn[done].y + dy
    //     if (
    //       x >= 0 &&
    //       x < picture.width &&
    //       y >= 0 &&
    //       y < picture.height &&
    //       picture.pixel(x, y) === targetColor &&
    //       !drawn.some(p => p.x === x && p.y === y)
    //     ) {
    //       drawn.push({ x, y, color })
    //     }
    //   }
    // }
    // this.setState({ picture: picture.draw(drawn) })
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
