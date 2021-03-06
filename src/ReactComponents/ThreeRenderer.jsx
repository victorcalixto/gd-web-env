
import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

/*
  A component that renders whatever camera and scene using a THREE.WebGLRenderer.
*/

class ThreeRenderer extends React.PureComponent {
  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs["canvas"]);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas, antialias: true, alpha: true
    });
    this._renderer = renderer;
    this._draw();
  }

  componentWillUmmount() {
    this._renderer = null;
  }

  componentDidUpdate() {
    const {width, height} = this.props;
    this._renderer.setViewport(0, 0, width, height);
    this._draw();
  }

  _draw() {
    this._renderer.render(this.props.scene, this.props.camera);
  }

  render() {
    return ( 
      <canvas 
        ref="canvas"
        width={this.props.width}
        height={this.props.height}
        style={styles.canvas}
      /> 
      );
  }

  renderToImage() {
    this._draw();
    let img = new Image();
    img.src = this._renderer.domElement.toDataURL("image/png");
    return img;
  }
}

const styles = {
  canvas: {
    width: "100%",
    height: "100%"
  }
};

  export default ThreeRenderer;