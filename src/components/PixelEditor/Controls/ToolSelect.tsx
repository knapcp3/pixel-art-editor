import React, { Component } from 'react'

class ToolSelect extends Component<any, any> {
  public constructor(props: any) {
    super(props)
  }

  public handleToolClick = (event: any) => {
    this.props.handleToolChange(event.target.value)
  }

  public render() {
    const { tool } = this.props
    
    return (
      <section>
        <select
          name="tool"
          id="tool"
          value={tool}
          onChange={this.handleToolClick}
        >
          <option value="draw">draw</option>
          <option value="rectangle">rectangle</option>
        </select>
      </section>
    )
  }
}

export default ToolSelect
