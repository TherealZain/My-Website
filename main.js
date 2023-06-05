 import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { adjustModelScale } from "./scaleSize";
import { adjustCameraPosition } from "./scaleSize";
const scene = new THREE.Scene();
let isLoaded = false;
let loadedResources = 0;
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.add(camera);
camera.position.z = 7;
camera.position.y = 0.1;
camera.position.x = 1.5;
adjustCameraPosition(camera);

const light = new THREE.PointLight(0xffffff, 10, 100);
light.position.set(0, 20, 10);
scene.add(light);
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);
let loadedObject = null;
const loader = new GLTFLoader();

 loader.load(
  "public/models/intergalactic_spaceship_only_model/scene.gltf",

  function (gltf) {
    loadedObject = gltf.scene;
    console.log("Model loaded successfully:", gltf);
    loadedObject.position.set(-250, 100, -800);
    loadedObject.rotation.x = (Math.PI / 16);
    loadedObject.rotation.y = Math.PI +3.5 ;
    loadedObject.rotation.z = Math.PI +3.0 ;
    adjustModelScale(loadedObject)
    scene.add(loadedObject);
    loadedResources++
    checkResourcesLoaded();
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");

  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
); 

let starGeo;
let starMaterial;

starGeo = new THREE.BufferGeometry();
const positions = [];
const velocities = [];
const accelerations = [];
for (let i = 0; i < 6000; i++) {
  positions.push(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  );
  velocities.push(0);
  accelerations.push(0.02);
}

starGeo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

let sprite = new THREE.TextureLoader().load("public/download.png", () => {
  console.log("stars are good")
  loadedResources++;
  checkResourcesLoaded();
});
starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite,
});

let stars = new THREE.Points(starGeo, starMaterial);
scene.add(stars);
const h1 = document.getElementById("intro");
const text =
  "Hello, I'm Zain Zulfiqar, Software Engineer, Software developer and computer scientist.";
let isTextTyped = false;
console.log("here")
const maxRotation = 0.006
let movementDirection = 1; // 1 for right, -1 for left
let isRotationDelayed = false; // Flag to track if rotation delay is active
let timeoutStarted = false
let rotationDuration = 1500;
let rotationDelay = Math.random()* 3000; // Delay in milliseconds before rotation starts
let oscillate = false;
let rotationStartTime;
const verticalAmplitude = 0.2; // Adjust the vertical amplitude
const verticalFrequency = 0.002; // Adjust the vertical frequency
const movementSpeed = 0.1; // Adjust the movement speed
let rotationMultiplier = 1.2; // Adjust the rotation multiplier for the right side
let rotationAmount;
const starPositions = starGeo.attributes.position.array;
const origin = new THREE.Vector3(0, 0, 0);
let targetX = 0;
let targetZ = 0;
let targetY = 0;

// Function to start the rotation after the delay
function startRotation() {
  isRotationDelayed = true;
  rotationStartTime = Date.now();
}
function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

 function animate() {
   if (!isLoaded) {
     // If the objects have not finished loading, wait for a short delay and check again
     console.log("not loaded");
     setTimeout(animate, 100);
     return;
   }

     requestAnimationFrame(animate);
    // Adjust the desired frame rate (e.g., 30 FPS)

   for (let i = 0; i < starPositions.length; i += 3) {
     velocities[i / 3] += accelerations[i / 3];
     starPositions[i + 2] -= velocities[i / 3];

     if (starPositions[i + 2] < -200) {
       starPositions[i + 2] = 200;
       velocities[i / 3] = 0;
     }
   }
   starGeo.attributes.position.needsUpdate = true;

   stars.rotation.z += 0.002;  

   if (loadedObject) {
     let distanceX = loadedObject.position.x - targetX;
     let distanceY = loadedObject.position.y - targetY;
     let distanceZ = loadedObject.position.z - targetZ;

     // If the object's x-coordinate is close enough to the target, set it to exactly the target
      if (Math.abs(distanceX) < 0.001) {
        loadedObject.position.x = targetX;
       document.getElementById("app").style.display = "block";
       if (!isTextTyped) {
         isTextTyped = true;
         for (let i = 0; i < text.length; i++) {
           setTimeout(() => {
             h1.textContent += text[i];
           }, i * 45);
         }
       }
      }  else { 
       // Apply the ease-out function to the object's speed
       loadedObject.position.x -= distanceX * 0.1;
     }  
     if (Math.abs(distanceZ) < 0.001) {
       loadedObject.position.z = targetZ;
       if (!isRotationDelayed) {
         setTimeout(startRotation, rotationDelay);
         rotationAmount = Math.random() * 0.006; // Adjust the rotation amount (in radians)
         if (rotationAmount > maxRotation) {
           rotationAmount = maxRotation * movementDirection;
         }
       }

       // Rotate the loaded object (model) within the duration
       if (isRotationDelayed && loadedObject) {
         const rotationTime = Date.now() - rotationStartTime;
         if (rotationTime <= rotationDuration) {
           let easedRotationAmount =
             rotationAmount * easeOutQuad(rotationTime / rotationDuration);
           loadedObject.rotation.z += easedRotationAmount * movementDirection;
         } else {
           // Stop the rotation after the specified duration
           let overtime = rotationTime - rotationDuration;
           let easedOvertimeRotationAmount =
             rotationAmount * (1 - overtime / (rotationDuration * 2));
           if (easedOvertimeRotationAmount < 0) {
             easedOvertimeRotationAmount = 0;
           }
           loadedObject.rotation.z +=
             easedOvertimeRotationAmount * movementDirection;



           if (easedOvertimeRotationAmount === 0) {
             isRotationDelayed = false;
             if (loadedObject.rotation.z > 6.4) {
               movementDirection = -1;
             } else if (loadedObject.rotation.z < 5.7) {
               movementDirection = 1;
             } else Math.random() >= 0.5 ? 1 : -1;
           }
         }
       }
     } else {
       loadedObject.position.z -= distanceZ * 0.1;
     }
     if (!oscillate) {
       loadedObject.position.y -= distanceY * 0.1;
       oscillate = true;
     } else {
       loadedObject.position.y =
         targetY + Math.sin(Date.now() * verticalFrequency) * verticalAmplitude;
     }
   } 
   renderer.render(scene, camera);
 }

animate();

function typeOutText() {
  requestAnimationFrame(typeOutText);
  if (
    loadedObject &&
    loadedObject.position.distanceTo(origin) < 0.001 &&
    !isTextTyped
  ) {
    isTextTyped = true;
  }
  renderer.render(scene, camera);
}

typeOutText();
// Assuming loadedObject is your 3D object
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};

function checkResourcesLoaded() {
  if (loadedResources === 2) {
    // Both resources (sprite and model) have finished loading
    isLoaded = true;
  }
}
  
  
let ellipsisCount = 0;
document.addEventListener("DOMContentLoaded", function () {
  startLoading();
});

function startLoading() {
  const loadingTime = 5000;
  const startTime = Date.now();

  const loadingInterval = setInterval(function () {
    const loadingBar = document.getElementById("loading-bar");
    const loadingText = document.getElementById("loading-text");
    const elapsed = Date.now() - startTime;

    const currentPercentage = Math.min((elapsed / loadingTime) * 100, 50);

    if (currentPercentage >= 50 && isLoaded) {
      // If it reached 50% and resources are loaded
      clearInterval(loadingInterval);
      document.getElementById("loading-bar-container").style.display = "none";
    } else {
      loadingBar.style.width = currentPercentage + "%";
    }
  }, 100); // Interval - can adjust this as needed
  setTimeout(() => {
    const loadingText = document.getElementById("loading-text");
    const ellipsisInterval = setInterval(function () {
      ellipsisCount = (ellipsisCount + 1) % 4;
      const ellipsis = ".".repeat(ellipsisCount);
      loadingText.innerHTML = "Loading" + ellipsis;
    }, 300); // Interval for ellipsis animation - adjust as needed
  }, 10);
}

window.addEventListener(
  "resize",
  function () {
    // Here, you also need to update the camera and the renderer
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);