import React, { Component } from 'react'
import ToolSelect from './ToolSelect'
import ColorSelect from './ColorSelect'

class Controls extends Component<any, any> {
  public render() {
    const { handleToolChange, handleColorChange, color, tool } = this.props
    return (
      <section className="controls">
        <ToolSelect tool={tool} handleToolChange={handleToolChange} />
        <ColorSelect color={color} handleColorChange={handleColorChange} />
      </section>
    )
  }
}

export default Controls
