// WAV audio helper to convert Float32 PCM to a WAV blob
function bufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * 2 + 44;
    const bufferArr = new ArrayBuffer(length);
    const view = new DataView(bufferArr);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // Write WAV header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16);         // format chunk length
    setUint16(1);          // sample format (raw PCM)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16);         // bits per sample
    setUint32(0x61746164); // "data" chunk size header
    setUint32(length - 44); // chunk length

    // Write interleaved audio channels
    for (i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            if (offset < channels[i].length) {
                sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF); // scale to 16-bit
                view.setInt16(pos, sample, true); // write sample
            }
            pos += 2;
        }
        offset++;
    }

    return new Blob([bufferArr], { type: 'audio/wav' });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}

export async function synthesizeMelody(songTitle) {
    const sampleRate = 44100;
    const duration = 15; // 15 seconds synthesized audio
    const numSamples = sampleRate * duration;
    
    // Fallback for browsers
    const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const ctx = new OfflineCtx(2, numSamples, sampleRate);
    
    // Hash track title to seed musical parameters (key, instruments, chord patterns)
    let hash = 0;
    for (let i = 0; i < songTitle.length; i++) {
        hash = songTitle.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    
    // Scale and frequency selection
    const baseFreq = 120 + (seed % 100); // 120Hz to 220Hz base pitch (C3 to A3-ish)
    const scale = [1, 1.125, 1.25, 1.333, 1.5, 1.667, 1.875, 2]; // Diatonic multipliers
    
    // Schedule beats
    const tempo = 120; // 120 BPM
    const beatDuration = 60 / tempo; // 0.5s per beat
    const totalBeats = duration / beatDuration; // 30 beats
    
    for (let beat = 0; beat < totalBeats; beat++) {
        const time = beat * beatDuration;
        
        // Kick Drum Synthesizer (every 2 beats)
        if (beat % 2 === 0) {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            
            kickOsc.frequency.setValueAtTime(150, time);
            kickOsc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);
            
            kickGain.gain.setValueAtTime(0.8, time);
            kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
            
            kickOsc.connect(kickGain);
            kickGain.connect(ctx.destination);
            
            kickOsc.start(time);
            kickOsc.stop(time + 0.35);
        }
        
        // Melody Synth note scheduler (off-beats / running scales)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        const noteIndex = (seed + beat * 3 + (beat % 5 === 0 ? 3 : 1)) % scale.length;
        const noteFreq = baseFreq * scale[noteIndex];
        
        const waveTypes = ['sawtooth', 'triangle', 'sine', 'square'];
        osc.type = waveTypes[seed % waveTypes.length];
        osc.frequency.setValueAtTime(noteFreq, time);
        
        // Add a slight frequency glide (portamento) on beats divisible by 3
        if (beat % 3 === 0) {
            osc.frequency.linearRampToValueAtTime(noteFreq * 1.05, time + 0.2);
            osc.frequency.linearRampToValueAtTime(noteFreq, time + 0.4);
        }
        
        oscGain.gain.setValueAtTime(0.25, time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + beatDuration - 0.05);
        
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + beatDuration);
    }
    
    const renderedBuffer = await ctx.startRendering();
    return bufferToWav(renderedBuffer);
}
