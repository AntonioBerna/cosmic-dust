/*----------------------------------------------------*/
/* Quote Loop
------------------------------------------------------ */

function fade($ele) {
    $ele.fadeIn(1000).delay(5000).fadeOut(1000, function () {
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

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 800, 'swing', function () {
            window.location.hash = target;
        });
    });

});


TweenMax.staggerFrom(".heading", 0.8, { opacity: 0, y: 20, delay: 0.2 }, 0.4);

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
