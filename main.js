import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

// camera configuration
const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;
let hitTestSource = null;
let hitTestSourceRequested = false;
let xr_mode = "xr";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near_plane, far_plane);
const collection = new THREE.Object3D();
scene.add(collection);
collection.scale.set(2, 2, 2);
collection.position.set(0, 0, -3);
collection.scale.divideScalar(3);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemisphereLight.color.setHSL(0.6, 1, 1);
hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
hemisphereLight.position.set(0, 10, 0);
scene.add(hemisphereLight)
const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
hemiLightHelper.visible = false;
scene.add(hemiLightHelper);

const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, premultipliedAlpha: false} );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.xr.enabled = true;
//document.getElementById("buttonContainer").appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );
//document.getElementById("ARButton").addEventListener("click", () => xr_mode = "ar");

const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
document.getElementById("buttonContainer").appendChild(arButton);
arButton.addEventListener("click", () => {
    xr_mode = "ar";
    playDelayedSoundsOnButtonClick();
});

function playDelayedSoundsOnButtonClick() {
    playDelayedSound('models/1.mp3', 5000, 0);
    playDelayedSound('models/2.mp3', 23000, 0);
    playDelayedSound('models/3.mp3', 52000, 0);
}

// object loading
const raum = new THREE.Object3D();
const loader = new GLTFLoader();
let reticle, geometry, controller;

loader.load('models/raum2.glb', function (gltf) {
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            // Load the texture using TextureLoader
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('models/DefaultMaterial_basecolor.png');
            // Apply the texture to the mesh's material
            child.material = new THREE.MeshStandardMaterial({
                map: texture,
                metalness: 0.0,
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


await addObjects(); 

async function addObjects() { 
        function onSelect() {
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

function playSound(audioName) {
    let audio = new Audio(audioName);
    audio.loop = false;
    audio.play();
}

function playDelayedSound(soundPath, delay, iteration) {
    setTimeout(() => {
        playSound(soundPath);
    }, delay);
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
        renderer.render(scene, camera);
    }
}

animate();
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    renderer.setAnimationLoop(render);
}