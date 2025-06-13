(function () {
    function showUpdateMessage() {
        console.log("ERROR LOADING CHUNK");
        const el = document.getElementById('update-message');
        if (el) el.style.display = 'flex';
        setTimeout(() => {
            const url = window.location.href.split('?')[0];
            window.location.href = url + '?cachebust=' + Date.now();
        }, 3000);
    }

    window.addEventListener('error', function (e) {
        if (e?.target?.tagName === 'SCRIPT' && e.target.src.includes('/_next/static/chunks/')) {
            showUpdateMessage();
        }
    }, true);

    window.addEventListener('unhandledrejection', function (e) {
        if (e?.reason?.message?.includes('Loading chunk') || (e?.reason?.stack && e.reason.stack.includes('/_next/static/chunks/'))) {
            showUpdateMessage();
        }
    });
})();
