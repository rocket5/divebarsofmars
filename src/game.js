import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Fog,
  BoxBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhongMaterial,
  HemisphereLight,
  AmbientLight,
  DirectionalLight,
  CameraHelper,
  Color,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  pink: 0xf5986e,
  yellow: 0xf4ce93,
  blue: 0x68c3c0,
};

let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container,
  controls;

var HEIGHT, WIDTH;

function createScene() {
  console.log('create scene');

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new Scene();
  scene.background = new Color('pink');
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 0.1;
  farPlane = 100;
  camera = new PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
  scene.fog = new Fog(0xf7d9aa, 100, 950);
  camera.position.x = 0;
  camera.position.z = 10;
  camera.position.y = 0;
  //camera.lookAt(new Vector3(0, 400, 0));

  renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;

  //container = document.getElementById('#scene-container');
  container = document.querySelector('#scene-container');
  container.append(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = -Math.PI / 2;
  controls.maxPolarAngle = Math.PI;
  //controls.noZoom = true;
  //controls.noPan = true;
}

var ambientLight, hemisphereLight, shadowLight;

function createLights() {
  console.log('create lights');

  hemisphereLight = new HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  ambientLight = new AmbientLight(0xdc8874, 0.5);

  shadowLight = new DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;

  var ch = new CameraHelper(shadowLight.shadow.camera);

  //scene.add(ch);
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}

function createCube() {
  const geometry = new BoxBufferGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: Colors.red });
  const cube = new Mesh(geometry, material);
  cube.rotation.set(45, 32, 0);
  scene.add(cube);
}

function loop() {
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function init() {
  createScene();
  createLights();
  createCube();
  loop();
}

init();
