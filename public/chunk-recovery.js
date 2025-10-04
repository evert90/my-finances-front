(function () {
    function showUpdateMessage() {
        console.log("ERROR LOADING CHUNK");

        document.body.innerHTML = '';

        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '0';
        messageDiv.style.left = '0';
        messageDiv.style.width = '100%';
        messageDiv.style.height = '100%';
        messageDiv.style.display = 'flex';
        messageDiv.style.alignItems = 'center';
        messageDiv.style.justifyContent = 'center';
        messageDiv.style.backgroundColor = '#ffffff';
        messageDiv.style.fontSize = '18px';
        messageDiv.style.color = '#333';
        messageDiv.innerText = 'Atualizando app...';

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            const url = window.location.href.split('?')[0];
            window.location.href = url + '?cachebust=' + Date.now();
        }, 3000);
    }

    window.addEventListener('error', function (e) {
        if (e?.target?.tagName === 'SCRIPT' && e.target.src.includes('/_next/static/chunks/')) {
            console.log("EVENT LISTENER ERROR")
            showUpdateMessage();
        }
    }, true);

    window.addEventListener('unhandledrejection', function (e) {
        if (e?.reason?.message?.includes('Loading chunk') || (e?.reason?.stack && e.reason.stack.includes('/_next/static/chunks/'))) {
            console.log("EVENT LISTENER unhandledrejection" + e?.reason?.message + e?.reason?.stack)
            showUpdateMessage();
        }
    });
})();
