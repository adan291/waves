/**
 * Ambient Sound Module
 * Generates realistic ocean waves + chimes using Web Audio API
 */

const AmbientSound = (() => {
    'use strict';

    let audioContext = null;
    let isPlaying = false;
    let masterGain = null;
    let waveTimeout = null;
    let chimeTimeout = null;
    let volume = 0.12;

    const STORAGE_KEY = 'whispers-ambient-sound';
    const CHIME_NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

    /**
     * Create pink noise buffer
     */
    function createNoiseBuffer() {
        const bufferSize = 2 * audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }
        return buffer;
    }

    /**
     * Play a single ocean wave (distant rumble -> swells -> breaks on shore -> foam retreats)
     */
    function playWave() {
        if (!isPlaying || !audioContext) return;

        const noise = audioContext.createBufferSource();
        noise.buffer = createNoiseBuffer();
        noise.loop = true;

        // Two filters for richer ocean sound
        const lowFilter = audioContext.createBiquadFilter();
        lowFilter.type = 'lowpass';
        lowFilter.Q.value = 0.3; // Very gentle slope

        const highFilter = audioContext.createBiquadFilter();
        highFilter.type = 'highpass';
        highFilter.frequency.value = 40; // Remove sub-bass rumble

        const gain = audioContext.createGain();
        const now = audioContext.currentTime;

        // Realistic wave timing - much slower, like real ocean
        const swellTime = 4 + Math.random() * 2;      // Wave building (4-6s)
        const breakTime = 1.5 + Math.random() * 1;    // Wave breaking (1.5-2.5s)
        const foamTime = 5 + Math.random() * 3;       // Foam/retreat (5-8s)
        const totalDuration = swellTime + breakTime + foamTime;

        // Filter sweep - very low frequencies, gentle transitions
        // Distant swell = deep rumble, breaking = slightly brighter, foam = soft hiss
        lowFilter.frequency.setValueAtTime(120, now);
        lowFilter.frequency.linearRampToValueAtTime(180, now + swellTime * 0.6);
        lowFilter.frequency.linearRampToValueAtTime(350 + Math.random() * 100, now + swellTime); // Break
        lowFilter.frequency.linearRampToValueAtTime(280, now + swellTime + breakTime * 0.3);
        lowFilter.frequency.linearRampToValueAtTime(200, now + swellTime + breakTime);
        lowFilter.frequency.linearRampToValueAtTime(100, now + totalDuration);

        // Volume envelope - very gradual, organic swells
        const peakVolume = 0.35 + Math.random() * 0.15;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(peakVolume * 0.2, now + swellTime * 0.4);   // Distant swell
        gain.gain.exponentialRampToValueAtTime(peakVolume * 0.6, now + swellTime * 0.85);  // Building
        gain.gain.linearRampToValueAtTime(peakVolume, now + swellTime);                    // Peak at break
        gain.gain.linearRampToValueAtTime(peakVolume * 0.7, now + swellTime + breakTime * 0.4); // Crash sustain
        gain.gain.linearRampToValueAtTime(peakVolume * 0.4, now + swellTime + breakTime);  // Foam begins
        gain.gain.exponentialRampToValueAtTime(peakVolume * 0.15, now + swellTime + breakTime + foamTime * 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + totalDuration);                // Fade to silence

        noise.connect(highFilter);
        highFilter.connect(lowFilter);
        lowFilter.connect(gain);
        gain.connect(masterGain);

        noise.start(now);
        noise.stop(now + totalDuration + 0.2);

        // Schedule next wave with silence gap
        const silenceGap = 2 + Math.random() * 4; // 2-6 seconds of calm between waves
        const nextWaveDelay = (totalDuration + silenceGap) * 1000;
        waveTimeout = setTimeout(playWave, nextWaveDelay);
    }

    /**
     * Play a single chime sound (no scheduling)
     */
    function playSingleChime() {
        if (!isPlaying || !audioContext) return;

        const note = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
        const now = audioContext.currentTime;

        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note;

        const osc2 = audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = note * 1.002;

        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 3.5);
        osc2.stop(now + 3.5);
    }

    /**
     * Play chime and schedule next one
     */
    function playChime() {
        if (!isPlaying || !audioContext) return;

        // Play main chime
        playSingleChime();

        // Occasionally play a second chime for harmony (30% chance)
        if (Math.random() > 0.7) {
            setTimeout(playSingleChime, 300 + Math.random() * 200);
        }

        // Schedule next chime cycle (longer intervals for calm atmosphere)
        const nextDelay = 15000 + Math.random() * 20000; // 15-35 seconds
        chimeTimeout = setTimeout(playChime, nextDelay);
    }

    function init() {
        if (audioContext) return true;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioContext.createGain();
            masterGain.connect(audioContext.destination);
            masterGain.gain.value = volume;
            return true;
        } catch (e) {
            return false;
        }
    }

    function start() {
        if (isPlaying) return;
        if (!init()) return;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        isPlaying = true;
        localStorage.setItem(STORAGE_KEY, 'true');

        // Start first wave after brief delay (let user hear the silence first)
        waveTimeout = setTimeout(playWave, 500);

        // Start chimes after delay
        chimeTimeout = setTimeout(playChime, 8000 + Math.random() * 4000);
    }

    function stop() {
        if (!isPlaying) return;

        isPlaying = false;
        localStorage.setItem(STORAGE_KEY, 'false');

        if (waveTimeout) clearTimeout(waveTimeout);
        if (chimeTimeout) clearTimeout(chimeTimeout);
        waveTimeout = null;
        chimeTimeout = null;

        if (masterGain) {
            masterGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
            setTimeout(() => {
                if (masterGain) masterGain.gain.value = volume;
            }, 600);
        }
    }

    function toggle() {
        isPlaying ? stop() : start();
        return isPlaying;
    }

    function setVolume(vol) {
        volume = Math.max(0, Math.min(1, vol));
        if (masterGain) masterGain.gain.value = volume;
    }

    return {
        init, start, stop, toggle, setVolume,
        get isPlaying() { return isPlaying; }
    };
})();

if (typeof window !== 'undefined') {
    window.AmbientSound = AmbientSound;
}
