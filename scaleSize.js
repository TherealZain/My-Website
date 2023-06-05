import * as THREE from "three";

export function adjustModelScale(model) {
   // console.log(window.innerWidth * window.devicePixelRatio);
  if (screen.width < 900) {
    
    const scaleFactor = window.innerWidth / 900; // Adjust the value 900 as needed
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}
}

export function adjustCameraPosition(camera, model){

    if (screen.width < 600) {
        camera.position.x -= 1.6

    }
}