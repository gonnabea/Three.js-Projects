let container, camera, scene, renderer, effect

const spheres = []

let mouseX = 0
let mouseY = 0

let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

document.addEventListener("mousemove", onDocumentMouseMove, false)

init()
animate()

function init() {
  container = document.createElement("div")
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000)
  camera.position.z = 3200

  scene = new THREE.Scene()
  scene.background = new THREE.CubeTextureLoader()
    .setPath("./resources/")
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"])
  const geometry = new THREE.SphereBufferGeometry(100, 32, 16)

  const textureCube = new THREE.CubeTextureLoader()
    .setPath("./resources/")
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"])
  textureCube.mapping = THREE.CubeRefractionMapping

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: textureCube,
    refractionRatio: 0.95,
  })

  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = Math.random() * 10000 - 5000
    mesh.position.y = Math.random() * 10000 - 5000
    mesh.position.z = Math.random() * 10000 - 5000
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1
    scene.add(mesh)
    spheres.push(mesh)
  }

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  effect = new THREE.StereoEffect(renderer)
  effect.setSize(window.innerWidth, window.innerHeight)

  window.addEventListener("resize", onWindowResize, false)
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  effect.setSize(window.innerWidth, window.innerHeight)
}

function onDocumentMouseMove(event) {
  console.log(event.clientX)
  console.log(mouseX)
  mouseX = (event.clientX - windowHalfX) * 10
  mouseY = (event.clientY - windowHalfY) * 10
}

function animate() {
  requestAnimationFrame(animate)

  render()
}

function render() {
  const timer = 0.0001 * Date.now()
  console.log(camera.position)
  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  for (let i = 0, il = spheres.length; i < il; i++) {
    const sphere = spheres[i]

    sphere.position.x = 5000 * Math.cos(timer + i)
    sphere.position.y = 5000 * Math.sin(timer + i * 1.1)
  }

  effect.render(scene, camera)
}
