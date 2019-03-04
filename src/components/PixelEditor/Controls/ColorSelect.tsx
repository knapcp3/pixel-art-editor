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
      <section>
        <input type="color" value={color} onChange={this.handleColorClick} />
      </section>
    )
  }
}

export default ColorSelect
