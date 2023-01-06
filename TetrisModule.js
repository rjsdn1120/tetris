var size = 40;
var Row, Col;
var currentBlockType, nextBlockType = [], currentBlockTypePC;
var gameMode = false;
var guideMode = true;
var rotateMode = true;
var rotateType = true;

var blockOrderData = [];
var blockOrderDataPC = [];

var timer, autoTimer, comTimer, comAutoTimer;
var autoPlayMode = false;

var autoDropTime = 1000;
var autoPlayTime = 1000;

var userGameBoxID = "#gamebox";
var comGameBoxID = "#gameboxPC";

var blockSet = [[[0,4], [0,5], [1,4], [1,5]],	// 네모
					[[1,4], [0,3], [1,3], [1,5]],	// 니은
					[[1,4], [1,3], [1,5], [0,5]],	// 반대 니은
					[[1,4], [0,4], [1,5], [2,5]],	// 꼬부리
					[[1,5], [1,4], [0,5], [2,4]],	// 반대꼬부리
					[[1,4], [0,4], [2,4], [3,4]],	// ㅣ
					[[1,4], [1,3], [1,5], [0,4]]]	// ㅗ


function createBlock(boxID){
    return blockSet[nextBlockType[0]]
}

function fillBlock(boxID,block){
    console.log(block)
    for(var i=0;i<4;i++){
        $(boxID).find('tr').eq(block[i][0]).find('td').eq(block[i][1]).css('background-color','black')
        // console.log(i)
    }
}

function callbackTimer(boxID){
    for(var i=Row-2;i>=0;i--){
        for(var j=0;j<Col;j++){
            // console.log($(boxID).find('tr').eq(i).find('td').eq(j).css('background-color'))
            if($(boxID).find('tr').eq(i).find('td').eq(j).css('background-color')==='rgb(0, 0, 0)'){
                $(boxID).find('tr').eq(i).find('td').eq(j).css('background-color','white')
                $(boxID).find('tr').eq(i+1).find('td').eq(j).css('background-color','black')
            }
            else{
                // $(boxID).find('tr').eq(i).find('td').eq(j).css('background-color','red')
            }
        }
    }
    // console.log('1')
}

$("#startBtn").on("click", function(event){

    

	gameMode = true;
	$("label#score").text(0);
	$("#startBtn").css("visibility", "hidden");
	$(".matchResult").css("display", "none");
	$(userGameBoxID).css("opacity", "1.0");
	$(comGameBoxID).css("opacity", "1.0");
	$(userGameBoxID).focus();
	Row = Math.round($(userGameBoxID).height() / size);
	Col = Math.round($(userGameBoxID).width() / size);
	
	InitMap(userGameBoxID);
	// InitMap(comGameBoxID);
	createBlockOrderData();
    // $(userGameBoxID).find('tr').eq(0).find('td').eq(0).css('background-color','black')

	currentBlock = createBlock(userGameBoxID);
    fillBlock(userGameBoxID,currentBlock)
	// guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);

	// currentBlockPC = createBlock(comGameBoxID);
	// guideBlockPC = drawGuide(currentBlockPC, guideBlockPC, comGameBoxID);

	// timer = setTimeout(function(){
	// 	callbackTimer(userGameBoxID);
	// }, autoDropTime);

    timer = setInterval(function(){
		callbackTimer(userGameBoxID);
	}, autoDropTime);

	comTimer = setTimeout(function(){
		callbackTimer(comGameBoxID);
	}, autoDropTime);

	// comAutoTimer = setTimeout(function(){
	// 	callbackAutoTimer(comGameBoxID);
	// }, autoPlayTime);

});

//[제공코드 2]
$(userGameBoxID).on("keydown", function(event) {
	if(gameMode && !autoPlayMode){
		if(event.which == '37'){		// Left
			if(!isOverlayed(currentBlock, userGameBoxID)){
				moveBlock(event.which, currentBlock, userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
			else{
				currentBlock = createBlock(userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
		}
		else if(event.which == '39'){	// Right
			if(!isOverlayed(currentBlock, userGameBoxID)){
				moveBlock(event.which, currentBlock, userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
			else{
				currentBlock = createBlock(userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
		}
		else if(event.which == '40'){	// Down
			if(!isOverlayed(currentBlock, userGameBoxID)){
				moveBlock(event.which, currentBlock, userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
			else{
				currentBlock = createBlock(userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
		}
		else if(event.which == '38'){	// Up / Rotate
			rotateBlock(currentBlock, userGameBoxID);
			guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
		}
		else if(event.which == '90'){	// Z Key
			if(!isOverlayed(currentBlock, userGameBoxID)){
				dropBlock(currentBlock, userGameBoxID);
				currentBlock = createBlock(userGameBoxID);
				guideBlock = drawGuide(currentBlock, guideBlock, userGameBoxID);
			}
		}
	}
});


//[함수 설명(파라미터 제외)]
//InitMap() : 맵 생성
function InitMap(gameBoxID){

	if($(gameBoxID + ":has(tr)").length == 0){
		for(var i = 0; i < Row; i++)
			$(gameBoxID).append("<tr></tr>");
		for(var j = 0; j < Col; j++)
			$(gameBoxID + " tr").append("<td></td>");
	}

	for(var i = 0; i < Row; i++){
		for(var j = 0; j < Col; j++){
			$(gameBoxID + " tr").eq(i).children().eq(j).css("backgroundColor", "rgba(0, 0, 0, 0)");
			$(gameBoxID + " tr").eq(i).children().eq(j).attr("class", "originBlock");
		}
	}	
}

// createBlockOrderData() : 나올 블록 5천개 랜덤으로 생성해서 배열에 저장.
function createBlockOrderData(){
	for(var j = 0; j < 5000; j++){
		var tempData = [0, 1, 2, 3, 4, 5, 6];
		for(var i = 0; i < 20; i++){
			var val1 = Math.floor(Math.random() * 7);
			var val2 = Math.floor(Math.random() * 7);
			
			var temp = tempData[val1];
			tempData[val1] = tempData[val2];
			tempData[val2] = temp;
		}
		blockOrderData = blockOrderData.concat(tempData);
	}

	blockOrderDataPC = blockOrderData.slice();

	nextBlockType.push(blockOrderData.shift());
	nextBlockType.push(blockOrderData.shift());
}

// createBlock() : 신규 블록 띄우기
// fillBlock() : 블록 색칠하기
// isOverlayed() : 벽이나 다른 블록과 닿았는지 확인
// moveBlock() : 블록 이동
// rotateBlock() : 블럭 회전, 현재 위치에서 회전 가능한지 판단 필요

// [참고 코드 : 블럭 회전시 사용하는 수식]
var rotate90Mode = [[0, -1], [1, 0]]; // 시계방향
var rotate270Mode = [[0, 1], [-1, 0]]; // 반시계방향

// tempBlock = multiplyMatrix(tempBlock, rotate90Mode);

function multiplyMatrix(a, b) { 
	var aNumRows = a.length, aNumCols = a[0].length,
	bNumRows = b.length, bNumCols = b[0].length,
	m = new Array(aNumRows);  // initialize array of rows
	for (var r = 0; r < aNumRows; ++r) {
		m[r] = new Array(bNumCols); // initialize the current row
		for (var c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;             // initialize the current cell
			for (var i = 0; i < aNumCols; ++i) {
				m[r][c] += Math.round(a[r][i] * b[i][c]);
			}
		}
	}
	return m;
}