import React, { Component } from 'react'
import ToolSelect from './ToolSelect'
import ColorSelect from './ColorSelect'
import SaveBtn from './SaveBtn'
import LoadBtn from './LoadBtn'
import UndoBtn from './UndoBtn'

class Controls extends Component<any, any> {
  public render() {
    const {
      handleToolChange,
      handleColorChange,
      saveImg,
      loadImg,
      undo,
      color,
      tool
    } = this.props
    return (
      <section className="controls">
        <ToolSelect tool={tool} handleToolChange={handleToolChange} />
        <ColorSelect color={color} handleColorChange={handleColorChange} />
        <SaveBtn saveImg={saveImg} />
        <LoadBtn loadImg={loadImg} />
        <UndoBtn undo={undo} />
      </section>
    )
  }
}

export default Controls
