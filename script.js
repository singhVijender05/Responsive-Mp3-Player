const backBtn=document.getElementById("backward")
const shuffle=document.getElementById("shuffle")
const playpause=document.getElementById("masterplaybtn")
const forward=document.getElementById("forward")
const repeat=document.getElementById("repeat")
const currentTime=document.getElementById('currentTime')
const currentSongName=document.getElementById("currentSongName")
const totalTime=document.getElementById('totalTime')
const seekbar=document.getElementById("progressbar")
const songsList=document.getElementById('listSongs')

const songObjects=[]
let isShuffleOn=0
let isRepeatOn=0
let currentSongIdx=0
const songs=[
    {
        songImg:"musiclogo.png",
        songName:"Let me love you",
        songPath:"music/1.mp3",
    },
    {
        songImg:"musiclogo.png",
        songName:"Hey babe",
        songPath:"music/2.mp3",
    },
    {
        songImg:"musiclogo.png",
        songName:"Heeriye ni",
        songPath:"music/3.mp3",
    }
]

window.onload=()=>{
    createAudioObjects()
}

playpause.addEventListener('click',()=>{
    masterPlay(currentSongIdx)
})

shuffle.onclick=()=>{
    isShuffleOn=!isShuffleOn
}
repeat.onclick=()=>{
    isRepeatOn=!isRepeatOn
}

forward.addEventListener('click',()=>{

    songObjects[currentSongIdx].pause();
    songObjects[currentSongIdx].currentTime=0;

    if (currentSongIdx < songObjects.length - 1) {
        currentSongIdx++;
    } else {
        currentSongIdx = 0; // Loop back to the first song if at the end
    }

    masterPlay(currentSongIdx);
})

backBtn.addEventListener('click',()=>{
    
    songObjects[currentSongIdx].pause();
    songObjects[currentSongIdx].currentTime=0;
    if(currentSongIdx>0){
        currentSongIdx--
    }
    else{
        currentSongIdx=0
    }  
    masterPlay(currentSongIdx)
})
setInterval(()=>{
    updateSeekbar(currentSongIdx)
},500)

seekbar.addEventListener('click',(e)=>{
    onClickProgressbar(currentSongIdx)
})



function createAudioObjects(){
    songsList.innerHTML=''
   for(let i=0;i<songs.length;i++){
        const audio = new Audio(`${songs[i].songPath}`);
        audio.preload = "auto";
        songObjects.push(audio);
        audio.addEventListener('loadedmetadata', function () {
            // Update the list item's duration when metadata is loaded
            songsList.childNodes[i].lastChild.previousSibling.innerHTML=formatDuration(songObjects[i].duration)
        });
        songsList.innerHTML+=listSongHtml(songs[i].songImg,songs[i].songName,i)
   }
}



// songObjects[currentSongIdx].ontimeupdate = function() {
//     updateSeekbar(currentSongIdx);
// };


function onClickProgressbar(idx){
    const progress=seekbar.value
    songObjects[idx].currentTime=Math.floor((progress*songObjects[idx].duration)/100)
}

function masterPlay(idx){
     if(songObjects[idx].paused){
        songObjects[idx].play()
        currentSongName.innerHTML=songs[idx].songName
        playpause.classList.remove('fa-play')
        playpause.classList.add('fa-pause')
     }
     else{
        songObjects[idx].pause()
        playpause.classList.remove('fa-pause')
        playpause.classList.add('fa-play')
     }
}


function updateSeekbar(idx){
    seekbar.value=Math.floor((songObjects[idx].currentTime)*100/songObjects[idx].duration)
    let min=Math.floor(songObjects[idx].currentTime/60)
    let sec=Math.floor(songObjects[idx].currentTime%60)
    currentTime.innerHTML=`${min}:${sec}`
    
    min=Math.floor(songObjects[idx].duration/60)
    sec=Math.floor(songObjects[idx].duration%60)
    totalTime.textContent=`${min}:${sec}`
    console.log(totalTime.textContent)
    if(songObjects[idx].duration<=songObjects[idx].currentTime && idx<songObjects.length-1){
        //updatesong
        currentSongIdx=nextSongToPlay()
        // playpause.classList.remove('fa-pause')
        // playpause.classList.add('fa-play')
        masterPlay(currentSongIdx)
    }
}

function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec}`;
}


function nextSongToPlay(){
    let idx=Math.floor(Math.random()*(songObjects.length-1))
    if(isShuffleOn && isRepeatOn){
        idx=currentSongIdx
    }
    else if(isShuffleOn){
        idx=idx
    }
    else if(isRepeatOn){
        idx=currentSongIdx
    }
    else{
        idx=currentSongIdx+1
    }
    return idx
}

function listSongHtml(imgPath,songName,idx){
    let totalDuration=songObjects[idx].duration
    console.log(totalDuration)
    return `<li  class="flex space-x-4 text-center"><span class="p-1 "><img class="w-5 rounded-full" src="${imgPath}" alt=""></span><span>${songName}</span><span>${formatDuration(totalDuration)}</span><span onclick="handlePlayBtn(this)"><i id="listplaybtn" class="fa-solid fa-play border-[1px] rounded-full px-2 py-[5px] cursor-pointer playpause"></i></span></li>`
}

function handlePlayBtn(e){
    let name=e.parentNode.firstElementChild.nextElementSibling.innerHTML
    console.log(name)
    for(let i=0;i<songs.length;i++){
        if(songs[i].songName===name){
            listPlay(i,e)
            break
        }
    }
}

function listPlay(idx,e){
    if(currentSongIdx!=idx){
        songObjects[currentSongIdx].currentTime=0
    }
        if(e.firstElementChild.classList.contains('fa-play')){
        e.firstElementChild.classList.remove('fa-play')
        e.firstElementChild.classList.add('fa-pause')
        console.log(e.firstElementChild.classList)
        
        currentSongIdx=idx
        songObjects[idx].play()
        playpause.classList.remove('fa-play')
        playpause.classList.add('fa-pause')
        updateSeekbar(idx)
    }
    else{
        e.firstElementChild.classList.remove('fa-pause')
        e.firstElementChild.classList.add('fa-play')
        console.log(e.firstElementChild.classList)
        currentSongIdx=idx
        songObjects[idx].pause()
        playpause.classList.remove('fa-pause')
        playpause.classList.add('fa-play')
        updateSeekbar(idx)
    }
}