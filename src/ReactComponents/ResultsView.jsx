
import React from 'react';
import OrbitThreeView from './OrbitThreeView.jsx';
import toThree from '../SceneGraph/to-three.js';
import THREE from 'three';

class ResultsView extends React.Component {
	computeThreeScene() {
		let scene = new THREE.Scene();
		// create three objects for the results
		let threeObjects = toThree.convert.normally(this.props.results.results.topLevelExprResults.values());
		// create lights
		const sunLight = new THREE.DirectionalLight(0xffffca, 0.5);
		sunLight.position.set(0.1, 1, 0.3);
		const belowLight = new THREE.DirectionalLight(0xffffca, 0.1);
		belowLight.position.set(-0.1, -1, -0.4)
		const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
		// create global coordinates helpers
		const gridHelper = new THREE.GridHelper(100, 1);
		gridHelper.setColors(0x888888, 0x444444);
		const axisHelper = new THREE.AxisHelper(5);
		axisHelper.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2.0)
		// add everything
		scene.add(sunLight, belowLight, hemiLight, gridHelper, axisHelper, ...threeObjects);
		return scene;
	}
	render() {
		return (
			<OrbitThreeView scene={this.computeThreeScene()}/>
		);
	}
}

export default ResultsView;