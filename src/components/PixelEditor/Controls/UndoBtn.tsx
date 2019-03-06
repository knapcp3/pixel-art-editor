import React, { Component } from 'react'
import { Button, Icon } from 'antd'

class UndoBtn extends Component<any, any> {
  public render() {
    const { undo } = this.props
    return (
      <section className="input-wrapper">
        <Button onClick={undo}>
          <Icon type="undo" />
          Undo
        </Button>
      </section>
    )
  }
}

export default UndoBtn
