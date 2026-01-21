/* Immersive 80s Spectral Music Player */
(function() {
	'use strict';
	
	// Track list
	const tracks = [
		{
			title: "(Intro) Good Morning Destiny",
			artist: "Cosmic Dust",
			src: "https://raw.githubusercontent.com/AntonioBerna/cosmic-dust/master/audio/intro-good-morning-destiny.wav"
		},
		{
			title: "First Step",
			artist: "Cosmic Dust",
			src: "https://raw.githubusercontent.com/AntonioBerna/cosmic-dust/master/audio/first-steps.wav"
		}
	];
	
	let currentTrackIndex = 0;
	let audioContext = null;
	let analyser = null;
	let source = null;
	let isAudioContextInitialized = false;
	let animationId = null;
	
	// Get elements
	const audio = document.getElementById('audioPlayer');
	const playBtn = document.getElementById('playBtn');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const trackTitleEl = document.getElementById('trackTitle');
	const trackNumberEl = document.getElementById('trackNumber');
	const playIcon = playBtn.querySelector('.play-icon');
	const pauseIcon = playBtn.querySelector('.pause-icon');
	const canvas = document.getElementById('spectrumCanvas');
	const startHint = document.getElementById('startHint');
	const ctx = canvas.getContext('2d');
	
	// Resize canvas
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
	
	// Initialize Audio Context
	function initAudioContext() {
		if (isAudioContextInitialized) return;
		
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		
		source = audioContext.createMediaElementSource(audio);
		source.connect(analyser);
		analyser.connect(audioContext.destination);
		
		isAudioContextInitialized = true;
		
		// Hide start hint
		if (startHint) {
			startHint.classList.add('hidden');
		}
	}
	
	// Draw spectrum
	function drawSpectrum() {
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		
		function draw() {
			animationId = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);
			
			// Clear canvas with fade effect
			ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			const barWidth = (canvas.width / bufferLength) * 2.5;
			const centerX = canvas.width / 2;
			const centerZoneWidth = canvas.width * 0.4; // Center zone where bars are reduced
			let x = 0;
			
			for (let i = 0; i < bufferLength; i++) {
				// Calculate distance from center to reduce bar height in center area
				const barCenterX = x + barWidth / 2;
				const distanceFromCenter = Math.abs(barCenterX - centerX);
				const centerFactor = Math.min(1, distanceFromCenter / (centerZoneWidth / 2));
				
				// Reduce bar height in center zone for better text visibility
				const maxHeight = 0.4 + (centerFactor * 0.4); // 40% to 80% based on position
				const barHeight = (dataArray[i] / 255) * canvas.height * maxHeight;
				
				// Create gradient for each bar
				const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
				gradient.addColorStop(0, '#ff006e');
				gradient.addColorStop(0.5, '#8338ec');
				gradient.addColorStop(1, '#06ffa5');
				
				// Reduce opacity in center zone
				const opacity = 0.6 + (centerFactor * 0.4);
				ctx.globalAlpha = opacity;
				ctx.fillStyle = gradient;
				
				// Draw bar from bottom
				ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
				
				// Mirror effect on top (subtle) - only on edges
				if (centerFactor > 0.5) {
					ctx.fillStyle = `rgba(255, 0, 110, ${dataArray[i] / 255 * 0.2})`;
					ctx.fillRect(x, 0, barWidth - 2, barHeight * 0.2);
				}
				
				ctx.globalAlpha = 1;
				x += barWidth;
			}
			
			// Add dark center vignette for text readability
			const vignetteGradient = ctx.createRadialGradient(
				canvas.width / 2, canvas.height / 2, 0,
				canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.5
			);
			vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
			vignetteGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
			vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = vignetteGradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			// Add scanlines effect
			ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
			for (let y = 0; y < canvas.height; y += 4) {
				ctx.fillRect(0, y, canvas.width, 2);
			}
		}
		
		draw();
	}
	
	// Draw idle animation (when not playing)
	function drawIdleAnimation() {
		let phase = 0;
		
		function drawIdle() {
			if (!audio.paused) return; // Stop if playing
			
			animationId = requestAnimationFrame(drawIdle);
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			const barCount = 64;
			const barWidth = (canvas.width / barCount) * 2.5;
			const centerX = canvas.width / 2;
			const centerZoneWidth = canvas.width * 0.4;
			let x = 0;
			
			phase += 0.02;
			
			for (let i = 0; i < barCount; i++) {
				// Create wave pattern
				const wave = Math.sin(phase + i * 0.2) * 0.5 + 0.5;
				
				// Reduce bar height in center
				const barCenterX = x + barWidth / 2;
				const distanceFromCenter = Math.abs(barCenterX - centerX);
				const centerFactor = Math.min(1, distanceFromCenter / (centerZoneWidth / 2));
				const maxHeight = 0.08 + (centerFactor * 0.12); // Reduced in center
				
				const barHeight = wave * canvas.height * maxHeight + 10;
				
				const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
				gradient.addColorStop(0, 'rgba(255, 0, 110, 0.3)');
				gradient.addColorStop(1, 'rgba(6, 255, 165, 0.15)');
				
				ctx.globalAlpha = 0.5 + (centerFactor * 0.5);
				ctx.fillStyle = gradient;
				ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
				ctx.globalAlpha = 1;
				
				x += barWidth;
			}
			
			// Dark center vignette
			const vignetteGradient = ctx.createRadialGradient(
				canvas.width / 2, canvas.height / 2, 0,
				canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.5
			);
			vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
			vignetteGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
			vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = vignetteGradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			// Scanlines
			ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
			for (let y = 0; y < canvas.height; y += 4) {
				ctx.fillRect(0, y, canvas.width, 2);
			}
		}
		
		drawIdle();
	}
	
	// Load track
	function loadTrack(index) {
		const track = tracks[index];
		audio.src = track.src;
		trackTitleEl.textContent = track.title;
		trackNumberEl.textContent = (index + 1).toString().padStart(2, '0');
		currentTrackIndex = index;
		audio.load();
	}
	
	// Play/Pause
	function togglePlay() {
		initAudioContext();
		
		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}
		
		if (audio.paused) {
			audio.play().then(() => {
				playIcon.style.display = 'none';
				pauseIcon.style.display = 'block';
				cancelAnimationFrame(animationId);
				drawSpectrum();
			}).catch(err => {
				console.error('Play error:', err);
			});
		} else {
			audio.pause();
			playIcon.style.display = 'block';
			pauseIcon.style.display = 'none';
			cancelAnimationFrame(animationId);
			drawIdleAnimation();
		}
	}
	
	// Previous track
	function prevTrack() {
		const wasPlaying = !audio.paused;
		currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
		loadTrack(currentTrackIndex);
		if (wasPlaying) {
			audio.play();
		}
	}
	
	// Next track
	function nextTrack() {
		const wasPlaying = !audio.paused;
		currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
		loadTrack(currentTrackIndex);
		if (wasPlaying) {
			audio.play();
		}
	}
	
	// Event listeners
	playBtn.addEventListener('click', togglePlay);
	prevBtn.addEventListener('click', prevTrack);
	nextBtn.addEventListener('click', nextTrack);
	
	audio.addEventListener('ended', nextTrack);
	
	// Start hint click
	if (startHint) {
		startHint.addEventListener('click', togglePlay);
	}
	
	// Handle audio errors
	audio.addEventListener('error', (e) => {
		console.error('Audio error:', e);
		playIcon.style.display = 'block';
		pauseIcon.style.display = 'none';
	});
	
	// Keyboard controls
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
			e.preventDefault();
			togglePlay();
		} else if (e.code === 'ArrowLeft') {
			e.preventDefault();
			prevTrack();
		} else if (e.code === 'ArrowRight') {
			e.preventDefault();
			nextTrack();
		}
	});
	
	// Initialize
	loadTrack(0);
	drawIdleAnimation();
	
})();