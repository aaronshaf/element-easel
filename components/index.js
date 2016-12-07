/** @jsx preact.h */

import preact, { Component } from 'preact'
import Path from './path'

export default class Draw extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDrawing: false,
      drawings: [],
      currentPaths: null
    }
  }

  handleMouseDown = (event) => {
    console.debug('handleMouseDown')
    const point = [
      event.offsetX,
      event.offsetY
    ]
    this.setState({
      isDrawing: true,
      currentPaths: [[point]]
    })
  }

  handleMouseMove = (event) => {
    if (!this.state.isDrawing) return false
    const point = [
      event.offsetX, // - this.div.offsetLeft,
      event.offsetY // - this.div.offsetTop
    ]
    this.setState({
      currentPaths: [this.state.currentPaths[0].concat([point])]
    })
  }

  handleMouseUp = () => {
    console.debug('handleMouseUp', this.state)
    this.setState({
      isDrawing: false,
      drawings: this.state.drawings.concat([this.state.currentPaths]),
      currentPaths: null
    })
  }

  setDiv = (node) => { this.div = node }

  render (props) {
    const paths = flatten(this.state.drawings.map((drawing) => {
      return drawing.map((path) => {
        return (
          <Path
            color={props.color || 'black'}
            strokeWidth={props.strokeWidth || 1}
            path={path}
          />
        )
      })
    }))
    let currentPaths
    if (this.state.currentPaths) {
      currentPaths = this.state.currentPaths.map((path) => {
        return (
          <Path
            color={props.color || 'black'}
            strokeWidth={props.strokeWidth || 1}
            path={path}
          />
        )
      })
    }

    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        ref={this.setDiv}
        style="user-select: none;cursor: pointer;"
      >
        <svg style={`width: ${props.width}px; height: ${props.height}px;`}>
          {paths}
          {currentPaths}
        </svg>
      </div>
    )
  }
}

function flatten (arrays) {
  return arrays.reduce((a, b) => {
    return a.concat(b)
  }, [])
}
