function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
};
(function() {

    var content = $('#content');
    var video = $('#webcam')[0];

    var resize = function() {
        var w = $(document).width();
        var h = $(document).height() - 110;
        var ratio = video.width / video.height;
        if (content.width() > w) {
            content.width(w);
            content.height(w / ratio);
        } else {
            content.height(h);
            content.width(h * ratio);
        }
        content.css('left', (w - content.width()) / 2);
        content.css('top', ((h - content.height()) / 2) + 55);
    };

    $(window).resize(resize);
    $(window).ready(function() {
        resize();
        $('#watchVideo').click(function() {
            $(".browsers").fadeOut();
            $(".browsersWithVideo").delay(300).fadeIn();
            $("#video-demo").delay(300).fadeIn();
            $("#video-demo")[0].play();
            $('.backFromVideo').fadeIn();
            event.stopPropagation();
            return false;
        });
        $('.backFromVideo a').click(function() {
            $(".browsersWithVideo").fadeOut();
            $('.backFromVideo').fadeOut();
            $(".browsers").fadeIn();
            $("#video-demo")[0].pause();
            $('#video-demo').fadeOut();
            event.stopPropagation();
            return false;
        });
    });

    function hasGetUserMedia() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia);
    }

    if (hasGetUserMedia()) {
        $('.introduction').fadeIn();
        $('.allow').fadeIn();
    } else {
        $('.browsers').fadeIn();
        return;
    }

    var webcamError = function(e) {
        alert('Webcam error!', e);
    };

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            audio: false,
            video: true
        }, function(stream) {
            window.stream = stream;
            video.srcObject = stream;
            initialize();
        }, webcamError);
    } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({
            audio: false,
            video: true
        }, function(stream) {
            window.stream = stream;
            video.src = window.URL.createObjectURL(stream);
            initialize();
        }, webcamError);
    } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia({
            audio: false,
            video: true
        }, function(stream) {
            video.srcObject = stream;
            initialize();
        }, webcamError);
    }

    var AudioContext = (
        window.AudioContext ||
        window.webkitAudioContext ||
        null
    );

    var timeOut, lastImageData;
    var canvasSource = $("#camera1")[0];
    var canvasBlended = $("#urvagic")[0];

    var contextSource = canvasSource.getContext('2d');
    var contextBlended = canvasBlended.getContext('2d');

    var soundContext;
    var bufferLoader;
    var notes = [];
    contextSource.translate(canvasSource.width, 0);
    contextSource.scale(-1, 1);

    var c = 5;

    function initialize() {
        if (!AudioContext) {
            alert("AudioContext not supported!");
        } else {
            $('.introduction').fadeOut();
            $('.allow').fadeOut();
            $('.loading').delay(300).fadeIn();
            setTimeout(loadSounds, 1000);
        }
    }

    function loadSounds() {
        soundContext = new AudioContext();
        bufferLoader = new BufferLoader(soundContext, [
                '/Design/mp3/h.mp3',
                '/Design/mp3/a.mp3',
                '/Design/mp3/y.mp3',
                '/Design/mp3/a_4.mp3',
                '/Design/mp3/s.mp3',
                '/Design/mp3/t.mp3',
                '/Design/mp3/a_7.mp3',
                '/Design/mp3/n.mp3'
            ],
            finishedLoading
        );
        bufferLoader.load();
    }

    function finishedLoading(bufferList) {
        for (var i = 0; i < 8; i++) {
            var source = soundContext.createBufferSource();
            source.buffer = bufferList[i];
            source.connect(soundContext.destination);
            var note = {
                note: source,
                ready: true,
                visual: $("#hayastan" + i)
            };
            notes.push(note);
        }
        start();
    }

    function playSound(obj) {
        if (!obj.ready) return;
        var source = soundContext.createBufferSource();
        source.buffer = obj.note.buffer;
        source.connect(soundContext.destination);
        source.start(0);
        obj.ready = false;
        setTimeout(setNoteReady, 400, obj);
    }

    function setNoteReady(obj) {
        obj.ready = true;
    }

    function start() {
        $('.loading').fadeOut();
        $('body').addClass('black-background');
        $(".instructions").delay(600).fadeIn();
        $(canvasSource).delay(600).fadeIn();
        $(canvasBlended).delay(600).fadeIn();
        $("#tarer").delay(600).fadeIn();
        $(".motion-cam").delay(600).fadeIn();
        update();
    }

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function update() {
        drawVideo();
        blend();
        checkAreas();
        requestAnimFrame(update);
    }

    function drawVideo() {
        contextSource.drawImage(video, 0, 0, video.width, video.height);
    }

    function blend() {
        var width = canvasSource.width;
        var height = canvasSource.height;
        var sourceData = contextSource.getImageData(0, 0, width, height);
        if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
        var blendedData = contextSource.createImageData(width, height);
        differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
        contextBlended.putImageData(blendedData, 0, 0);
        lastImageData = sourceData;
    }

    function fastAbs(value) {
        return (value ^ (value >> 31)) - (value >> 31);
    }

    function threshold(value) {
        return (value > 0x15) ? 0xFF : 0;
    }

    function difference(target, data1, data2) {
        if (data1.length != data2.length) return null;
        var i = 0;
        while (i < (data1.length * 0.25)) {
            target[4 * i] = data1[4 * i] == 0 ? 0 : fastAbs(data1[4 * i] - data2[4 * i]);
            target[4 * i + 1] = data1[4 * i + 1] == 0 ? 0 : fastAbs(data1[4 * i + 1] - data2[4 * i + 1]);
            target[4 * i + 2] = data1[4 * i + 2] == 0 ? 0 : fastAbs(data1[4 * i + 2] - data2[4 * i + 2]);
            target[4 * i + 3] = 0xFF;
            ++i;
        }
    }

    function differenceAccuracy(target, data1, data2) {
        if (data1.length != data2.length) return null;
        var i = 0;
        while (i < (data1.length * 0.25)) {
            var average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
            var average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
            var diff = threshold(fastAbs(average1 - average2));
            target[4 * i] = diff;
            target[4 * i + 1] = diff;
            target[4 * i + 2] = diff;
            target[4 * i + 3] = 0xFF;
            ++i;
        }
    }

    function checkAreas() {
        for (var r = 0; r < 8; ++r) {
            var blendedData = contextBlended.getImageData(1 / 8 * r * video.width, 0, video.width / 8, 100);
            var i = 0;
            var average = 0;
            while (i < (blendedData.data.length * 0.25)) {
                average += (blendedData.data[i * 4] + blendedData.data[i * 4 + 1] + blendedData.data[i * 4 + 2]) / 3;
                ++i;
            }
            average = Math.round(average / (blendedData.data.length * 0.25));
            if (average > 10) {
                playSound(notes[r]);
                if (!notes[r].visual.is(':animated')) {
                    notes[r].visual.css({
                        opacity: 1
                    });
                    notes[r].visual.animate({
                        opacity: 0
                    }, 700);
                }

            }
        }
    }


})();
