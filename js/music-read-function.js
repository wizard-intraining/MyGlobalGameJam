
//注册小人
let player=document.getElementById('player')

console.log(player.style.left)
//注册音乐audio

let piano=[]
let violin=[]

for(let i=1;i<=7;i++){
const audio=document.createElement("audio");
audio.src="./src/music/singal-music-notes/piano/low"+i+".wav";//路径
piano.push(audio)
const audio2=document.createElement("audio");
audio2.src="./src/music/singal-music-notes/violin/low"+i+".wav";//路径
violin.push(audio2)
}

for(let i=1;i<=7;i++){
const audio=document.createElement("audio");
audio.src="./src/music/singal-music-notes/piano/mid"+i+".wav";//路径
piano.push(audio)
const audio2=document.createElement("audio");
audio2.src="./src/music/singal-music-notes/violin/mid"+i+".wav";//路径
violin.push(audio2)
}

const audio=document.createElement("audio");
audio.src="./src/music/singal-music-notes/piano/tall1.wav";//路径
piano.push(audio)
const audio2=document.createElement("audio");
audio2.src="./src/music/singal-music-notes/violin/tall1.wav";//路径
violin.push(audio2)

console.log(piano,violin)

//得出的arr一共15个音符，0-14对应low1-tall1


let playmode=false;
let instrucode=0  //乐器code 0--piano; 1--violin
let playmodeKeycodeTable=[49,50,51,52,53,54,55,81,87,69,82,84,89,85,73] //对应音符与键盘的keycode
let currentPlay=[] //从打开z到关上z的演奏记录

let hintSource=[['normalbump','./src/music/hintMusic/normalbump.wav']] //存一下src资源
let hintAudioDic=new Object() //给提示音注册audio然后存到这个dic里，被hintplay调用
for(let i=0;i<hintSource.length;i++){
    const audiotemp=document.createElement("audio");
    audiotemp.src=hintSource[i][1];//路径
    hintAudioDic[hintSource[i][0]]=audiotemp
}


// keydown时候的小人逻辑

document.addEventListener("keydown",keydown);


function keydown(event){
    console.log(event.keyCode);



//根据键盘码决定要干的事
    switch(event.keyCode){
        case 32: //空格
            //查看地图是否有可交互物体
            break;
        case 90: //z键切换playmode
            if(!playmode){
                currentPlay=[]
            }else{
                console.log(currentPlay)
            }
            playmode=!playmode;
            break;
        case 88: //x键切换instrument
            instrucode=instrucode ^ 1;
            break;
        default: //playmode和walkmode不兼容(不然会有逻辑问题)
            if(playmode){
                let newNote=musicplay(instrucode,event.keyCode)
                if(newNote!=-1) currentPlay.push(newNote)
                if(currentPlay.length>64) currentPlay.unshift() //超出部分覆盖掉之前的
            }else{
                move(event.keyCode)
            }
    }
    console.log(instrucode,playmode)
}



//音符播放
function musicplay(instrucode=0,keycode){
    let ind=playmodeKeycodeTable.indexOf(keycode)
    if(ind==-1) return -1
    let arr=instrucode==0?piano:violin
    arr[ind].pause();
    arr[ind].currentTime = 0;
    arr[ind].play()
    return `${instrucode}-${ind}`  //返回一个乐器+音符的标识值
}

//人物行走
function move(keycode,mapinfo){
    let mark
    switch(keycode){
        case 37: //←
            mark=moveTo(curloc.x,curloc.y,curloc.x-1,curloc.y)
            if(mark) {
                curloc.x-=1
                player.style.left=curloc.x*50+'px'
                
            }
            break;
        case 39: //→
            mark=moveTo(curloc.x,curloc.y,curloc.x+1,curloc.y)
            if(mark){
                curloc.x+=1
                 player.style.left=curloc.x*50+'px'
            }
            break;
        case 38: //↑
            mark=moveTo(curloc.x,curloc.y,curloc.x,curloc.y-1)
            if(mark) {
                curloc.y-=1
                player.style.top=curloc.y*50+'px'
                
            }
            break;    
        
        case 40: //↓
            mark=moveTo(curloc.x,curloc.y,curloc.x,curloc.y+1)
            if(mark) {
                curloc.y+=1
                player.style.top=curloc.y*50+'px'

            }
            break;
    }
}

//当：从上一个loc move 到一个新的loc时会发生的事：
// 1.无法到达，播放碰撞音，curloc不变
// 2.无法到达，但是有开门机关，播放别样碰撞音，监听currentPlay,如果成功匹配则播放开门音，curmap修改当前格挡为0
// 2.到达终点，进入下一关
//3.到达可交互物体附近：播放低音hint
//4.到达可交互物体上，按下空格键触发交互（卷轴的播放等）
function moveTo(curX,curY,newX,newY){
    
    if(newY<0 || newX<0 || newX>=24 || newY>=12 ){
        hintplay('normalbump')
        return false
    }
    if(newY-curY==1 && curmap[curY][curX][2]==1 || newX-curX==1 && curmap[curY][curX][1]==1){
        hintplay('normalbump')
        return false
    }
    if(newY-curY==-1 && curmap[newY][newX][2]==1 || newX-curX==-1 && curmap[newY][newX][1]==1){
        hintplay('normalbump')
        return false
    }
    return true
}


function hintplay(type,volume){
    let ad= hintAudioDic[type]
    ad.play()
    // if(volume)
}


//分割线---以下是map
var curloc={
    x:1,
    y:1
} 
var level=0 //当前关卡

//第一个值代表map上的物品状态码
// 第二个值代表方块右边的竖线
// 第三个值代表方块下边的横线
// 之所以使用线条是怕格挡的部分太占地图大小，目前是24*12的地图
// 线条的值：0--无格挡；1--普通格挡，
var map0=[
    [[0,0,0],[0,1,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],

    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],

    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0], /**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],/**/ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
]

var curmap=eval('map'+level) //map=当前关卡的map

