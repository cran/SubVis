<script type="text/javascript">

/*************************************************************************
 
    Copyright (C) 2016  Scott Barlowe

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
 ************************************************************************/

/*************************************************************
 * Filename:  SubVisDraw.js
 * 
 * Function for drawing alignments 
 * 
 *  @author: Scott Barlowe
 *  @Date:   May 25, 2016
 *  
 * ***********************************************************/

/*************************************************************
 * Name: clearCanvas
 * 
 * Clears canvas for drawing
 *
 * *********************************************************/
function clearCanvas(){

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  curX = 0;
  curY = 100;


}

/*************************************************************
 * Name: chooseDraw
 * 
 * Choose to display the overview or detail view
 * 
 * *********************************************************/
function chooseDraw(){
  
  if(overviewOn == true){
  
    drawOverview();
  
  }
  
  if(overviewOn == false){
    
    drawDetail();
    
  }
    
}

/*************************************************************
 * Name: drawOverview
 * 
 * Draws overview.  Overview consists of rows ordering the 
 * percent identity (PID) and alignment score of varying 
 * substitution matrices.  PID rows are normalized as one 
 * entity and the score is normalized as another entity. 
 *
 * *********************************************************/
function drawOverview(){
  
  var min;
  var max;
  
  setPercIdentAll();     // find the pid
  max = getNormalAll(0); // find max pid  
  min = getNormalAll(1); // find min pid
    
  for(var i = 0; i < allPointList.length; i++){
    
    drawPercIdent(i, min, max);  // normalize and draw
  }
  
  drawScore();  // draw the row scores
  
  mouseMoveOverviewPID();  // check mouse coordinates to check current
                           // PID selection
  
  if(isOn == false){
    
      mouseMoveOverviewSCR();  // check mouse coordinates to check current
                               // score selection
  }


}

/*************************************************************
 * Name: getNormalAll
 * 
 * Normalizes percent identity in overview.  
 * 
 *  @param: minOrMax  0-->find the max
 *                    1-->find the min
 * 
 *  @returns: min or max depending on minOrMax
 *
 * *********************************************************/
function getNormalAll(minOrMax){
 
  pointList = allPointList[0].pL;
  
  var norm = pointList[0].percIdent;
   
  for(var i = 0; i < allPointList.length; i++){
    
    pointList = allPointList[i].pL;
    
    for(var j = 0; j < pointList.length; j++){
  
      if(pointList[j].percIdent > norm && minOrMax == 0){
      
        norm = pointList[j].percIdent; 
      
      }
    
      if(pointList[j].percIdent < norm && minOrMax == 1){
        
        norm = pointList[j].percIdent;
        
      }
  
    }  
  
  }
  
  return norm;
  
}

/*************************************************************
 * Name: drawDetail
 * 
 * Draw the detail view (amino acid level) 
 * 
 *
 * *********************************************************/
function drawDetail(){ 

  firstIter = true;   // tell if this is first draw of details
   
  var len = pointList.length;
   
  // clear pointList 
  for(var i = 0; i < len; i++){
    
    pointList.pop();
    
  }
  
  len =  subCrdStore.length;
   
  // clear displayed substitution coordinates 
  for(var i = 0; i < len; i++){
    
    subCrdStore.pop();
    
  }

  
  // draw alignments in pattern-subject pairs
  if(pairLayout == 0){
     
    for(var i = startProt; i < alignments.length; i+=OBJ_OFFSET){
        
      drawPairLayout(i);
      
    }
    
    // display meta information
    drawMetaText();
       
    }
   
  else{
     
    // draw pattern only 
    if(pairLayout == 1){
      
      var titleNum = 0;     
      
      drawTypeTitle(titleNum);    
      
      for(var i = startProt; i < alignments.length; i+=OBJ_OFFSET){
        
        drawTypeLayout(i, titleNum);

      }
      
    }

    // draw subject only
    if(pairLayout == 2){

      titleNum = 1;
    
      drawTypeTitle(titleNum);
      
      for(var i = startProt; i < alignments.length; i+=OBJ_OFFSET){
        
        drawTypeLayout(i, titleNum);

      }
     
    }
    
  }
  
  drawMouseMove();   // check mouse coordinates for detail view

  if(classification > 0 && classification != 8){   // draw legend for classification > 0
  
    drawLegend();   
  
  }

}

/*************************************************************
 * Name: drawScore
 * 
 * Draws normalized, ordered row of alignment scores in 
 * overview.
 *
 * *********************************************************/
function drawScore(){
  
  scoreList = [];
  
  for(var i = 0; i < alignments.length; i = i + OBJ_OFFSET){
    
    scoreList.push({alignScore: alignments[i + SCR_SLOT], 
                    matrixType: alignments[i + MATRIX_SLOT], 
                    x:  0, y: 0, percIdent: 0}); 
  }
  
  scoreList.sort(function(a,b){return a.alignScore - b.alignScore});
  
  var range;
  
  //find max for normalization
  //find min for normalization
  var max = scoreList[scoreList.length - 1].alignScore;
  var min = scoreList[0].alignScore;
  
  if(min == max){
    
    range = 1;
    
  }
  
  else{
    
    range = max-min;
    
  }
  
  ctx.fillStyle = '#000000';
  ctx.font = "14px Arial";
  ctx.fillText("Score", 10, lastCurY + RECT_HEIGHT*3 + RECT_HEIGHT);
  
  curX = LEFT_MARGIN + 10;
  curY = lastCurY + RECT_HEIGHT*3;
  
  for(var i = 0; i < scoreList.length; i++){
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
          
    ctx.beginPath();
    ctx.moveTo(curX, curY);
    ctx.lineTo(curX, curY + RECT_HEIGHT);
    ctx.lineTo(curX + RECT_WIDTH*4, curY + RECT_HEIGHT);
    ctx.lineTo(curX + RECT_WIDTH*4, curY);
    ctx.lineTo(curX, curY);

    var num = (((scoreList[i].alignScore - min)*1.0)/(range))*255.0;   // normalize
    num = Math.floor(num);
    
    var temp = "";
    var temp2 = null;
    
    if(isOn == true){
      
      if(currentMatrixLabel == scoreList[i].matrixType.toString()){
        
        temp2 = temp.concat("rgb(", (num).toString(),
                            ", 40,", (255-num).toString(), ")");
      }
      
      else{
        
        temp2 = temp.concat("rgb(", (200).toString(),
                            ", 200,", (200).toString(), ")");
      }
      
    }
    
    else{
      
      temp2 = temp.concat("rgb(", (num).toString(),
                          ", 40,", (255-num).toString(), ")");
    }
      
    ctx.fillStyle = temp2;
    ctx.fill();  
    ctx.stroke();
    ctx.closePath();
    
    ctx.fillStyle = '#000000';
    ctx.font = "14px Arial";
    ctx.fillText(getMatrixString(scoreList[i].matrixType, 2), 
                                 curX + 10, curY - 10);
    scoreList[i].x = curX;
    scoreList[i].y = curY;

    curX = curX + RECT_WIDTH*4;
  
  }
  
}

/*************************************************************
 * Name: drawPercIdent
 * 
 * Draws the percent identity rows in overview.
 * 
 *  @param: pointListIndex  index into the list of percent 
 *                             identity objects containing pid, 
 *                              x coord, y coord, etc. 
 *  @param: min             min percent identity of all PIDs
 *                             for normalization
 *  @param: max             max percent identity of all PIDs
 *                             for normalization
 *
 * *********************************************************/
function drawPercIdent(pointListIndex, min, max){
  
  pointList = allPointList[pointListIndex].pL;
  
  var range;
  
  //find max for normalization
  //find min for normalization
  if(min == max){
    range = 1;
  }
  else
  {
    range = max-min;
  }
  
  ctx.fillStyle = '#000000';
  ctx.font = "14px Arial";

  var tempText = "PID ";
  ctx.fillText(tempText.concat(pointList[0].pid), 10, 
               pointList[0].y + RECT_HEIGHT);
  
  for(var i = 0; i < pointList.length; i++){
    
    curX = pointList[i].x;
    curY = pointList[i].y;
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
          
    ctx.beginPath();
    ctx.moveTo(curX, curY);
    ctx.lineTo(curX, curY + RECT_HEIGHT);
    ctx.lineTo(curX + RECT_WIDTH*4, curY + RECT_HEIGHT);
    ctx.lineTo(curX + RECT_WIDTH*4, curY);
    ctx.lineTo(curX, curY);

    var num = (((pointList[i].percIdent - min)*1.0)/(range))*255.0;   // normalize
    num = Math.floor(num);
    
    var temp = "";
    var temp2 = null;
    
    if(isOn == true){
      
      if(currentMatrixLabel == pointList[i].matrixType.toString()){
        
        temp2 = temp.concat("rgb(", (num).toString(),
                            ", 40,", (255-num).toString(), ")");
      }
      
      else{
        
        temp2 = temp.concat("rgb(", (200).toString(),
                            ", 200,", (200).toString(), ")");
        
      }
      
    }
    
    else{
      
      temp2 = temp.concat("rgb(", (num).toString(),
                          ", 40,", (255-num).toString(), ")");
    }
      
    ctx.fillStyle = temp2;
    ctx.fill();  
    ctx.stroke();
    ctx.closePath();
    
    ctx.fillStyle = '#000000';
    ctx.font = "14px Arial";
    ctx.fillText(getMatrixString(pointList[i].matrixType, 2), curX + 10, curY - 10);
  
  }
      
}

/*************************************************************
 * Name: setPercIdentAll
 * 
 * Populates pointList with x/y coords, percent identity,
 * percent identity type, and substitution matrix type.  Adds
 * to master point list (allPointList)
 *
 * *********************************************************/
function setPercIdentAll(){

  pointList    = [];
  allPointList = [];
  
  curY = 75;
  
  for(var i = 0; i < NUM_OF_PIDS; i++){

    pointList = [];
    
    //classification = i;
    
    for(var j = 0; j < alignments.length; j+=OBJ_OFFSET){
    
      var percId = parseFloat(alignments[j + PID_1_SLOT + i]);
      
      pointList.push({x: 0, y: 0, matrixType: alignments[j+MATRIX_SLOT], 
                      pid: i.toString(), percIdent: Math.floor(percId*100)});

    }

    pointList.sort(function(a,b){return a.percIdent - b.percIdent});

    curX = LEFT_MARGIN + 10;

    for(var j = 0; j < pointList.length; j++){
    
      pointList[j].x = curX;
      pointList[j].y = curY;
      curX += RECT_WIDTH*4;    

    }
    
    curY += RECT_HEIGHT*2 + 20;

    allPointList.push({pL: pointList.slice()});

    lastCurY = curY;
    
  }

}

/*************************************************************
 * Name: mouseMoveOverviewPID
 * 
 * Manages mouse over selection of percent identity rows by
 * checking mouse coordinates in overview
 *
 * *********************************************************/
function mouseMoveOverviewPID(){
  
  var tempMatrixType;

  isOn = false;

  for(var j = 0; j < allPointList.length; j++){ 
    
    pointList = allPointList[j].pL;
    
    for(var i = 0; i < pointList.length; i++){
    
      if(mouseX > pointList[i].x && mouseX < pointList[i].x + RECT_WIDTH*4 &&
         mouseY > pointList[i].y && mouseY < pointList[i].y + RECT_HEIGHT){
      
        ctx.fillStyle = '#000000';
        ctx.font = "14px Arial";
      
        tempMatrixType = pointList[i].matrixType;
        isOn = true;
        var matString = getMatrixString(pointList[i].matrixType.toString(), 1);
    
        var scoreMatInd = 0;
      
        for(var k = 0; k < scoreList.length; k++){
        
          if(scoreList[k].matrixType == tempMatrixType){
          
            scoreMatInd = k;
          
          }
        
        }
      
        ctx.fillText("Type: " + matString, myCanvasProt.width - 150, 
                     myCanvasProt.height - 80);
                   
        ctx.fillText("Perc Iden: " + pointList[i].percIdent, 
                     myCanvasProt.width - 150, myCanvasProt.height - 50);
                   
        ctx.fillText("Score: " + scoreList[scoreMatInd].alignScore.toString(),
                     myCanvasProt.width - 150, myCanvasProt.height - 20);
        
      }
    
    }
  
  }

  if(isOn == true){
    
    isOnAllPointsList(tempMatrixType);
  }
  
}

/*************************************************************
 * Name: isOnAllPointsList
 * 
 * Outlines selected subsitution matrix PID on mouse over
 * in overview.
 * 
 *  @param: tempMatrixType   Substitution matrix type
 * 
 * *********************************************************/
function isOnAllPointsList(tempMatrixType){
  
  for(var j = 0; j < allPointList.length; j++){
    
    pointList = allPointList[j].pL;
        
    for(var i = 0; i < pointList.length; i++){
    
      if(tempMatrixType == pointList[i].matrixType){
        
        curX = pointList[i].x;
        curY = pointList[i].y;
    
        ctx.strokeStyle = "black";
        currentMatrixLabel = pointList[i].matrixType.toString();
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(curX, curY + RECT_HEIGHT);
        ctx.lineTo(curX + RECT_WIDTH*4, curY + RECT_HEIGHT);
        ctx.lineTo(curX + RECT_WIDTH*4, curY);
        ctx.lineTo(curX, curY);
        ctx.stroke();
        ctx.closePath();
      }
        
    }
      
  }
  
}

/*************************************************************
 * Name: mouseMoveOverviewSCR
 * 
 * Manages mouse over selection of alignment score row by
 * checking mouse coordinates (overview)
 *
 * *********************************************************/
function mouseMoveOverviewSCR(){
  
  var tempMatrixType;
  isOn = false;

  for(var i = 0; i < scoreList.length; i++){
    
    if(mouseX > scoreList[i].x && mouseX < scoreList[i].x + RECT_WIDTH*4 &&
       mouseY > scoreList[i].y && mouseY < scoreList[i].y + RECT_HEIGHT){
      
      ctx.fillStyle = '#000000';
      ctx.font = "14px Arial";
  
      tempMatrixType = scoreList[i].matrixType;
      isOn = true;
      var matString = getMatrixString(scoreList[i].matrixType.toString(), 1);
      
      var pointMatInd = 0;
      
      for(var k = 0; k < scoreList.length; k++){
        
        if(pointList[k].matrixType == tempMatrixType){
          
           pointMatInd = k;
           
        }
        
      }
      
      ctx.fillText("Type: " + matString, myCanvasProt.width - 150,  
                   myCanvasProt.height - 80);
                   
      ctx.fillText("Perc Iden: " + pointList[pointMatInd].percIdent, 
                   myCanvasProt.width - 150, myCanvasProt.height - 50);
                   
      ctx.fillText("Score: " + scoreList[i].alignScore.toString(), 
                   myCanvasProt.width - 150, myCanvasProt.height - 20);
                   
    }
    
  }

  if(isOn == true){
        
        isOnScoreList(tempMatrixType);
  }

}

/*************************************************************
 * Name: isOnScoreList
 * 
 * Outlines selected substituion matrix score on mouse over
 * in overview.
 * 
 *  @param: tempMatrixType   Substitution matrix type
 * 
 * *********************************************************/
function isOnScoreList(tempMatrixType){
  
  for(var i = 0; i < scoreList.length; i++){
    
    if(tempMatrixType == scoreList[i].matrixType){
        
      curX = scoreList[i].x;
      curY = scoreList[i].y;
    
      ctx.strokeStyle = "black";
      currentMatrixLabel = scoreList[i].matrixType.toString();
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX, curY + RECT_HEIGHT);
      ctx.lineTo(curX + RECT_WIDTH*4, curY + RECT_HEIGHT);
      ctx.lineTo(curX + RECT_WIDTH*4, curY);
      ctx.lineTo(curX, curY);
      ctx.stroke();
      ctx.closePath();
    }
      
  }
    
}

/*************************************************************
 * Name: drawMetaText
 * 
 * Draws meta data and for pattern-subject pairs in detail
 * view.
 * 
 * *********************************************************/
function drawMetaText(){
  
  ctx.fillStyle = '#000000';
    
  ctx.font = "12px Arial";
  ctx.fillText("Gap: ", 10, 20);
  ctx.fillText("Ext: ", 10, 40);
  ctx.fillText("Scope: ", 10, 60);

  ctx.fillText(paramsList[0], 50, 20);   // gap penalty
  ctx.fillText(paramsList[1], 50, 40);   // ext. penalty
  ctx.fillText(paramsList[2], 50, 60);   // scoring scheme
    
  ctx.fillText("Pattern: ", 10, 80);
  ctx.fillText("Subject: ", 10, 100);

  ctx.fillText(metaList[0], 75, 80);     // fasta meta data
  ctx.fillText(metaList[2], 75, 100);    // fasta meta data

}

/*************************************************************
 * Name: drawPairLayout
 * 
 * Draws the index of the left-most sequence column and the 
 * index of the right-most sequence column in 
 * pattern-subject pairs. (detail view)
 * 
 *  @param: i           Current sequence 
 * 
 * *********************************************************/
function drawPairLayout(i){
          
  var beginIndexCurX;
  var beginIndexCurY;
  var endIndexCurX;
  
  curX = LEFT_MARGIN;
  curY = curY + RECT_HEIGHT*2;
       
  if(i == startProt){
    
    if(beginMark < 0){
      
        beginMark = 0;
        
    }
    
    drawIndex(String(beginMark + 1), curX + RECT_WIDTH + SPACE_X , curY, false);
    
  }
  
  drawLabels(alignments[i + MATRIX_SLOT], alignments[i + SCR_SLOT]);
  
  drawProtAlignment(alignments[i + SUBJ_SLOT ], alignments[i + PATT_SLOT],
                    alignments[i + PATT_ST_SLOT], 
                    alignments[i + PATT_ED_SLOT],
                    alignments[i + MATRIX_SLOT]);

  curX = LEFT_MARGIN;
  curY = curY + RECT_HEIGHT + SPACE_BTW_ROWS;
  
  drawProtAlignment(alignments[i + PATT_SLOT], alignments[i + SUBJ_SLOT], 
                    alignments[i + SUBJ_ST_SLOT], 
                    alignments[i + SUBJ_ED_SLOT],
                    alignments[i + MATRIX_SLOT]);

}


/*************************************************************
 * Name: drawTypeLayout
 * 
 * Draws the index of the left-most sequence column and the 
 * index of the right-most sequence column in detail view.
 * 
 *  @param: i           Current sequence 
 *  @param: pattOrSub   Drawing either the pattern or subject
 *                      0-->pattern
 *                      1-->subject
 * 
 * *********************************************************/
function drawTypeLayout(i, pattOrSub){
  
  var beginIndexCurX;
  var beginIndexCurY;
  var endIndexCurX;
  
  curX = LEFT_MARGIN;
  curY = curY + RECT_HEIGHT * 3;
  
  if(i == startProt/* && pattOrSub == 0*/){
    
    if(beginMark < 0){
      
        beginMark = 0;
        
    }
    
    drawIndex(String(beginMark + 1), curX + RECT_WIDTH + SPACE_X , curY, false);
    
  }
  
  drawLabels(alignments[i + MATRIX_SLOT], alignments[i + SCR_SLOT]);
  
  if(pattOrSub == 0){

    drawProtAlignment(alignments[i + SUBJ_SLOT], 
                      alignments[i + PATT_SLOT], 
                      alignments[i + PATT_ST_SLOT], 
                      alignments[i + PATT_ED_SLOT],
                      alignments[i + MATRIX_SLOT]);
    
  }
  
  else{
    
    drawProtAlignment(alignments[i + PATT_SLOT], 
                      alignments[i + SUBJ_SLOT],
                      alignments[i + SUBJ_ST_SLOT], 
                      alignments[i + SUBJ_ED_SLOT],
                      alignments[i + MATRIX_SLOT]);

  }
  
  curX = LEFT_MARGIN;
  curY = curY + SPACE_BTW_ROWS /2;

}

/*************************************************************
 * Name: drawIndex
 * 
 * Draws the index of the left-most sequence column and the 
 * index of the right-most sequence column in detail view.
 * 
 *  @param: val    left-most index
 *  @param: x      x coordinate where to draw index value
 *  @param: y      y coordinate where to draw index value
 *  @param: isEnd  if the value to be displayed is past the
 *                      viewable area  
 * 
 * *********************************************************/
function drawIndex(val, x, y, isEnd){
  
  ctx.fillStyle = '#000000';
  ctx.font = "12px Arial";
  
  if(isEnd == true && val >= 100){
    
    ctx.fillText(val, x - 15, y - SPACE_Y);
    
  }
  
  else if(isEnd == true && val >= 1000){
    
    ctx.fillText(val, x - 25, y - SPACE_Y);
    
  }
  
  else if(isEnd == true && val >= 10000){
    
    ctx.fillText(val, x - 35, y - SPACE_Y);
    
  }
  
  else{
    
    ctx.fillText(val, x, y - SPACE_Y);
    
  }

}

/*************************************************************
 * Name: drawMouseMove
 * 
 * Manages mouse over selection of alignment sequences
 * checking mouse coordinates in detail view.  Initiates
 * histogram drawing, position drawing, amino acid 
 * drawing, and log odds drawing
 *
 * *********************************************************/
function drawMouseMove(){
  
  var checkCol       = null;
  var tempMatrixType = null;
  
  // Determine mouse coordinates and retrieve approprite amino acid
  
  for(var i = 0; i < pointList.length; i++){
    
    if(mouseX > pointList[i].x && mouseX < pointList[i].x + RECT_WIDTH &&
       mouseY > pointList[i].y && mouseY < pointList[i].y + RECT_HEIGHT){
      
      ctx.fillStyle = '#000000';
      ctx.font = "14px Arial";
      ctx.fillText(" AA: " + pointList[i].abbrev, myCanvasProt.width - 110, 80);
      ctx.fillText("PO: " + pointList[i].aaNum, myCanvasProt.width - 60, 80);
      checkCol = pointList[i].aaNum - 1;
      tempMatrixType = pointList[i].mat.toString();
    }
    
  }
  
  // Draw histogram by checking members of selected column
  
  var colAlpha = [];
  
  if(checkCol != null){ 
    
    for(var i = startProt; i < alignments.length; i += OBJ_OFFSET){
    
      var tempString;
      
      if(pairLayout == 0 || pairLayout == 1){
      
        tempString = alignments[i];
        
      }
      
      if(pairLayout == 2){
      
        tempString = alignments[i + SUBJ_SLOT ];
        
      }
      
      if(checkCol < tempString.length){
      
        var colContains = getColContains(colAlpha, tempString[checkCol]);
      
        if(colContains == -1){

          colAlpha.push({s: tempString[checkCol], c: 1});
        
        }
      
        else{

          var tempC = colAlpha[colContains].c;
          tempC++;
          colAlpha[colContains].c  = tempC;

        }
        
      }
      
      if(pairLayout == 0){
      
        tempString = alignments[i + SUBJ_SLOT ]; 
      
        if(checkCol < tempString.length){
          
          var colContains = getColContains(colAlpha, tempString[checkCol]);
      
          if(colContains == -1){

          colAlpha.push({s: tempString[checkCol], c: 1});
          
          }
      
          else{

            var tempC = colAlpha[colContains].c;
            tempC++;
            colAlpha[colContains].c  = tempC;
  
          }
      
        }
        
      }
    
    }

  }

  // Draw historgram and log odds

  if(checkCol != null){
    
    colAlpha.sort(function(a,b){return a.c - b.c});
    colAlpha.reverse();
    
    var xTemp = 50;
    var yTemp = 300;
    
    drawColAlpha(colAlpha, tempMatrixType);
    drawLogOdds(checkCol, tempMatrixType, 1, 0, 0);

    var probX = 5;
    var probY;
    var probYCnt = 0; // counter for substitution display coordinates
    
    for(var i = startProt; i < alignments.length; i += OBJ_OFFSET){
      probY = subCrdStore[probYCnt];
      drawLogOdds(checkCol, alignments[i + MATRIX_SLOT], 2, probX, probY);
      probYCnt++;
    }
  }
}

/*************************************************************
 * Name: drawLogOdds
 * 
 * Retrieves the log odds score for the selected amino acid
 * in a pattern-subject pair.
 *
 * @param: checkCol        Selected column
 * @param: tempMatrixType  Substitution matrix type
 * @param: probLoc         1 --> draw in upper left corner
 *                               always available on mouseover
 *                         2 --> draw beside alignment
 *                               (with score and matrix type)
 *                               available only when 
 *                               pattern-subject pairs are drawn
 * @param: probX           x coordinate of substitution prob
 *                            or log odds value
 * @param: probY           y coordinate of sustitution prob
 *                            or log odds value
 * 
 * *********************************************************/
function drawLogOdds(checkCol, tempMatrixType, probLoc, probX, probY){
  
  var alignIndex = null;
 
  // Find correct matrix type
  
  for(var i = startProt; i < alignments.length; i++){
    
    if(tempMatrixType == alignments[i + MATRIX_SLOT]){
      
      alignIndex = i;
      
    }
    
  }
  
  // Get matrix according to matrix type
  
  var tempMat = getMatrixString(tempMatrixType, 3);
  
  // Get the selected pattern and subject alignments
  
  var tempAlign1 = alignments[alignIndex + PATT_SLOT];
  var tempAlign2 = alignments[alignIndex + SUBJ_SLOT];
  
  // Find the selected amino acid
  
  var tempAA1 = tempAlign1[checkCol];
  var tempAA2 = tempAlign2[checkCol];
  
  // Handle LO for gaps 
  // (Possible:  Substitute wildcard for gaps)
  
  var skipLO = false;
  var logOdds = "undef";
  
  if(tempAA1 == "-"){
    
    //tempAA1 = "*";  Possibly substitute wildcard
    skipLO = true;
    
  }
  
  if(tempAA2 == "-"){
    
    //tempAA2 = "*";  Possibly substitute wildcard
    skipLO = true;
    
  }
  
  // Get matrix alphabet
  if(skipLO == false){
  
    var tempName1 = getMatrixString(tempMatrixType, 4);
    var tempName2 = getMatrixString(tempMatrixType, 4);
  
    var tempInd1  = null;
    var tempInd2  = null;
  
  // Finds index of each amino acid in the pair
  
    for(var i = 0; i < tempName1.length; i++){
    
      if(tempAA1 == tempName1[i]){
      
        tempInd1 = i;
      
      }
    
    }
  
    for(var i = 0; i < tempName2.length; i++){
    
      if(tempAA2 == tempName2[i]){
      
        tempInd2 = i;
      
      }
    
    }
  
  // Indexes into scoring matrix and prints result
  
    logOdds = tempMat[tempInd1][tempInd2];
  }
  
  ctx.fillStyle = '#000000';
  
  if(probLoc == 1){
    ctx.fillText("LO: " + logOdds, myCanvasProt.width - 110, 20);
    ctx.fillText("SUB: " + tempAA1 + " --> " + tempAA2, myCanvasProt.width - 110, 50); 
  }
  
  if(probLoc == 2){
    ctx.font = "12px Arial";
    ctx.fillText(logOdds + "  ( " + tempAA1 + " --> " + tempAA2 + " ) ", probX, probY);
  }  
}



/*************************************************************
 * Name: getColContains
 * 
 * Checks for matching residues in the current sequence
 * column. (detail view)
 * 
 *  @param: cA  List of residue-frequency values of present 
 *              residues for the current colum in the 
 *              sequences.
 *  @param: tS  Residue for which to check matches
 * 
 *  @returns: index of match or -1 if no match
 * *********************************************************/
function getColContains(cA, tS){
  
  for(var i = 0; i < cA.length; i++){
    
    if(cA[i].s == tS){
      
      return i;
    
    }
    
  }
  
  return -1;
  
}

/*************************************************************
 * Name: drawColAlpha
 * 
 * Draws residue histogram for the current column in detail 
 * view.  Activated on mouse over.
 * 
 *  @param: cA              Sorted list of frequency values of 
 *                          present residues for the current 
 *                          colum in the sequences.
 *  @param: tempMatrixType  Substitution matrix type
 * 
 * *********************************************************/
function drawColAlpha(cA, tempMatrixType){
  
  var xTemp = 300;
  var yTemp = TOP_MARGIN * 3;
  var totalCount = 0;
  
  for(var i = 0; i < cA.length; i++){
    
    totalCount = totalCount + cA[i].c;
    
  }
  
  var temp = -1; // variable that draws original color
                 // if conservation classification is on
    
  for(var i = 0; i < cA.length; i++){
    
    if(classification == 8){
      temp = classification;
      classification = 0;
    }

    getColor(cA[i].s, i, cA.length, tempMatrixType)
    
    if(temp == 8){
      classification = 8;
    }
    
    ctx.beginPath();
    ctx.moveTo(xTemp, yTemp - 20);
    ctx.lineTo(xTemp, 
               yTemp - (20 + Math.floor((TOP_MARGIN * 0.75) * 3 
               * cA[i].c / (totalCount * 1.0))));
               
    ctx.lineTo(xTemp + RECT_WIDTH, 
               yTemp - (20 + Math.floor((TOP_MARGIN * 0.75) * 3 
               * cA[i].c / (totalCount * 1.0))));
               
    ctx.lineTo(xTemp + RECT_WIDTH, yTemp - 20);
    ctx.lineTo(xTemp, yTemp - 20);
    ctx.fill();
    ctx.closePath();
    
    ctx.fillStyle = '#000000';
    ctx.fillText(cA[i].s + ": " + cA[i].c, xTemp, yTemp);
    
    xTemp = xTemp + 40;
  }
  
}

/*************************************************************
 * Name: drawTypeTitle
 * 
 * Draws meta data for either the pattern sequences or 
 * subject sequences but not both. (detail view)
 * 
 *  @param: t  0-->show pattern only
 *             1-->show subject only 
 * 
 * *********************************************************/
function drawTypeTitle(t){

  var fillString = null;
  var i = 0;
  
  if(t == 0){
    fillString = "Pattern: ";
    i = 0;
  }
  else{
    fillString = "Subject: ";
    i = 2;
  }
  
  
  ctx.fillStyle = '#000000';
  ctx.font = "12px Arial";
  
  ctx.fillText("Gap: ", 10, 20);         
  ctx.fillText("Ext: ", 10, 40);         
  ctx.fillText("Scope: ", 10, 60);       
    
  ctx.fillText(paramsList[0], 50, 20);   // display gap penalty
  ctx.fillText(paramsList[1], 50, 40);   // display ext. penalty
  ctx.fillText(paramsList[2], 50, 60);   // display scoring scheme
  

  ctx.fillText(fillString, 10, curY);    // pattern or subject
  ctx.fillText(metaList[i], 75, curY);   // fasta meta data 
  
}

/*************************************************************
 * Name: drawProtAlignment
 * 
 * Manages the drawing of the alignment sequences in the 
 * detail view.
 * 
 *  @param: alignToMatch    Sequence to check for matches
 *  @param: singleAlign     Sequence to draw
 *  @param: startList       Starting point for checking matches
 *  @param: endList         Ending point for checking matches
 *  @param: tempMatrixType  Substitution matrix type
 *          
 * *********************************************************/
function drawProtAlignment(alignToMatch, singleAlign, startList, endList, tempMatrixType){

  
  endMark = beginMark;
  
  var boolTemp;
  
  // no search
  if(searchOn == NO_SEARCH){
    for(var i = beginMark; i < maxSequenceLength; i++){
    
      getColor(singleAlign[i], i, singleAlign.length, tempMatrixType);

      drawBorderAndFill(singleAlign[i], i, tempMatrixType);
  
    } 
    
  }
  
  // search for either input sequence or indel
  if(searchOn == INDEL_SEARCH || searchOn == SEQ_SEARCH){
    
    drawSeqAndIndelSearch(singleAlign, startList, endList, tempMatrixType);
  
  }
  
  // search for matches
  if(searchOn == MATCH_SEARCH){
    
    drawMatchSearch(alignToMatch, singleAlign, startList, endList, tempMatrixType);

  }
  
}

/*************************************************************
 * Name: drawSeqAndIndelSearch
 * 
 * Utility function for drawing of the alignment sequences in the 
 * detail view.  This function is for drawing sequence matches
 * and indel searches.
 * 
 *  @param: singleAlign     Sequence to draw
 *  @param: startList       Starting point for checking matches
 *                            and indels
 *  @param: endList         Ending point for checking matches
 *                            and indels
 *  @param: tempMatrixType  Substitution matrix type
 *        
 * *********************************************************/
function drawSeqAndIndelSearch(singleAlign, startList, endList, tempMatrixType){

  var startArray = startList.split(" "); 
  var endArray   = endList.split(" ");
    
  for(var i = beginMark; i < maxSequenceLength; i++){
    
    if(i < singleAlign.length){    
    
      if(checkSearch(i, startArray, endArray) == true){
              
        ctx.fillStyle = '#FA5858';
 
      }
      
      else{
        
        ctx.fillStyle = '#BDBDBD';
        
      }
        
    }
    else{
         
       ctx.fillStyle = '#FFFFFF';
          
    }
      
    drawBorderAndFill(singleAlign[i], i, tempMatrixType);

  }

}

/*************************************************************
 * Name: drawMatchSearch
 * 
 * Utility function for drawing of the alignment sequences in the 
 * detail view.  This function is for drawing matches across
 * sequences.
 * 
 *  @param: alignToMatch    Sequence to check for matches
 *  @param: singleAlign     Sequence to draw
 *  @param: startList       Starting point for checking matches
 *  @param: endList         Ending point for checking matches
 *  @param: tempMatrixType  Substitution matrix type
 *          
 * *********************************************************/
function drawMatchSearch(alignToMatch, singleAlign, startList, endList, tempMatrixType){
  
  for(var i = beginMark; i < maxSequenceLength; i++){
    
    if(i < singleAlign.length){  
        
      if(checkMatch(alignToMatch, singleAlign, i) == true){
              
        ctx.fillStyle = '#FA5858';
 
      }
      
      else{
        
        ctx.fillStyle = '#BDBDBD';
        
      }
        
    }
    
    else{
      
      ctx.fillStyle = '#FFFFFF';
      
    }
    
    drawBorderAndFill(singleAlign[i], i, tempMatrixType);
        
  }

}

/*************************************************************
 * Name: checkMatch
 * 
 * Checks for match at the current index in the pattern
 * and subject alignment sequences. (detail view)
 * 
 *  @param: sl  Alignment sequence
 *  @param: sA  Alignment sequence
 *  @param: i   Current index
 * 
 *  @returns: true if match, false otherwise
 * 
 * *********************************************************/
function checkMatch(sl, sA, i){
  
  if(sl[i] == sA[i]){
    
    return true;
    
  }
  
  return false;

}


/*************************************************************
 * Name: checkSearch
 * 
 * Checks for search sequence at the current index 
 * in the pattern and subject alignment sequences.
 * (detail view)
 * 
 *  @param: ind            Alignment sequence index
 *  @param: sA             Starting point for search seqence
 *  @param: eA             Ending point for search sequence
 * 
 *  @returns: true if found, false otherwise
 * 
 * *********************************************************/
function checkSearch(ind, sA, eA){
  
  for(var i = 0; i < sA.length; i++){
    
    if(ind >= sA[i] - 1 && ind <= eA[i] - 1){

      return true;

    }
    
  }
  
  return false;
  
}

/*************************************************************
 * Name: drawBorderAndFill
 * 
 * Helper function for drawing and filling of individual 
 * residues in the sequence. (detail view)
 * 
 *  @param: indexLetter     Residue abbreviation
 *  @param: ind             Residue position
 *  @param: tempMatrixType  Substitution matrix type
 * 
 * *********************************************************/
function drawBorderAndFill(indexLetter, ind, tempMatrixType){

  curX = curX + RECT_WIDTH + SPACE_X ;

  if(!(curX > ctx.canvas.width || curX + RECT_WIDTH > ctx.canvas.width)){
        
    if(alphaOn == false){
         
      if(searchOn == 1){
          
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        
      }
          
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX, curY + RECT_HEIGHT);
      ctx.lineTo(curX + RECT_WIDTH, curY + RECT_HEIGHT);
      ctx.lineTo(curX + RECT_WIDTH, curY);
      ctx.lineTo(curX, curY);
      ctx.fill();
          
      if(searchOn == 1){
            
        ctx.stroke();
          
      }
      
      ctx.closePath();
            
          
    }
    
    else{
        
      ctx.font = "15px Arial";
      ctx.fillText(indexLetter,curX,curY + RECT_HEIGHT);

    }
    
    endMark++;
    pointList.push({x: curX, y: curY, abbrev: indexLetter, aaNum: ind + 1, mat: tempMatrixType});
  
  }
  else{
    
    if(firstIter == true){
        
      var tempX;
        
      if(curX + RECT_WIDTH > ctx.canvas.width){
          
        tempX = (RECT_WIDTH + SPACE_X );
          
      }
        
      if(curX > ctx.canvas.width){
            
        tempX = (RECT_WIDTH + SPACE_X )*2;
          
      }
        
      drawIndex(String(endMark), curX - tempX, curY - SPACE_Y, true);
      firstIter = false;
      
    }
    
  }
    
}


/*************************************************************
 * Name: drawLabels
 * 
 * Draws label for each alignment sequence in the 
 * detail view.  Outputs the matrix type and the 
 * alignment score.
 * 
 *  @param: alignLabel  Substitution matrix type
 *  @param: score       Alignment score
 * 
 * *********************************************************/
function drawLabels(alignLabel, score){
   
  ctx.fillStyle = '#000000';
  ctx.font = "15px Arial";
  ctx.fillText(getMatrixString(alignLabel, 1),5,curY + SPACE_Y);
  ctx.font = "12px Arial";
  ctx.fillText(Math.floor(score), 5, curY + RECT_HEIGHT/2 + SPACE_Y*3);
  subCrdStore.push(curY + RECT_HEIGHT/2 + SPACE_Y*3 + 15);

}

/*************************************************************
 * Name: drawLegend
 * 
 * Draws legend for each alignment sequence in the 
 * detail view. 
 * 
 * 
 * *********************************************************/
function drawLegend(){
  
  var canvasStart  = 10;   // bottom border for legend
  var legendSize   = 15;   // canvas space allocated for one amino acid 
  var leftLegendSt = 250;  // left border for legend

  for(var i = 0; i < aList.length; i++){
    
    for(var j = 0; j < aList[i].cat.length; j++){
    
      ctx.fillStyle = aList[i].color;
      
      ctx.beginPath();
      ctx.moveTo(leftLegendSt, canvasStart);
      ctx.lineTo(leftLegendSt + legendSize, canvasStart);       
      ctx.lineTo(leftLegendSt + legendSize, canvasStart - 10);               
      ctx.lineTo(leftLegendSt, canvasStart - 10);
      ctx.lineTo(leftLegendSt, canvasStart);
      ctx.fill();
      ctx.closePath();
  
      ctx.fillStyle = '#000000';
      ctx.fillText(aList[i].cat[j], leftLegendSt, canvasStart + 15);
    
      leftLegendSt = legendSize + leftLegendSt;
    }
    
    leftLegendSt = leftLegendSt + 5;
  }
  
}

</script>