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
let hitTestSource = null;
let hitTestSourceRequested = false;

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
let reticle, controller;

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


await addObjects(); 

async function addObjects() { 

    
        function onSelect() {

            // Places a random model with random properties if the hitmarker is visible (means it found an intersection in the real world)
            if ( reticle.visible ) {
                geometry = new THREE.Object3D();
                    loader.load('models/kugel.glb', function (gltf) {
                        
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
    if (frame) {
        const session = renderer.xr.getSession();

        if (session) {
            const referenceSpace = renderer.xr.getReferenceSpace();

            if (hitTestSourceRequested === false) {
                session.requestReferenceSpace('viewer').then(function (referenceSpace) {
                    session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
                        hitTestSource = source;
                    });
                });

                session.addEventListener('end', function () {
                    hitTestSourceRequested = false;
                    hitTestSource = null;
                });

                hitTestSourceRequested = true;
            }

            // Rest of the code
        } else {
            console.error("XR session not available");
        }
    }
}

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

animate();
render(scene, camera);

// Three JS and AR Setup

/* import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Defining global variables
let container, camera, scene, light, renderer, geometry, spaceSphere, gate, time, controller, reticle;

// Defining hit variables
let hitFrontOut, hitFrontIn, hitBackOut, hitBackIn, hitCenter; 

// Defining portal variables
let portalFront, meshFront, portalBack, meshBack, realMat, spaceMat;

let stencilRef = 1;

// LoadingManager

const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

// Setting loading variables. Prevents errors from calling the animate function while the models are not jet loaded.
let models_Loaded = false;


// Loading Manager sets models Loaded to true so the animation won't start before every model is loaded.
manager.onLoad = function (url){
    models_Loaded = true;
    console.log( 'Loading complete!');
};



let modelLoader = new GLTFLoader(manager);

// HitTest settup
let hitTestSource = null;
let hitTestSourceRequested = false;
let xr_mode = "xr";

init(); // Call Init function for main settup

async function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // Scene Setup
    scene = new THREE.Scene();

    // Camera Setup
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
    camera.position.set(0, 0, 1);

    // Light Setup
    light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 10, 0);
    scene.add(light);

    // Render Setup: Sets the WebGLRenderer with antialias, alpha and premultiplied alpha on true. It initializes the size, pixelratio and enables the xr mode.
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, premultipliedAlpha: false} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );

    // Creates the buttons in the html div and add event listener to switch between the xr mode ar and vr.
    document.getElementById("buttonContainer").appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );
    document.getElementById("ARButton").addEventListener("click", () => xr_mode = "ar");

    // Call add Objects function to place all needed objects in the world before continuing
    await addObjects(); 

    // Call animate function. Will loop with empty results while the models are still loading
    animate(); 

    // Adjust the window if it gets resized
    window.addEventListener( 'resize', onWindowResize );
}

// Adding the static objects
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




    // Disables the stencils in case it gets switched back again so it gets deactivated
    realMat.depthWrite = true;
    realMat.stencilWrite = false;
    realMat.stencilFunc = THREE.AlwaysStencilFunc;
    realMat.stencilZPass = THREE.ReplaceStencilOp;


    spaceMat.depthWrite = false;
    spaceMat.stencilWrite = true;
    spaceMat.stencilRef = stencilRef;
    spaceMat.stencilFunc = THREE.AlwaysStencilFunc;
    spaceMat.stencilZPass = THREE.ReplaceStencilOp;

    meshFront = new THREE.Mesh(portalFront, realMat); // Clones the predefined Phong material with full transparency
    meshFront.material.side = THREE.DoubleSide;
    meshFront.scale.set(0.16, 0.16, 0.16);
    meshFront.position.set(_posX, _posY, _posZ + portalDifference);

    scene.add(meshFront);


    // Portal in the back with little difference so you could stay between both and look into both dimensions. (wip: its now deactivated because the effect didn't worked as we intended)
    portalBack = new THREE.CircleGeometry( 1.3, 32 ); 

    meshBack = new THREE.Mesh(portalBack, spaceMat); // Clones the predefined Phong material with full transparency
    meshBack.material.side = THREE.DoubleSide;
    meshBack.scale.set(0.16, 0.16, 0.16);
    meshBack.position.set(_posX, _posY, _posZ - portalDifference);

    // scene.add(meshBack);


// Resizing the window refreshes the scene with new aspect ratio
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// animate Function (calls the "animateObject" function with given attributes)
function animate() {
    // Checks if models are loaded and then starts the animation so all animations are synced.
    if(models_Loaded == true){ 

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

        // Checks the position of the camera and the intersection with the hitboxes so it can switch the portals right in the next line
        checkIntersection();
        switchPortals();
    } 

    // Renders the scene and the camera
    renderer.render( scene, camera );

    // Sets the animation loop with the render function and request the animationframes with the animate function
    requestAnimationFrame(animate);
    renderer.setAnimationLoop( render );
}


// Render function
function render( timestamp, frame ) {
    // Checks if the ar mode is on, because the hittest doesn't work in vr. (We couldn't fix it, if we got it right it's because the hittest in vr works different)
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
    
    // set the values of the uniforms for the shader to animate it
    realMat.uniforms.uTime.value += 0.01; 
    realMat.uniforms.uResolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height
    );

    // render scene and camera
    renderer.render( scene, camera );
} */