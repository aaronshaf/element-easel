/** @jsx preact.h */
import preact from 'preact'
import Draw from './components'
import createElementClass from 'create-element-class'

const DrawElement = createElementClass({
  connectedCallback() {
    Object.defineProperties(this.style, {
      display: {value: 'inline-block'},
      position: {value: 'relative'}
    })
    this.updateRendering()
  },

  updateRendering() {
    this.div = preact.render(<Draw
      height={this.clientHeight}
      width={this.clientWidth}
      color={this.getAttribute('color')}
      strokeColor={this.getAttribute('stroke')}
      strokeWidth={this.getAttribute('stroke-width')}
    />, this, this.lastChild)
    this.rendered = true
  },

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.rendered) { this.updateRendering() }
  }
})
DrawElement.observedAttributes = ['stroke', 'stroke-width']

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(
`.draw-canvas {
position: absolute;
background-color: transparent;
left: 0;
top: 0;
}`))
  document.head.insertBefore(style, document.head.firstChild)

  const tagStyle = document.createElement('style')
  tagStyle.type = 'text/css'
  tagStyle.appendChild(document.createTextNode(
`element-easel {
  position: relative;
  display: block;
}`))
  document.head.insertBefore(tagStyle, document.head.firstChild)
})

export default DrawElement
