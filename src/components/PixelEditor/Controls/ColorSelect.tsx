import React, { Component } from 'react'

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
        <input
          className="color-select"
          type="color"
          value={color}
          onChange={this.handleColorClick}
        />
      </section>
    )
  }
}

export default ColorSelect
