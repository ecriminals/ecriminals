

window.onload = function () {
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    const audio = document.getElementById('audio');


    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;  

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        
        const color = 'rgba(255, 255, 255, 0.7)';  

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            ctx.fillStyle = color;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }

        
        requestAnimationFrame(renderFrame);
    }

    audio.onplay = () => {
        audioContext.resume().then(() => {
            renderFrame();
        });
    };
};
