const boxs = document.querySelectorAll('.box');
const statusTxt = document.querySelector('#status');
const btnRestart = document.querySelector('#restart');
let x="<img src='x.png' width=80px>";
let o="<img src='o.png' width=80px>";
const win =[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board =[0,0,0,0,0,0,0,0,0];
let currentPlayer =x;
let running =false;

function start(){
  boxs.forEach(box=>box.addEventListener('click', boxClick));
  btnRestart.addEventListener('click',restartGame);
  statusTxt.textContent ='Your Turn';
  running =true;
}

function boxClick(){
  const index=this.dataset.index;
  if(board[index]!== 0 || !running) {
    return;
  }
  updateBox(this,index);
  checkWinner();
  if(running && currentPlayer===o) {
    setTimeout(compTurn,500);
  }
}

function updateBox(box,index){
  if (currentPlayer===x) {
    board[index]=-1;
    box.innerHTML=currentPlayer;
  } else {
    board[index]=1;
    box.innerHTML=currentPlayer;
  }
}

function changePlayer(){
  currentPlayer = (currentPlayer===x) ? o:x;
  statusTxt.textContent = (currentPlayer===x) ? 'Your Turn':'Computer Turn';
}

function checkWinner(){
  let isWon = false;
  for(let i=0; i<win.length; i++){
    const condition =win[i];
    const box1=board[condition[0]];
    const box2=board[condition[1]];
    const box3=board[condition[2]];
    if(box1===0 || box2===0 || box3===0){
      continue;
    }
    if(box1 === box2 && box2 === box3){
      isWon = true;
      boxs[condition[0]].classList.add('win');
      boxs[condition[1]].classList.add('win');
      boxs[condition[2]].classList.add('win');
    }
  }

  if(isWon){
    statusTxt.textContent = `${currentPlayer === x ? 'X' : 'O'} Won!`;
    running = false;
  } 
  else if(!board.includes(0)){
    statusTxt.textContent = 'Game Draw!';
    running = false;
  }
  else{
    changePlayer();
  }
}

function restartGame(){
  board=[0,0,0,0,0,0,0,0,0];
  currentPlayer=x;
  running=true;
  statusTxt.textContent='Your Turn';
  boxs.forEach(box=>{
    box.innerHTML = "";
    box.classList.remove('win');
  });
}

function minimax(board, player){
  let winner=analyzeBoard(board);
  if (winner!==0) {
    return winner*player;
  }
  let pos=-1;
  let value=-2;
  for(let i=0; i<9; i++){
    if(board[i]===0){
      board[i]=player;
      let score=-minimax(board,-player);
      board[i]=0;
      if(score>value) {
        value=score;
        pos=i;
      }
    }
  }
  return pos===-1?0:value;
}

function compTurn(){
  let pos =-1;
  let value =-2;
  for(let i=0; i<9; i++){
    if(board[i]===0){
      board[i]=1;
      let score=-minimax(board, -1);
      board[i]=0;
      if(score>value){
        value=score;
        pos=i;
      }
    }
  }
  if(pos!==-1){
    const box=document.querySelector(`[data-index='${pos}']`);
    updateBox(box,pos);
    checkWinner();
  }
}

function analyzeBoard(board){
  for(let i=0; i<win.length; i++){
    const [a, b, c]=win[i];
    if(board[a]!==0 && board[a]===board[b] && board[a]===board[c]){
      return board[a];
    }
  }
  return 0;
}

start();