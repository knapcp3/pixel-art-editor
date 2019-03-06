import React, { Component } from 'react'
import { Button, Icon } from 'antd'

class LoadBtn extends Component<any, any> {
  public render() {
    const { loadImg } = this.props
    return (
      <section>
        <Button onClick={loadImg}>
          <Icon type="folder-open" />
          Load
        </Button>
      </section>
    )
  }
}

export default LoadBtn
