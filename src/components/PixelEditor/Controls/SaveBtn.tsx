import React, { Component } from 'react'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'

class SaveBtn extends Component<any, any> {
  public render() {
    const { saveImg } = this.props
    return (
      <Button onClick={saveImg}>
        <Icon type="save" />
        Save
      </Button>
    )
  }
}

export default SaveBtn
