import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { ARButton } from './ARButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

// camera configuration
const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;
let hitTestSource = null;
let hitTestSourceRequested = false;
let xr_mode = "xr";

// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near_plane, far_plane);
const collection = new THREE.Object3D();
scene.add(collection);
collection.scale.set(2, 2, 2);
collection.position.set(0, 0, -3);
collection.scale.divideScalar(3);

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
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, premultipliedAlpha: false} );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.xr.enabled = true;
//document.body.appendChild(renderer.domElement);
//document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );
//document.body.appendChild(renderer.domElement);
document.getElementById("buttonContainer").appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );
document.getElementById("ARButton").addEventListener("click", () => xr_mode = "ar");

// object loading
const raum = new THREE.Object3D();
const loader = new GLTFLoader();
let reticle, geometry, controller;

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
    // raum.add(gltf.scene);
    raum.name = "raum";
    collection.add(raum);
    raum.scale.set(10, 10, 10);
    
}, undefined, function (error) {
    console.error(error);
});


await addObjects(); 

async function addObjects() { 

    
        function onSelect() {

            // Places a random model with random properties if the hitmarker is visible (means it found an intersection in the real world)
            if ( reticle.visible ) {
                geometry = new THREE.Object3D();
                    loader.load('models/kugel.glb', function (gltf) {
                        geometry = gltf.scene;
                        geometry.name = "random_model";
                        reticle.matrix.decompose( geometry.position, geometry.quaternion, geometry.scale );

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



function render(timestamp, frame) {
    if(xr_mode == "ar") {
    if (frame) {
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
        renderer.render( scene, camera );
    }
}
animate();
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    renderer.setAnimationLoop(render);
}