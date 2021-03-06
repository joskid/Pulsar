import React from 'react'
import PropTypes from 'prop-types'

export default class Node extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      readOnly: true,
      textDraggable: true
    }
  }

  render () {
    var x = this.props.x
    var y = this.props.y
    var nodePosition = {
      transform: `translate3d(${x}px, ${y}px, 0px)`
    }

    return (
      <div
        className={this.props.dragging || this.props.selected ? `node dragging ${this.props.theme}` : `node ${this.props.theme}`}
        style={nodePosition}
      >
        {this.props.selected
          ? <div className="node-selected"></div>
          : ''
        }
        <div className="node-top">
          {this.props.icon !== undefined
            ? this.props.icon.includes('lab la-') || this.props.icon.includes('las la-')
              ? <i className={`node-icon ${this.props.icon}`}></i>
              : this.props.icon.includes('.png')
                ? <img className="node-icon" src={`/${this.props.icon}`}/>
                : <span className="node-icon">{this.props.icon}</span>
            : ''
          }
          <input nodeid={this.props.nodeId} draggable={this.state.textDraggable}
            className={this.state.readOnly ? 'node-name ' + this.props.theme : 'node-name editing ' + this.props.theme }
            readOnly={this.state.readOnly}
            value={this.props.name}
            onChange={(event) => this.props.editName(this.props.nodeId, event)}
            onDoubleClick={(event) => this.setState({ readOnly: false, textDraggable: false })}
            onBlur={(event) => this.setState({ readOnly: true, textDraggable: true })}
          />
        </div>
        <div className="node-inner">
          <div className={'node-header bg-' + this.props.color}>
            <div className={`attribute-pin attribute-type-main ${this.props.theme}`} attributetype="input" nodeid={this.props.nodeId} attributeid={this.props.nodeId} ref={this.props.refIn}></div>
            <div className={`attribute-pin attribute-pin-out attribute-type-main ${this.props.theme}`} attributetype="output" nodeid={this.props.nodeId} attributeid={this.props.nodeId} ref={this.props.refOut}></div>
          </div>
          <div className={'attribute-container ' + this.props.theme}>
            <div className="inputs-container">
              {this.props.inputs.map((input, index) => (
                input.hidden !== true
                  ? <div className="input-container" key={index}>
                    <div className={`attribute-pin attribute-type-${input.type.split('.')[0]} ${this.props.theme}`} attributetype="input" nodeid={this.props.nodeId} attributeid={input.name} ref={input.ref}></div>
                    <div className="attribute-name-container" attributetype="input" nodeid={this.props.nodeId} attributeid={input.name} >
                      <span className="attribute-name" attributetype="input" nodeid={this.props.nodeId} attributeid={input.name} >{input.label}</span>
                    </div>
                  </div>
                  : ''
              ))}
            </div>
            <div className="outputs-container">
              {this.props.outputs.map((output, index) => (
                <div className="output-container" key={index}>
                  <div className="attribute-name-container" attributetype="output" nodeid={this.props.nodeId} attributeid={output.name}>
                    <span className="attribute-name" attributetype="output" nodeid={this.props.nodeId} attributeid={output.name}>{output.label}</span>
                  </div>
                  <div className={`attribute-pin attribute-type-${output.type} ${this.props.theme}`} attributetype="output" nodeid={this.props.nodeId} attributeid={output.name} ref={output.ref}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={this.props.draggingEdge ? 'no-overlay' : 'drag-overlay'} nodeid={this.props.nodeId} draggable="true"></div>
      </div>
    )
  };
};

Node.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  nodeId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  inputs: PropTypes.array.isRequired,
  outputs: PropTypes.array.isRequired,
  dragging: PropTypes.bool.isRequired,
  draggingEdge: PropTypes.bool.isRequired,
  refIn: PropTypes.any.isRequired,
  refOut: PropTypes.any.isRequired,
  editName: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
}
