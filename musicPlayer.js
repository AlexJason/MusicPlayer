var musics = new Array();//music source
var musicn = new Array();//music name
var musict = new Array();//music time
var musichz = new Array();
var mtime = 0;
var morder = 0;
var t;
var isplay = false;
var automode = 0;
//0 - Order by the list.
//1 - Play own forever.

function timecallback() {
    mtime++;
    if(mtime > musict[morder]) {
        autoplay();
        return;
    }
    t = setTimeout("timecallback()", 1000);
}

function autoplay() {
    switch(automode) {
        case 0: {
            resetmusic();
            if(morder + 1 >= musics.length)
                morder = 0;
            else
                morder++;
            playmusic();
        }
        case 1: {
            resetmusic();
            playmusic();
        }
    }
}

function playmusic() {
    t = setTimeout("timecallback()", 1000);
    musics[morder].play();
}

function pausemusic() {
    clearTimeout(t);
    musics[morder].pause();
}

function resetmusic() {
    mtime = 0;
    clearTimeout(t);
    document.getElementById("musicName").innerHTML = musicn[morder];
    musics[morder].pause();
    musics[morder].load();
}

function changePlayState(a) {
    var c = document.getElementById("playbtn");
    if (a) {
        c.innerHTML = "| |";
        c.style.left = "0px";
        c.style.bottom = "3px";
        c.style.fontWeight = "900";
    } else {
        document.getElementById("playbtn").innerHTML = "►";
        c.style.left = "2px";
        c.style.bottom = "0px";
        c.style.fontWeight = "100";
    }
}

function mplayorpause() {
    if (isplay) {
        isplay = false;
        changePlayState(isplay);
        pausemusic();
    } else {
        isplay = true;
        document.getElementById("musicName").innerHTML = musicn[morder];
        changePlayState(isplay);
        playmusic();
    }
}

function mstop() {
    isplay = false;
    changePlayState(isplay);
    pausemusic();
    resetmusic();
}

function mnext() {
    if (morder == 0 && morder + 1 >= musics.length)
        return;
    pausemusic();
    morder++;
    if (morder >= musics.length)
        morder = 0;
    resetmusic();
    if (isplay)
        playmusic();
}

function mlast() {
    if (morder == 0 && morder + 1 >= musics.length)
        return;
    pausemusic();
    morder--;
    if (morder < 0)
        morder = musics.length - 1;
    resetmusic();
    if (isplay)
        playmusic();
}

function importMusic(files) {
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        if (/audio+/.test(file.type)) {
            reader.onload = function() {
                for (var c in musicn) {
                    if (musicn[c] == file.name.replace(/.mp3$/, '')) {
                        alert('The music "' + file.name + '" has already existed!');
                        return;
                    }
                }
                var para = document.createElement("audio");
                var node = document.createElement("source");
                //var node2 = document.createTextNode('<audio id="music' + (musics.length + 1).toString() + '"><source src="' + this.result + '" type="audio/mp3" /></audio>');
                para.setAttribute("id", 'music' + (musics.length + 1).toString());
                node.setAttribute("src", this.result);
                node.setAttribute("type", "audio/mp3");
                para.appendChild(node);
                var element = document.getElementById("mlist");
                element.appendChild(para);
                var i = musics.length;
                musics[i] = document.getElementById("music" + (i + 1).toString());
                musics[i].load();
                musicn[i] = file.name.replace(/.mp3$/, '');
                para = document.createElement('li');
                var txt = document.createTextNode(musicn[musicn.length - 1]);
                para.setAttribute("onclick", "playmm(" + (musics.length - 1).toString() + ")");
                para.appendChild(txt);
                document.getElementById('mname').appendChild(para);
            };
            reader.readAsDataURL(file);
        }
    } else {
        return;
    }
    var i = musics.length - 1;
    while (isNaN(musics[i].duration));
    musict[i] = musics[i].duration;
    var analyser = musics[i].createAnalyser();
    musics[i].connect(analyser);
    analyser.connect(audioContext.destination);
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
}

function playmm(id) {
    if (isplay && morder == id)
        return;
    mstop();
    morder = id;
    isplay = true;
    document.getElementById("musicName").innerHTML = musicn[morder];
    changePlayState(isplay);
    playmusic();
}