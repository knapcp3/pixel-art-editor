import React, { Component } from 'react'
import PixelEditor from './PixelEditor/PixelEditor'

class App extends Component<any, any> {
  public render() {
    return (
      <section className="app-container">
        <PixelEditor />
      </section>
    )
  }
}

export default App
