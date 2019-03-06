import React, { Component } from 'react'
import { Input } from 'antd'

class ColorSelect extends Component<any, any> {
  public constructor(props: any) {
    super(props)
  }

  public handleColorClick = (event: any) => {
    this.props.handleColorChange(event.target.value)
  }

  public render() {
    const { color } = this.props
    return (
      <section className="control">
        <span>🎨 Color: </span>
        <Input
          type="color"
          className="color-select"
          value={color}
          onChange={this.handleColorClick}
        />
      </section>
    )
  }
}

export default ColorSelect
