import React, { Component } from 'react'
import PictureCanvas from './PictureCanvas/PictureCanvas'
import Controls from './Controls/Controls'
import Picture from './../../Picture'
import IPixel from '../../models/IPixel.model'

const width: number = 50
const height: number = 50
const startCanvasBg = 'white'
const startColor = 'black'
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

  public handlePixelsChange = (pixels: IPixel[]) => {
    const { picture } = this.state
    const newPic = picture.draw(pixels)
    this.setState({
      picture: newPic
    })
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

  public render() {
    const { picture, tool, color } = this.state
    return (
      <section className="app-container">
        <PictureCanvas
          picture={picture}
          tool={tool}
          color={color}
          handlePixelsChange={this.handlePixelsChange}
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
