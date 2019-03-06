import React, { Component } from 'react'
import {
  drawOnCanvas,
  createNode,
  pictureFromImage
} from './../../modules/helpers'
import PictureCanvas from './PictureCanvas/PictureCanvas'
import Controls from './Controls/Controls'
import Picture from './../../Picture'
import IPos from '../../models/IPos.model'
import IPixel from '../../models/IPixel.model'

const width: number = 70
const height: number = 50
const startCanvasBg = '#ffffff'
const startColor = '#000000'
const startTool = 'draw'

class PixelEditor extends Component<any, any> {
  private done: any = []
  private doneAt: number = 0

  constructor(props: any) {
    super(props)

    this.state = {
      picture: Picture.empty(width, height, startCanvasBg),
      tool: startTool,
      color: startColor
    }
  }

  public setStateWithHistory(newState: any, cb?: () => void) {
    this.done.push(this.state.picture)
    this.setState(newState, () => cb && cb())
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

  public saveImg = () => {
    const canvas = createNode('canvas', {})
    drawOnCanvas(this.state.picture, canvas, 1)
    const link = createNode('a', {
      href: canvas.toDataURL(),
      download: 'pixelart.png'
    })

    canvas.appendChild(link)

    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  public loadImg = () => {
    const input = createNode('input', {
      type: 'file',
      onchange: () => {
        const fileReader: FileReader = new FileReader()
        const file = input.files[0]
        fileReader.onloadend = () => {
          const img = new Image()
          img.onload = () => {
            this.setStateWithHistory({
              picture: pictureFromImage(img)
            })
          }

          img.src = (fileReader.result as string) || ''
        }
        fileReader.readAsDataURL(file)
      }
    })

    document.body.appendChild(input)
    input.click()
    input.remove()
  }

  public undo = () => {
    this.setState({
      picture: this.done.pop()
    })
  }

  private draw = (startPos: IPos) => {
    const drawPixel = (pos: IPos) => {
      const { picture, color } = this.state
      const pixel = { x: pos.x, y: pos.y, color }
      this.setStateWithHistory({
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

      this.setStateWithHistory({
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
    this.setStateWithHistory({ picture: picture.draw(drawn) })
  }

  private pick = (pos: IPos) => {
    this.setState({
      color: this.state.picture.pixel(pos.x, pos.y)
    })
  }

  public render() {
    const { picture, tool, color } = this.state
    return (
      <section className="editor-container">
        <PictureCanvas
          picture={picture}
          tool={tool}
          color={color}
          handlePosChange={this.handlePosChange}
        />
        <Controls
          handleToolChange={this.handleToolChange}
          handleColorChange={this.handleColorChange}
          saveImg={this.saveImg}
          loadImg={this.loadImg}
          undo={this.undo}
          color={color}
          tool={tool}
          disabledUndo={this.done.length === 0}
        />
      </section>
    )
  }
}

export default PixelEditor
