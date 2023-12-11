
var ARButton = {
    createButton: function (renderer, options) {
        if (options && options.referenceSpaceType) {
            renderer.xr.setReferenceSpaceType(options.referenceSpaceType);
        }

        function onSessionStarted(session) {
            session.addEventListener('end', onSessionEnded);
            renderer.xr.setSession(session);
        }

        function onSessionEnded() {
            button.textContent = 'Enter AR';
        }

        const button = document.createElement('button');
        button.textContent = 'Enter AR';
        button.onclick = function () {
            if (renderer.xr.getSession() === null) {
                navigator.xr
                    .requestSession('immersive-ar', {
                        optionalFeatures: ['local-floor', 'bounded-floor', 'dom-overlay'],
                        domOverlay: { root: document.getElementById('overlay') },
                    })
                    .then(onSessionStarted)
                    .catch((error) => {
                        console.error('Failed to start AR session:', error);
                    });
            } else {
                renderer.xr.getSession().end();
            }
        };

        return button;
    },
};

export { ARButton };