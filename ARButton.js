var ARButton = {
    createButton: function(gl, options) {
        if (options && options.referenceSpaceType) {
            gl.xr.setReferenceSpaceType(options.referenceSpaceType);
        }

        function EnterVR() {
            button.innerHTML = 'Enter XR';
            var currentSession = null;
        
            function onSessionStarted(session) {
                session.addEventListener('end', onSessionEnded);
                gl.xr.setSession(session);
                button.textContent = 'Exit XR';
                currentSession = session;
            }

            function onSessionEnded() {
                currentSession.removeEventListener('end',
                onSessionEnded);
                button.textContent = 'Enter XR';
                currentSession = null;
            }

            button.onclick = () => {

                /* function playDelayedSound(soundPath, delay, iteration) {
                    setTimeout(() => {
                        console.log("Iteration " + (iteration + 1) + " abgeschlossen.");
                        playSound(soundPath);
                    }, delay);
                }
                
                playDelayedSound('models/1.mp3', 5000, 0);

                playDelayedSound('models/2.mp3', 23000, 0);

                playDelayedSound('models/3.mp3', 52000, 0);
 */
                console.log('Button pressed');
                if (currentSession === null) {
                    let sessionInit = {
                            optionalFeatures: ["local-floor", "bounded-floor", "dom-overlay"],
                            domOverlay: { root: document.getElementById("overlay")}

                        };
                    navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted);
                }
                else {
                    currentSession.end();
                }

            }
        
        }


        function playSound(audioName) {
            let audio = new Audio(audioName);
            audio.loop = false;
            audio.play();
        }
        
        function NotFound() {
            button.textContent = 'immersive-ar not supported';
            console.log('immersive-ar mode not found');
        }

        if (navigator.xr) {
            var button = document.createElement("button");
            navigator.xr.isSessionSupported('immersive-ar').then(function(supported) {
                if (supported) { 
                    EnterVR() 
                }
                else { 
                    NotFound();
                }
            });
            button.setAttribute("id", "btn");
            return button;
        } else {
            if (window.isSecureContext === false) {
                console.log('WebXR needs HTTPS');
            } else {
                console.log('WebXR not available');
            }
            return;
        }
    }
}

export {ARButton};