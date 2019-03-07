import React, { Component } from 'react'
import {
  drawOnCanvas,
  createNode,
  pictureFromImage,
  distanceBetween
} from './../../modules/helpers'
import PictureCanvas from './PictureCanvas/PictureCanvas'
import Controls from './Controls/Controls'
import Picture from './../../Picture'
import IPos from '../../models/IPos.model'
import IPixel from '../../models/IPixel.model'
import {
  tools,
  startCanvasBg,
  startCanvasHeight as height,
  startCanvasWidth as width,
  startColor,
  startTool,
  canvasScale
} from './../../config/config'

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

  public componentDidMount() {
    document.addEventListener('keydown', this.keysHandler)
  }
  public componentWillUnmount() {
    document.removeEventListener('keydown', this.keysHandler)
  }

  public setStateWithHistory(newState: any, cb?: () => void) {
    if (Date.now() - this.doneAt > 1000) {
      if (this.done.length > 100) {
        this.done.shift()
      }
      this.done.push(this.state.picture)
      this.doneAt = Date.now()
    }
    this.setState(newState, () => cb && cb())
  }

  public keysHandler = (event: any) => {
    const key: string = event.key
    tools.forEach(tool => {
      if (tool.charAt(0) === key) {
        this.setState({ tool })
        return
      }
    })

    if ((event.ctrlKey || event.metaKey) && key === 'z') {
      this.undo()
    }
  }

  public handlePosChange = (pos: IPos) => {
    const { tool } = this.state
    const toolFunction = this[tool]
    if (toolFunction) {
      return toolFunction(pos, canvasScale)
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
    if (this.done.length === 0) {
      return
    }
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

  private circle = (startPos: IPos) => {
    const { picture, color } = this.state

    let drawCircle = (pos: IPos) => {
      const pixels: any = []
      const r = distanceBetween(startPos, pos)
      const startX = Math.floor(Math.max(0, startPos.x - r))
      const endX = Math.ceil(Math.min(startPos.x + r, picture.width))
      const startY = Math.floor(Math.max(0, startPos.y - r))
      const endY = Math.ceil(Math.min(startPos.y + r, picture.height))
    
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          const p = { x, y }
          if (distanceBetween(p, startPos) <= r) {
            pixels.push({ ...p, color })
          }
        }
      }

      this.setStateWithHistory({
        picture: picture.draw(pixels)
      })
    }

    drawCircle(startPos)
    return drawCircle
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
