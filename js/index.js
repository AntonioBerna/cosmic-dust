/*----------------------------------------------------*/
/* Quote Loop
------------------------------------------------------ */

function fade($ele) {
    $ele.fadeIn(800).delay(2500).fadeOut(800, function () {
        var $next = $(this).next('.quote');
        fade($next.length > 0 ? $next : $(this).parent().children().first());
    });
}
fade($('.quoteLoop > .quote').first());


/*----------------------------------------------------*/
/* Navigation
------------------------------------------------------ */

$(window).scroll(function () {

    if ($(window).scrollTop() > 300) {
        $('.main_nav').addClass('sticky');
    } else {
        $('.main_nav').removeClass('sticky');
    }
});

// Mobile Navigation
$('.mobile-toggle').click(function () {
    if ($('.main_nav').hasClass('open-nav')) {
        $('.main_nav').removeClass('open-nav');
    } else {
        $('.main_nav').addClass('open-nav');
    }
});

$('.main_nav li a').click(function () {
    if ($('.main_nav').hasClass('open-nav')) {
        $('.navigation').removeClass('open-nav');
        $('.main_nav').removeClass('open-nav');
    }
});

/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

jQuery(document).ready(function ($) {

    $('.smoothscroll').on('click', function (e) {
        e.preventDefault();

        var target = this.hash,
            $target = $(target);

        // Usa scrollIntoView nativo per performance migliori
        if ('scrollBehavior' in document.documentElement.style) {
            // Browser moderni con supporto nativo
            $target[0].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Aggiorna l'hash dopo un breve delay
            setTimeout(function() {
                if (history.pushState) {
                    history.pushState(null, null, target);
                } else {
                    window.location.hash = target;
                }
            }, 100);
        } else {
            // Fallback per browser più vecchi con animazione più veloce
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 500, 'easeInOutCubic', function () {
                window.location.hash = target;
            });
        }
    });

});


TweenMax.staggerFrom(".heading", 0.8, { opacity: 0, y: 20, delay: 0.2 }, 0.4);

/*----------------------------------------------------*/
/* Back to Top Button
------------------------------------------------------ */
jQuery(document).ready(function ($) {
    var backToTopBtn = $('#backToTop');
    
    // Show/hide button on scroll
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            backToTopBtn.addClass('visible');
        } else {
            backToTopBtn.removeClass('visible');
        }
    });
    
    // Smooth scroll to top con scrollIntoView nativo
    backToTopBtn.on('click', function(e) {
        e.preventDefault();
        
        if ('scrollBehavior' in document.documentElement.style) {
            // Usa scrollIntoView nativo per prestazioni migliori
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback jQuery più veloce
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        }
    });
    
    // Keyboard accessibility
    backToTopBtn.on('keypress', function(e) {
        if (e.which === 13 || e.which === 32) {
            e.preventDefault();
            $(this).click();
        }
    });
});

/*----------------------------------------------------*/
/* Mobile Toggle Keyboard Support
------------------------------------------------------ */
jQuery(document).ready(function ($) {
    $('.mobile-toggle').on('keypress', function(e) {
        if (e.which === 13 || e.which === 32) {
            e.preventDefault();
            $(this).click();
        }
    });
});

/*----------------------------------------------------*/
/* Scroll Animations for Sections
------------------------------------------------------ */
jQuery(document).ready(function ($) {
    // Add fade-in animation on scroll
    $(window).scroll(function() {
        $('.card, .video-wrapper, .quote').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in-visible');
            }
        });
    });
});

/*----------------------------------------------------*/
/* Cosmic Dust Animation
------------------------------------------------------ */
(function() {
    'use strict';
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return;
    }
    
    const canvas = document.getElementById('cosmicDust');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
            // Start particles at random positions on init
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.vx = (Math.random() - 0.5) * 0.3; // Horizontal drift
            this.vy = Math.random() * 0.5 + 0.2; // Vertical fall speed
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.twinklePhase += this.twinkleSpeed;
            
            // Wrap around horizontally
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            
            // Reset particle when it falls off bottom
            if (this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
            const finalOpacity = this.opacity * twinkle;
            
            // Draw particle with glow
            ctx.beginPath();
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 3
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.9})`);
            gradient.addColorStop(0.3, `rgba(135, 206, 250, ${finalOpacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(135, 206, 250, 0)');
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Core
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        resizeCanvas();
        particles = [];
        
        // Create particles based on screen size
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        animate();
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            resizeCanvas();
            // Reinitialize particles with new canvas size
            particles.forEach(particle => {
                if (particle.x > canvas.width) particle.x = canvas.width;
                if (particle.y > canvas.height) particle.reset();
            });
        }, 250);
    });
    
    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
})();

/*
    Audio Visualizer
*/

// window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

// document.querySelector('audio').addEventListener('playing', function () {
//     var audio = document.getElementById('audio');
//     audio.onended = function () {
//         isPlaying = false;
//     };
//     var ctx = new AudioContext();
//     var analyser = ctx.createAnalyser();
//     var audioSrc = ctx.createMediaElementSource(audio);
//     // we have to connect the MediaElementSource with the analyser 
//     audioSrc.connect(analyser);
//     analyser.connect(ctx.destination);
//     // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
//     // analyser.fftSize = 64;
//     // frequencyBinCount tells you how many values you'll receive from the analyser
//     var frequencyData = new Uint8Array(analyser.frequencyBinCount);

//     // we're ready to receive some data!
//     var canvas = document.getElementById('canvas'),
//         cwidth = canvas.width,
//         cheight = canvas.height - 2,
//         meterWidth = 10, //width of the meters in the spectrum
//         gap = 2, //gap between meters
//         capHeight = 2,
//         capStyle = '#fff',
//         meterNum = 800 / (10 + 2), //count of the meters
//         capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
//     ctx = canvas.getContext('2d'),
//         gradient = ctx.createLinearGradient(0, 0, 0, 300);
//     gradient.addColorStop(1, '#e55d87');
//     gradient.addColorStop(0.5, '#5fc3e4');
//     // loop
//     function renderFrame() {
//         var array = new Uint8Array(analyser.frequencyBinCount);
//         analyser.getByteFrequencyData(array);
//         var step = Math.round(array.length / meterNum); //sample limited data from the total array
//         ctx.clearRect(0, 0, cwidth, cheight);
//         for (var i = 0; i < meterNum; i++) {
//             var value = array[i * step];
//             if (capYPositionArray.length < Math.round(meterNum)) {
//                 capYPositionArray.push(value);
//             };
//             ctx.fillStyle = capStyle;
//             //draw the cap, with transition effect
//             if (value < capYPositionArray[i]) {
//                 ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
//             } else {
//                 ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
//                 capYPositionArray[i] = value;
//             };
//             ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
//             ctx.fillRect(i * 12 /*meterWidth+gap*/, cheight - value + capHeight, meterWidth, cheight); //the meter
//         }
//         requestAnimationFrame(renderFrame);
//     }
//     renderFrame();
//     audio.play();
// });

// var isPlaying = false;
// var currentSourceId = null;

// function playSource(sourceId) {
//     var audioPlayer = document.getElementById("audio");
//     var source = document.getElementById("source" + sourceId);

//     if (sourceId !== currentSourceId) {
//         // Se è stato premuto un bottone diverso da quello corrente
//         if (isPlaying) {
//             // Se una canzone è già in riproduzione, interrompi la riproduzione
//             audioPlayer.pause();
//             isPlaying = false;
//         }

//         // Modifica l'attributo 'src' dell'elemento audio
//         audioPlayer.src = source.src;

//         // Avvia la riproduzione
//         audioPlayer.play();
//         isPlaying = true;
//         currentSourceId = sourceId;
//     } else {
//         // Se è stato premuto lo stesso bottone
//         if (isPlaying) {
//             // Interrompi la riproduzione
//             audioPlayer.pause();
//             isPlaying = false;
//         } else {
//             // Avvia la riproduzione
//             audioPlayer.play();
//             isPlaying = true;
//         }
//     }
// }



// /******
//  * 
//  * 
//  * AUDIO VISUALIZER
//  * 
//  * 
//  */
// $(document).ready(function () {
//     init();
//     function init() {
//         var current = 0;
//         var audio = $('#audio');
//         var playlist = $('#playlist');
//         var tracks = playlist.find('li a');
//         var len = tracks.length - 1;
//         audio[0].play();
//         playlist.on('click', 'a', function (e) {
//             e.preventDefault();
//             link = $(this);
//             current = link.parent().index();
//             run(link, audio[0]);
//         });
//         audio[0].addEventListener('ended', function (e) {
//             current++;
//             if (current == len) {
//                 current = 0;
//                 link = playlist.find('a')[0];
//             } else {
//                 link = playlist.find('a')[current];
//             }
//             run($(link), audio[0]);
//         });
//     }
//     function run(link, player) {
//         player.src = link.attr('href');
//         par = link.parent();
//         par.addClass('active').siblings().removeClass('active');
//         player.load();
//         player.play();
//     }
// });
