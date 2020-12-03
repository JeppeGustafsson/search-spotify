const playerWrapper = document.getElementById('playerId');
const audioPlayer = document.getElementById('audio-player');
const searchBtn = document.getElementById('search-btn');
const listenSpotifyBtn = document.getElementById('listen-spotify');
const audioEl = document.getElementById('audio');
const imageEl = document.getElementById('cover-art');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const resultsWrapper = document.getElementById('search-results');
let token;

fetch("https://blooming-reef-63913.herokuapp.com/api/token")
    .then(response => response.json())
    .then(data => token = data.token);

let currentSong = 0;
let songs = [];

const search = async () => {
    songs = [];
    resultsWrapper.innerHTML = null;
    const query = document.getElementById('search').value;
    const API = `https://api.spotify.com/v1/search?q=${query}&type=track`;
    await fetch(API, {
        headers: {
            'authorization': 'Bearer ' + token
        }})
            .then(response => response.json())
            .then(data => songs = data.tracks.items);
    console.log(songs);
    insertSongData();
    renderSongList();
}

const renderSongList = () => {
    songs.forEach(song => {
        const content = `<div class="song"> 
                            <p id="${song.id}"> ${song.name}, ${song.artists[0].name} </p>
                        </song>`;
        resultsWrapper.innerHTML += content;
    });
    resultsWrapper.addEventListener('click', (e) => findIndex(e));
}

const findIndex = (e) => {
    const resultChildren = Array.from(resultsWrapper.children);
    const index = resultChildren.indexOf(e.target.parentElement);
    currentSong = index;
    insertSongData();
}

const insertSongData = () => {
    audioEl.src = songs[currentSong].preview_url;
    audioEl.src == 'https://jespergustafsson.com/music-player/null' ? 
    playerWrapper.classList.add('no-preview') :
    playerWrapper.classList.remove('no-preview');
    listenSpotifyBtn.addEventListener('click', () => {
        window.open(songs[currentSong].external_urls.spotify);
    });
    imageEl.src = songs[currentSong].album.images[1].url;
    title.innerHTML = songs[currentSong].name;
    artist.innerHTML = songs[currentSong].artists[0].name;
    
}

searchBtn.addEventListener('click', search);
document.getElementById('play').classList.add('play');
const playPause = () => {
    if (audioEl.paused) {
        audioEl.play();
        document.getElementById('play').classList.remove('play');
    } else {
        audioEl.pause();
        document.getElementById('play').classList.add('play');
    }
}

setInterval(() => {
    const progressBar = audioPlayer.querySelector(".progress");
    progressBar.style.width = audioEl.currentTime / audioEl.duration * 100 + "%";
},500);




document.getElementById('play').addEventListener('click', playPause);