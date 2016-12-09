/** @jsx preact.h */

import preact, { Component } from 'preact'
import Gesture from './gesture'

const MINIMUM_PRESSURE = 0.20

export default class Draw extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDrawing: false,
      drawings: [],
      currentPaths: [],
      strokeWidth: props.strokeWidth
    }
  }

  handleMouseDown = (event) => {
    if (window.PointerEvent) return
    event.stopPropagation()
    this.handlePointerDown(event)
  }

  handleTouchStart = (event) => {
    if (window.PointerEvent) return
    event.stopPropagation()
    event.preventDefault()
    const divPosition = getPosition(this.div)
    if (this.state.isDrawing) { return }
    const currentPaths = Array.from(event.touches).map((touch) => {
      return [
        touch.clientX - divPosition.x,
        touch.clientY - divPosition.y
      ]
    })
    this.setState({
      isDrawing: true,
      currentPaths
    })
  }

  handlePointerDown = (event) => {
    if (
      this.state.isDrawing ||
      (event.pressure && event.pressure < (MINIMUM_PRESSURE / 2))
    ) {
      return false
    }
    const divPosition = getPosition(this.div)
    const point = {
      x: event.clientX - divPosition.x,
      y: event.clientY - divPosition.y,
      width: getPressure(event) * this.props.strokeWidth
    }
    this.setState({
      isDrawing: true,
      currentPaths: [[point]]
    })
  }

  handleMouseMove = (event) => {
    if (window.PointerEvent) return false
    if (!this.state.isDrawing) return false
    const divPosition = getPosition(this.div)
    const point = {
      x: event.clientX - divPosition.x,
      y: event.clientY - divPosition.y,
      width: getPressure(event) * this.props.strokeWidth
    }
    this.setState({
      currentPaths: [this.state.currentPaths[0].concat([point])]
    })
  }

  handleTouchMove = (event) => {
    if (
      window.PointerEvent ||
      !this.state.isDrawing
    ) {
      return false
    }
    if (event.touches.length > 1) {
      this.handleTouchEnd(event)
      return false
    }
    const divPosition = getPosition(this.div)
    const newPoints = Array.from(event.touches).map((touch) => {
      const point = {
        x: touch.clientX - divPosition.x,
        y: touch.clientY - divPosition.y,
        width: 5
      }
      return point
    })
    const currentPaths = this.state.currentPaths.map((path, index) => {
      return path.concat([newPoints[index]])
    })
    this.setState({
      currentPaths
    })
  }

  handlePointerMove = (event) => {
    if (
      !this.state.isDrawing &&
      (event.pressure && event.pressure >= MINIMUM_PRESSURE)
    ) {
      this.handlePointerDown(event)
      return false
    }
    if (
      this.state.isDrawing &&
      (event.pressure && event.pressure < MINIMUM_PRESSURE)
    ) {
      this.handlePointerUp()
      return false
    } else if (!this.state.isDrawing) {
      return false
    }
    const divPosition = getPosition(this.div)
    const point = {
      x: event.clientX - divPosition.x,
      y: event.clientY - divPosition.y,
      width: getPressure(event) * this.props.strokeWidth
    }
    this.setState({
      currentPaths: [this.state.currentPaths[0].concat([point])]
    })
  }

  handleMouseUp = () => {
    if (window.PointerEvent) return
    this.setState({
      isDrawing: false,
      drawings: this.state.drawings.concat([this.state.currentPaths]),
      currentPaths: []
    })
  }

  handleTouchEnd = () => {
    if (
      window.PointerEvent ||
      !this.state.isDrawing
    ) {
      return
    }
    this.setState({
      isDrawing: false,
      drawings: this.state.drawings.concat([this.state.currentPaths]),
      currentPaths: null
    })
  }

  handlePointerUp = () => {
    let drawings = this.state.drawings
    if (this.state.isDrawing) {
      drawings =this.state.drawings.concat([this.state.currentPaths])
    }
    this.setState({
      isDrawing: false,
      drawings,
      currentPaths: null
    })
  }

  handlePointerLeave = () => {
    this.handlePointerUp()
  }

  handlePointerCancel = () => {
    this.handlePointerUp()
  }

  handleContextMenuClick = (event) => {
    event.preventDefault()
    this.setState({
      drawings: this.state.drawings.slice(0, -1)
    })
    return false
  }

  setDiv = (node) => { this.div = node }

  render (props) {
    const paths = flatten(this.state.drawings.map((drawing) => {
      return drawing.map((path) => {
        return (
          <Gesture
            strokeColor={props.strokeColor}
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
          <Gesture
            strokeColor={props.strokeColor}
            strokeWidth={props.strokeWidth || 1}
            path={path}
          />
        )
      })
    }

    return (
      <div
        className='element-easel-draw-canvas'
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onPointerMove={this.handlePointerMove}
        onTouchEnd={this.handleTouchEnd}
        onPointerUp={this.handlePointerUp}
        onPointerLeave={this.handlePointerLeave}
        onPointerCancel={this.handlePointerCancel}
        onContextMenu={this.handleContextMenuClick}
        ref={this.setDiv}
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

function getPosition (element) {
   var rect = element.getBoundingClientRect()
   return {x: rect.left, y: rect.top}
}

function getPressure (event) {
  return event.pressure || event.force || event.webkitForce || 0.5
}
