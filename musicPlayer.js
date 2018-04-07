var musics = new Array();
var musicn = new Array();
var morder = 0;
var isplay = false;

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
        musics[morder].pause();
    } else {
        isplay = true;
        document.getElementById("musicName").innerHTML = musicn[morder];
        changePlayState(isplay);
        musics[morder].play();
    }
}

function mstop() {
    isplay = false;
    changePlayState(isplay);
    musics[morder].pause();
    musics[morder].load();
}

function mnext() {
    if (morder + 1 >= musics.length) {
        return;
    }
    musics[morder].pause();
    morder++;
    document.getElementById("musicName").innerHTML = musicn[morder];
    musics[morder].load();
    if (isplay) {
        musics[morder].play();
    }
}

function mlast() {
    if (morder - 1 < 0) {
        return;
    }
    musics[morder].pause();
    morder--;
    document.getElementById("musicName").innerHTML = musicn[morder];
    musics[morder].load();
    if (isplay) {
        musics[morder].play();
    }
}

function importMusic(files) {
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        if (/audio+/.test(file.type)) { //判断文件是不是imgage类型
            reader.onload = function() {
                var para = document.createElement("audio");
                var node = document.createElement("source");
                //var node2 = document.createTextNode('<audio id="music' + (musics.length + 1).toString() + '"><source src="' + this.result + '" type="audio/mp3" /></audio>');
                para.setAttribute("id", 'music' + (musics.length + 1).toString());
                node.setAttribute("src", this.result);
                node.setAttribute("type", "audio/mp3");
                para.appendChild(node);
                var element = document.getElementById("mlist");
                element.appendChild(para);
                musics[musics.length] = document.getElementById("music" + (musics.length + 1).toString());
                musicn[musicn.length] = file.name.replace(/.mp3$/, '');
            }
            reader.readAsDataURL(file);
        }
    }
}