
var THREE = require('three');

/*
	THREE representation generation code.
*/
function isRenderable(result) {
	var isPrimitive = renderableFunctions[result.name] !== undefined,
		isArrayOfRenderables = Array.isArray(result) && result.every(isRenderable);
	return isPrimitive || isArrayOfRenderables;
}

const resultsThreeObjects = new WeakMap();

function resultToThree(result) {
	if(!resultsThreeObjects.has(result)) {
		resultsThreeObjects.set(result, []);
	}
	var threeObj; 
	if(Array.isArray(result)) {
		threeObj = arrayToThree(result);
	} else {
		threeObj = renderableFunctions[result.name](result);
	}
	resultsThreeObjects.get(result).push(threeObj);
	return threeObj;
}

function arrayToThree(array) {
	var objs = array.map(resultToThree);
	var parent = new THREE.Object3D();
	parent.add.apply(parent, objs);
	return parent;
}

var renderableFunctions = {
	sphere: sphere,
	cylinder: cylinder,
	box: box,
	move: move,
	rotate: rotate
};

var solidMat = new THREE.MeshPhongMaterial();

var sphereGeom = new THREE.SphereGeometry(1, 32, 32);
function sphere(result) {
	var radius = result.args.radius;
	var obj = new THREE.Mesh(sphereGeom, solidMat);
	obj.scale.set(radius, radius, radius);
	return obj;
}
var cylinderGeom = new THREE.CylinderGeometry(1, 1, 1, 32);
function cylinder(result) {
	var radius = result.args.radius;
	var height = result.args.height;
	var obj = new THREE.Mesh(cylinderGeom, solidMat);
	obj.scale.set(radius, height, radius);
	return obj;
}
var boxGeom = new THREE.BoxGeometry(1, 1, 1);
function box(result) {
	var width = result.args.width,
		height = result.args.height,
		depth = result.args.depth;
	var obj = new THREE.Mesh(boxGeom, solidMat);
	obj.scale.set(width, depth, height);
	return obj;
}
function move(result) {
	var objToMove = resultToThree(result.args.object);
	var x = result.args.x,
		y = result.args.z, //conversion
		z = -result.args.y; //from XZ to XY ground plane
	var obj = new THREE.Object3D();
	obj.position.set(x, y, z);
	obj.add(objToMove);
	return obj;
}
function rotate(result) {
	var objToMove = resultToThree(result.args.object);
	var axis = result.args.axis,
		angle = result.args.angle;
	var yUpAxis = new THREE.Vector3(axis.x, axis.z, -axis.y);
	var obj = new THREE.Object3D();
	obj.add(objToMove);
	obj.quaternion.setFromAxisAngle(yUpAxis, angle);
	return obj;
}

module.exports = {
	isRenderable: isRenderable,
	resultToThree: resultToThree,
	resultsThreeObjects: resultsThreeObjects
};
