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
        songImg:"images/musiclogo.png",
        songName:"Guli Mata",
        songPath:"./music/Guli-Mata_320(PaglaSongs).mp3"
    },
    {
        songImg:"images/musiclogo.png",
        songName:"Admirin You",
        songPath:"./music/Admirin You (MrJatt.Im).mp3"
    },
    {
        songImg:"images/musiclogo.png",
        songName:"2 Gulaab",
        songPath:"./music/Do Gulaab (MrJatt.Im).mp3"
    },
    {
        songImg:"images/musiclogo.png",
        songName:"California Love",
        songPath:"./music/California Love (MrJatt.Im).mp3"
    },
    {
        songImg:"images/musiclogo.png",
        songName:"Cheques",
        songPath:"./music/Cheques (MrJatt.Im).mp3"
    },
    {
        songImg:"images/musiclogo.png",
        songName:"Ishq",
        songPath:"./music/nirvairpannu.mp3"
    }
  
]

window.onload=()=>{
    createAudioObjects()
}

playpause.addEventListener('click',()=>{
    masterPlay(currentSongIdx)
})

shuffle.onclick=()=>{
    if(isShuffleOn){
        shuffle.innerHTML='shuffle'
    }
    else{
        shuffle.innerHTML='shuffle_on'
    }
    isShuffleOn=!isShuffleOn
}
repeat.onclick=()=>{
    if(isRepeatOn){
        repeat.innerHTML='repeat'
    }
    else{
        repeat.innerHTML='repeat_on'
    }
    isRepeatOn=!isRepeatOn
}

forward.addEventListener('click',()=>{

    songObjects[currentSongIdx].pause();
    songObjects[currentSongIdx].currentTime=0;
    let listItemByidx=findListItemByIdx(currentSongIdx)
    listItemByidx.classList.remove('fa-pause')
    listItemByidx.classList.add('fa-play')

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
    let listItemByidx=findListItemByIdx(currentSongIdx)
    listItemByidx.classList.remove('fa-pause')
    listItemByidx.classList.add('fa-play')
    if(currentSongIdx>0){
        currentSongIdx--
    }
    else{
        currentSongIdx=0
    }  
    masterPlay(currentSongIdx)
})



seekbar.onclick=()=>onClickProgressbar(currentSongIdx);
seekbar.addEventListener('input',()=>{
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
        //add audio object on event listener
        audio.addEventListener('timeupdate',()=>{
            updateSeekbar(currentSongIdx)
        })
        songsList.innerHTML+=listSongHtml(songs[i].songImg,songs[i].songName,i)
   }
}






function onClickProgressbar(idx){
    const progress=seekbar.value
    songObjects[idx].currentTime=Math.floor((progress*(songObjects[idx].duration))/100)+2
}

function masterPlay(idx){
     if(songObjects[idx].paused){
        songObjects[idx].play()
        currentSongName.innerHTML=songs[idx].songName
        playpause.classList.remove('fa-play')
        playpause.classList.add('fa-pause')
        let listItemByidx=findListItemByIdx(idx)
        listItemByidx.classList.remove('fa-play')
        listItemByidx.classList.add('fa-pause')
     }
     else{
        songObjects[idx].pause()
        playpause.classList.remove('fa-pause')
        playpause.classList.add('fa-play')
        let listItemByidx=findListItemByIdx(idx)
        listItemByidx.classList.remove('fa-pause')
        listItemByidx.classList.add('fa-play')
     }
}

function findListItemByIdx(idx){
    const listItems=songsList.childNodes
    return listItems[idx].lastElementChild.firstElementChild
}

function updateSeekbar(idx){
    seekbar.value=Math.floor((songObjects[idx].currentTime)*100/songObjects[idx].duration)
    let min=Math.floor(songObjects[idx].currentTime/60)
    let sec=Math.floor(songObjects[idx].currentTime%60)
    currentTime.innerHTML=`${min}:${sec}`
    
    min=Math.floor(songObjects[idx].duration/60)
    sec=Math.floor(songObjects[idx].duration%60)
    totalTime.textContent=`${min}:${sec}`
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
    return `<li  class="flex space-x-4 text-center"><span class="p-1 "><img class="w-5 rounded-full" src="${imgPath}" alt=""></span><span>${songName}</span><span>${formatDuration(totalDuration)}</span><span onclick="handlePlayBtn(this)"><i id="listplaybtn" class="fa-solid fa-play border-[1px] rounded-full px-2 py-[5px] cursor-pointer playpause"></i></span></li>`
}

function handlePlayBtn(e){
    let name=e.parentNode.firstElementChild.nextElementSibling.innerHTML
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
        songObjects[currentSongIdx].pause()
        e.parentNode.parentNode.childNodes[currentSongIdx].lastElementChild.firstElementChild.classList.remove('fa-pause')
        e.parentNode.parentNode.childNodes[currentSongIdx].lastElementChild.firstElementChild.classList.add('fa-play')
    }
        if(e.firstElementChild.classList.contains('fa-play')){
        e.firstElementChild.classList.remove('fa-play')
        e.firstElementChild.classList.add('fa-pause')
        
        currentSongIdx=idx
        songObjects[idx].play()
        playpause.classList.remove('fa-play')
        playpause.classList.add('fa-pause')
        updateSeekbar(idx)
        currentSongName.innerHTML=songs[idx].songName
    }
    else{
        e.firstElementChild.classList.remove('fa-pause')
        e.firstElementChild.classList.add('fa-play')
        currentSongIdx=idx
        songObjects[idx].pause()
        playpause.classList.remove('fa-pause')
        playpause.classList.add('fa-play')
        updateSeekbar(idx)
        currentSongName.innerHTML=songs[idx].songName
    }
}