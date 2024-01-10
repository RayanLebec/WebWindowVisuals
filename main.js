import * as THREE from 'three';
import Noise from 'noisejs';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 200);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

// Welcome message
const welcomeMessage = document.getElementById('info');

const createRandomColorCircle = (position) => {
  // Remove the welcome message when the first circle is clicked
  if (randomColorCircles.length === 0) {
    welcomeMessage.style.display = 'none';
  }

  const geometry = new THREE.BufferGeometry();
  const colors = [];
  const points = [];

  const numPoints = 100;
  const radius = 5;

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = position.x + Math.cos(angle) * radius;
    const y = position.y + Math.sin(angle) * radius;

    points.push(new THREE.Vector3(x, y, 0));
    colors.push(new THREE.Color(0x0000ff)); // Set color to blue
  }

  geometry.setFromPoints(points);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors.flatMap(color => [color.r, color.g, color.b]), 3));

  const material = new THREE.LineBasicMaterial({ vertexColors: false }); // Set vertexColors to false
  const randomColorCircle = new THREE.Line(geometry, material);
  scene.add(randomColorCircle);

  return randomColorCircle;
};

const randomColorCircles = [];

const noise = new Noise.Noise();

const onMouseClick = (event) => {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersection = new THREE.Vector3();
  raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), intersection);

  const newRandomColorCircle = createRandomColorCircle(intersection);
  randomColorCircles.push(newRandomColorCircle);
};

window.addEventListener('click', onMouseClick);

function animate() {
  requestAnimationFrame(animate);

  randomColorCircles.forEach((circle) => {
    const scaleFactor = 1.02;
    circle.scale.multiplyScalar(scaleFactor);
  });

  const shakeAmount = 0.5;

  camera.position.x += (Math.random() - 0.5) * shakeAmount;
  camera.position.y += (Math.random() - 0.5) * shakeAmount;

  renderer.render(scene, camera);
}

animate();
