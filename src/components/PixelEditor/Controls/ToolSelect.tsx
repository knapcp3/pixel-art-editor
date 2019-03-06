import React, { Component } from 'react'
import { tools } from '../../../config/config'
import { Select } from 'antd'

class ToolSelect extends Component<any, any> {
  public constructor(props: any) {
    super(props)
  }

  public handleToolClick = (tool: string) => {
    this.props.handleToolChange(tool)
  }

  public render() {
    const { tool } = this.props
    return (
      <section className="control">
        <span>🖌 Tool: </span>
        <Select
          value={tool}
          onChange={this.handleToolClick}
          className="tool-select"
        >
          {tools.map(t => (
            <Select.Option value={t} key={t}>
              {t}
            </Select.Option>
          ))}
        </Select>
      </section>
    )
  }
}

export default ToolSelect
