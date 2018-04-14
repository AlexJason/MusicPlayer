var MusicObj = function() {
    this.file = null;
    this.fileName = null;
    this.audioContext = null;
    this.info = document.getElementById('musicInfo').innerHTML;
    this.infoUpdateId = null;
    this.animationId = null;
    this.status = null;
    this.forceStop = false;
    this.allCapsReachBottom = false;
}

MusicObj.prototype = {
    //To initializate the class.
    init: function() {
        this._prepareAPI();
    },
    //To check if the explorer can use audio label.
    _prepareAPI: function() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            this.audioContext = new AudioContext();
        } catch (e) {
            this._updateInfo('!Your browser does not support AudioContext', false);
            console.log(e);
        }
    },

    _addEventListener: function() {
        var that = this;
        var audioInput = document.getElementById('file');
        var dropContainer = document.getElementById('canvas')[0];

        audioInput.onchange() = function() {
            if(that.audioContext === null) return;

            if(audioInput.files.length !== 0) {
                that.file = audioInput.files[0];
                that.fileName = that.file.name;
                if(that.status === 1)
                    that.forceStop = true;
                that._updateInfo('Uploading', true);
                that._start();
            }
        };
    },

    _start: function() {
        var that = this;
        var file = this.file;
        var fr = new FileReader();
        fr.onload = function(e) {
            var fileResult = e.target.result;
            var audioContext = that.audioContext;
            if (audioContext === null) {
                return;
            };
            that._updateInfo('Decoding the audio', true);
            audioContext.decodeAudioData(fileResult, function(buffer) {
                that._updateInfo('Decode succussfully,start the visualizer', true);
                that._visualize(audioContext, buffer);
            }, function(e) {
                that._updateInfo('!Fail to decode the file', false);
                console.error(e);
            });
        }
    }
}
