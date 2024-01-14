/* import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from './ARButton.js';

// camera configuration
const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;

// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near_plane, far_plane);
const collection = new THREE.Object3D();
scene.add(collection);
collection.position.z = -3;
collection.scale.divideScalar(3);

// light
/// light from the sky
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemisphereLight.color.setHSL(0.6, 1, 1);
hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
hemisphereLight.position.set(0, 10, 0);
scene.add(hemisphereLight)
const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
hemiLightHelper.visible = false;
scene.add(hemiLightHelper);
//ffffffff

/// light from the sun
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.color.setHSL(0.9, 1, 0.9);
directionalLight.position.set(-2.5, 10, -2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

// renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
var dom = renderer.domElement;
renderer.xr.enabled = true;
document.body.appendChild(ARButton.createButton(renderer));
document.body.appendChild(dom);

// object loading
const raum = new THREE.Object3D();
const loader = new GLTFLoader();

// orbit controls
let controls;
controls = new OrbitControls(camera, dom);
controls.target.set(0, 1.6, 0);
controls.update();

loader.load('models/raum.glb', function (gltf) {
    // its always children[0] because the child gets removed from gltf.scene once you add it to the actual scene

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            // Load the texture using TextureLoader
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('models/DefaultMaterial_basecolor.png');

            // Apply the texture to the mesh's material
            child.material = new THREE.MeshStandardMaterial({
                map: texture,
                metalness: 0.0, // Adjust these properties based on your model
                roughness: 0.0,
            });
        }
    });



    console.log('Model loaded:', gltf);
    raum.add(gltf.scene);
    raum.name = "raum";
    collection.add(raum);
    raum.scale.set(10, 10, 10);
    
}, undefined, function (error) {
    console.error(error);
});

function animate() {
    // scaling after everything has loaded
    collection.scale.set(2, 2, 2);
    collection.position.set(0, 0, 0);

    renderer.setAnimationLoop(function () {
        // time management
        /// scaling to seconds
        // rendering
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.render(scene, camera);
    })
}

animate(); */


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from './ARButton.js';

// camera configuration
const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;

// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near_plane, far_plane);
const collection = new THREE.Object3D();
scene.add(collection);
collection.position.z = -3;
collection.scale.divideScalar(3);

// light
/// light from the sky
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemisphereLight.color.setHSL(0.6, 1, 1);
hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
hemisphereLight.position.set(0, 10, 0);
scene.add(hemisphereLight)
const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
hemiLightHelper.visible = false;
scene.add(hemiLightHelper);
//ffffffff

/// light from the sun
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.color.setHSL(0.9, 1, 0.9);
directionalLight.position.set(-2.5, 10, -2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

// renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
var dom = renderer.domElement;
renderer.xr.enabled = true;
document.body.appendChild(ARButton.createButton(renderer));
document.body.appendChild(dom);

// object loading
const raum = new THREE.Object3D();
const loader = new GLTFLoader();

// orbit controls
let controls;
controls = new OrbitControls(camera, dom);
controls.target.set(0, 1.6, 0);
controls.update();

async function addObjects() { 
    
    // Random Planet or Star Spawner
    geometry = new THREE.Object3D();
        // This function gets called if you tap the screen.
        function onSelect() {

            // Places a random model with random properties if the hitmarker is visible (means it found an intersection in the real world)
            if ( reticle.visible ) {
              

                geometry = new THREE.Object3D();
                    loader.load('models/kugel.glb', function (gltf) {
                        
                        geometry.name = "random_model";
                        reticle.matrix.decompose( geometry.position, geometry.quaternion, geometry.scale );

                        geometry.scale.set(randomScale, randomScale, randomScale);
                        geometry.rotation.set(randomRotate, randomRotate, randomRotate);
                        scene.add(geometry);
                }, undefined, function (error) {
                    console.error(error);
                })
            }
        }

        // Sets the xr controller (screen tap) and add the function to be called if gets triggered
        controller = renderer.xr.getController( 0 );
        controller.addEventListener( 'select', onSelect );
        scene.add( controller );

        // Creates the hitmarker object that is hidden in the beginning
        reticle = new THREE.Mesh(
          new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
          new THREE.MeshBasicMaterial()
        );
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add( reticle );
}

loader.load('models/raum.glb', function (gltf) {
    // its always children[0] because the child gets removed from gltf.scene once you add it to the actual scene

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            // Load the texture using TextureLoader
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('models/DefaultMaterial_basecolor.png');

            // Apply the texture to the mesh's material
            child.material = new THREE.MeshStandardMaterial({
                map: texture,
                metalness: 0.0, // Adjust these properties based on your model
                roughness: 0.0,
            });
        }
    });


    console.log('Model loaded:', gltf);
    raum.add(gltf.scene);
    raum.name = "raum";
    collection.add(raum);
    raum.scale.set(10, 10, 10);
    
}, undefined, function (error) {
    console.error(error);
});


  function onSelect(event) {
    if (reticle.visible) {
      // The reticle should already be positioned at the latest hit point,
      // so we can just use its matrix to save an unnecessary call to
      // event.frame.getHitTestResults.



        // Creates the hitmarker object that is hidden in the beginning
        reticle = new THREE.Mesh(
            new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
            new THREE.MeshBasicMaterial()
          );
          reticle.matrixAutoUpdate = false;
          reticle.visible = false;
          scene.add( reticle );
    }
  }



  function render( timestamp, frame ) {
    // Checks if the ar mode is on, because the hittest doesn't work in vr. (We couldn't fix it, if we got it right it's because the hittest in vr works different)

  }

function animate() {
    // scaling after everything has loaded
    collection.scale.set(2, 2, 2);
    collection.position.set(0, 0, 0);

    if (xr_mode == "ar") {  

        // Checks every frame if it found an intersection with realworld surfaces
            if ( frame ) {
                const referenceSpace = renderer.xr.getReferenceSpace();
                const session = renderer.xr.getSession();
    
                if ( hitTestSourceRequested === false ) {
                    session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {
                    session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {
                        hitTestSource = source;
                    } );
                    } );
                    session.addEventListener( 'end', function () {
                    hitTestSourceRequested = false;
                    hitTestSource = null;
                    } );
                    hitTestSourceRequested = true;
                }
    
                // If it found an intersection it makes the hitmarker visible and gets the position result of the found coordinates so we can place objects there
                if ( hitTestSource ) {
                    const hitTestResults = frame.getHitTestResults( hitTestSource );
                    if ( hitTestResults.length ) {
                    const hit = hitTestResults[ 0 ];
                    reticle.visible = true;
                    reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );
                    } else {
                    reticle.visible = false;
                    }
                }
            }
        }


    renderer.setAnimationLoop(function () {
        // time management
        /// scaling to seconds
        // rendering
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.render(scene, camera);
    })
}

animate();