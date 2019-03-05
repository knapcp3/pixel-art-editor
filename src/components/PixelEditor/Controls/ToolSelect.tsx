import React, { Component } from 'react'
import Select from 'react-select'
import { tools } from '../../../config/config'
import ISelectOption from './../../../models/ISelectOption.model'

const toolOptions = tools.map(tool => {
  return { value: tool, label: tool }
})

class ToolSelect extends Component<any, any> {
  public constructor(props: any) {
    super(props)
  }

  public handleToolClick = (
    selectedOption?: ISelectOption | ISelectOption[] | null
  ) => {
    if (Array.isArray(selectedOption)) {
      throw new Error('Unexpected type passed to ReactSelect onChange handler')
    }
    const opt = (selectedOption && selectedOption.value) || ''
    this.props.handleToolChange(opt)
  }

  public render() {
    const { tool } = this.props
    const toolOption = toolOptions.find(t => t.value === tool)
    return (
      <section className="control">
        <Select
          value={toolOption}
          onChange={this.handleToolClick}
          options={toolOptions}
          name="tool"
          className="tool-select"
        />
      </section>
    )
  }
}

export default ToolSelect
