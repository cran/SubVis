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

/**********************************************************
 * Filename:  SubVisEvents.js
 * 
 * Handles events initiated by server.R or by user 
 * interaction with the canvas.  Makes changes to the 
 * drawing based on those events configuration.
 * 
 *  @author: Scott Barlowe
 *  @date:   May 25, 2016
 * 
 * *******************************************************/
$(document).ready(function() {

  // Call initialization
  initProt();
  
  // Listener for window resize
  window.addEventListener('resize', resizeProt, false); 
  
  /********************************************************
   * Name:  initProt
   * 
   * Initializes canvas context, width, height.  Also adds
   * mousemove event listener.
   * 
   * *****************************************************/
  
  function initProt(){

    var c = document.getElementById("myCanvasProt");
    ctx = c.getContext("2d");
    myCanvasProt.width = Math.floor((2 * window.innerWidth)/3);
    myCanvasProt.height = Math.floor(3 * window.innerHeight/4);
    c.addEventListener('mousemove', onMouseOverProt, false);

  }

  /********************************************************
   * Name: onMouseOverProt
   * 
   * Coverts mouse coordinates to screen coordinates and
   * redraws.  Mouse coordinates often used for mouse over
   * events.
   *
   *  @param: event  event object from mouse listener
   * 
   * *****************************************************/
  function onMouseOverProt(event){

    mouseX = Math.floor(event.x - myCanvasProt.getBoundingClientRect().left);
    mouseY = Math.floor(event.y - myCanvasProt.getBoundingClientRect().top);
    clearCanvas();
    chooseDraw();
    
  }
  
  /********************************************************
   * Name:  resizeProt
   * 
   * Initiated on resize event.  Recalculates canvas 
   * height, width and then redraws
   * 
   * *****************************************************/
  function resizeProt(){
    
    var c = document.getElementById("myCanvasProt");
    ctx = c.getContext("2d");
    myCanvasProt.width = Math.floor((2 * window.innerWidth)/3);
    myCanvasProt.height = Math.floor(3 * window.innerHeight/4);
    clearCanvas();
    chooseDraw();
    
  }

  /********************************************************
   * Name: updateParamHandler
   * 
   * Message handler from Shiny for updating parameters.
   * 
   *  @param: paramListTemp  Holds the list of current
   *                         parameters
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("updateParamHandler",

    function(paramListTemp){
       
      paramsList = paramListTemp;
      clearCanvas();
      chooseDraw();
     
    }
      
  );

  /********************************************************
   * Name: myCallbackHandler
   * 
   * Message handler from Shiny for updating alignments.  
   * Checks for maximum sequence length for finding
   * the display end
   * 
   *  @param: alignmentTemp  Holds the alignments for 
   *                         display
   * *****************************************************/

  Shiny.addCustomMessageHandler("myCallbackHandler",
  
    function(alignmentTemp){
      
      var c = document.getElementById("myCanvasProt");
      ctx = c.getContext("2d");
      alignments = alignmentTemp;
      
      var tempMax = alignments[PATT_SLOT].length;
      
      
      
      
      for(var i = 0; i < alignments.length; i+= OBJ_OFFSET){
        
        //pattern and subject alignment length should
        //   be the same
        if(alignments[i + PATT_SLOT].length > tempMax){
          tempMax = alignments[i + PATT_SLOT].length;
        }
        
        if(alignments[i + SUBJ_SLOT].length > tempMax){
          tempMax = alignments[i + SUBJ_SLOT].length;
        }
        
      }
      
      maxSequenceLength = tempMax;
      
      clearCanvas();
      chooseDraw();

    }
      
  );
  
  /********************************************************
   * Name: searchCallbackHandler
   * 
   * Message handler from Shiny for updating search 
   * options.
   * 
   *  @param: sL Search option
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("searchCallbackHandler",
  
    function(sL){
    
      searchOn = sL;

    }
    
  );
  
  /********************************************************
   * Name: goToMessage
   * 
   * Message handler from Shiny for going to the position
   * in the alignment provided by the user. (Detail view)
   * 
   *  @param: pos Position in the alignment to visit
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("goToMessage",
  
    function(pos){
  
      if(pos.length != 0){
            
        goTo = parseInt(pos);
          
      }
          
      beginMark = goTo - 1;

    }
      
  );

  /********************************************************
   * Name: backMessage
   * 
   * Message handler from Shiny for going to a previous
   * section in the alignment. (Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("backMessage",
  
    function(x){

      if(beginMark > 0){

        beginMark = beginMark - Math.floor((endMark - beginMark) / 2);
        
        clearCanvas();
        chooseDraw();
          
      }
        
    }
      
  );    
  
  /********************************************************
   * Name: forwardMessage
   * 
   * Message handler from Shiny for going to a section in 
   * the alignment beyond the current view.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("forwardMessage",
  
    function(x){
        
      var y = x;
     
      beginMark = beginMark + Math.floor((endMark - beginMark) / 2);
     
      // check to make sure the end of the 
      //    max sequence is not exceeded
      if(beginMark > maxSequenceLength - 10){
      
        beginMark = maxSequenceLength - 10;
      
      }    
      clearCanvas();
      chooseDraw();
      
    }
        
  ); 
  
    /********************************************************
   * Name: endMessage
   * 
   * Message handler from Shiny for going to the end of the 
   * longest sequence.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("endMessage",
  
    function(x){
        
      var y = x;
     
      beginMark = maxSequenceLength - 10;
      
      clearCanvas();
      chooseDraw();
      
    }
        
  ); 
   
  /********************************************************
   * Name: zoomOutMessage
   * 
   * Message handler for decreasing the draw size.
   * (Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("zoomOutMessage",
  
    function(x){
        
      var y = x;
      RECT_WIDTH--;
      RECT_HEIGHT--;
      clearCanvas();
      chooseDraw();
      
    }
        
  ); 
  
  /********************************************************
   * Name: zoomInMessage
   * 
   * Message handler for increasing the draw size.
   * (Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("zoomInMessage",

    function(x){
        
      var y = x;
      RECT_WIDTH++;
      RECT_HEIGHT++;
      clearCanvas();
      chooseDraw();
      
    }
        
  ); 
    
  /********************************************************
   * Name: downMessage
   * 
   * Message handler for shifting the alignments
   * up on the canvas so that alignments not fitting 
   * in the view can be shown.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("downMessage",
  
    function(x){

      var y = x;
      
      if(startProt + OBJ_OFFSET < alignments.length){
        
         startProt = startProt + OBJ_OFFSET;
      
      }
      
      firstIter = true;
      clearCanvas();
      chooseDraw();
      
    }
        
  ); 
    
  /********************************************************
   * Name: upMessage
   * 
   * Message handler for shifting the alignments
   * down on the canvas so that alignments not fitting can 
   * be shifted up.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("upMessage",
  
    function(x){

      var y = x;
      
      if(startProt - OBJ_OFFSET >= 0){
        
          startProt = startProt - OBJ_OFFSET;
          
      }
        
      firstIter = true;
      clearCanvas();
      chooseDraw();
      
    }
        
  ); 
  
  /********************************************************
   * Name: pairLayMessage
   * 
   * Message handler for viewing alignments in 
   * pattern-subject pairs.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("pairLayMessage",
  
    function(x){

      pairLayout = 0;        
      firstIter = true;
      clearCanvas();
      chooseDraw();
        
    }
   
  ); 
  
  /********************************************************
   * Name: patLayMessage
   * 
   * Message handler for viewing only the pattern of each
   * pair.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("patLayMessage",
  
    function(x){

     pairLayout = 1;        
     firstIter = true;
     clearCanvas();
     chooseDraw();
        
    }
   
  );
  
  /********************************************************
   * Name: subLayMessage
   * 
   * Message handler for viewing only the subject of each
   * pair.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("subLayMessage",
  
    function(x){

      pairLayout = 2;        
      firstIter = true;
      clearCanvas();
      chooseDraw();
        
    }
   
   );
   
  Shiny.addCustomMessageHandler("metaCallbackHandler",
  
    function(meta){
        
      metaList = meta;
        
    }
   
  );
  
  /********************************************************
   * Name: beginMessage
   * 
   * Return to position 1 in the alignments.(Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/
  Shiny.addCustomMessageHandler("beginMessage",
  
    function(x){
        
      var y = x;
      beginMark = 0;
      clearCanvas();
      chooseDraw();
        
    }
   
  );
  
  /********************************************************
   * Name: alphaMessage
   * 
   * Message handler for toggling whether the alpha 
   * abbreviations or colored blocks are displayed.
   * (Detail view)
   * 
   *  @param: x Not used.  There only to satisfy syntax
   *                       requirements
   * 
   * *****************************************************/ 
  Shiny.addCustomMessageHandler("alphaMessage",

    function(x){
        
      var y = x;
      alphaOn = !alphaOn;
      clearCanvas();
      chooseDraw();
        
    }
   
   );
   
   /********************************************************
    * Name: classifyHandler
    * 
    * Message handler for choosing what classification
    * properties are chosen.(Detail view)
    * 
    *  @param: classify classification choices
    * 
    * *****************************************************/ 
   Shiny.addCustomMessageHandler("classifyHandler",
   
    function(classify){
        
      switch(classify){
        case RAW:           // no classification
          classification = 0;
          break;
        case PHYSICO:       // physicochemical
          classification = 1;
          break; 
        case HYDRO:         // hydrophathic
          classification = 2;
          break;
        case VOL:        // volume
          classification = 3;
          break;  
        case CHEM:          // chemical
          classification = 4;
          break;
        case CHAR:        // charge
          classification = 5;
          break; 
        case DONOR:         // donor-accept
          classification = 6;
          break;
        case POL:           // polarity
          classification = 7;
          break;
        case CON:         // conservation
          classification = 8;
          break;
        default:          // catch-all     
          classification = 9; 
      }

      clearCanvas();
      chooseDraw();
              
    }
  );

   /********************************************************
    * Name: overViewMessage
    * 
    * Go to overview or detail view
    * 
    *  @param: pO string representing view selection
    * 
    * *****************************************************/ 
  Shiny.addCustomMessageHandler("overViewMessage",
  
    function(pO){
        
      var p = pO;

        if(pO == "overview"){
          
          overviewOn = true;
          
        }
        
        if(pO == "detail"){
          
          overviewOn = false;        
          
        } 
        
        clearCanvas();
        chooseDraw();
        
      }
   
   );
   
   
     /********************************************************
     * Name: LoadBlosum45
     * 
     * Loads Blosum45 matrix as 2d array from 1d list
     * 
     *  @param: B_45-->Blosum45 matrix (1d list)
     * 
     * *****************************************************/ 
   Shiny.addCustomMessageHandler("LoadBlosum45", 
  
    function(B_45){
    
     B45      = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < B_45.length; i++){
        
        temp[cnt] = B_45[i];
        cnt++;
        
        if(cnt == Math.sqrt(B_45.length)){
          
          B45.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
       
    }
  
  );
  
  
    /********************************************************
    * Name: LoadBlosum50
    * 
    * Loads Blosum50 matrix as 2d array from 1d list
    * 
    *  @param: B_50-->Blosum50 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum50", 
  
    function(B_50){
     
     B50      = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < B_50.length; i++){
        
        temp[cnt] = B_50[i];
        cnt++;
        
        if(cnt == Math.sqrt(B_50.length)){
          
          B50.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
     
     
    }
  );
  
  
    /********************************************************
    * Name: LoadBlosum62
    * 
    * Loads Blosum62 matrix as 2d array from 1d list
    * 
    *  @param: B_62-->Blosum62 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum62", 
  
    function(B_62){
 
     B62      = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < B_62.length; i++){
        
        temp[cnt] = B_62[i];
        cnt++;
        
        if(cnt == Math.sqrt(B_62.length)){
          
          B62.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
     
    }
  );
  
    /********************************************************
    * Name: LoadBlosum80
    * 
    * Loads Blosum80 matrix as 2d array from 1d list
    * 
    *  @param: B_80-->Blosum80 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum80", 
  
    function(B_80){

     B80      = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < B_80.length; i++){
        
        temp[cnt] = B_80[i];
        cnt++;
        
        if(cnt == Math.sqrt(B_80.length)){
          
          B80.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
     
     
    }
  );
  
    /********************************************************
    * Name: LoadBlosum100
    * 
    * Loads Blosum100 matrix as 2d array from 1d list
    * 
    *  @param: B_100-->Blosum100 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum100", 
  
    function(B_100){

     B100     = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < B_100.length; i++){
        
        temp[cnt] = B_100[i];
        cnt++;
        
        if(cnt == Math.sqrt(B_100.length)){
          
          B100.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }

    }
  );
  
    /********************************************************
    * Name: LoadPam30
    * 
    * Loads Pam30 matrix as 2d array from 1d list
    * 
    *  @param: P_30-->Pam30 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam30", 
  
    function(P_30){

     P30      = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < P_30.length; i++){
        
        temp[cnt] = P_30[i];
        cnt++;
        
        if(cnt == Math.sqrt(P_30.length)){
          
          P30.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }

    }
  );
  
    /********************************************************
    * Name: LoadPam40
    * 
    * Loads Pam40 matrix as 2d array from 1d list
    * 
    *  @param: P_40-->Pam40 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam40", 
  
    function(P_40){

     P40      = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < P_40.length; i++){
        
        temp[cnt] = P_40[i];
        cnt++;
        
        if(cnt == Math.sqrt(P_40.length)){
          
          P40.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
      
    }
  ); 
  
    /********************************************************
    * Name: LoadPam70
    * 
    * Loads Pam70 matrix as 2d array from 1d list
    * 
    *  @param: P_70-->Pam70 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam70", 
  
    function(P_70){

     P70      = [];
     var temp = [];
     var cnt  = 0;
     
     for(var i = 0; i < P_70.length; i++){
        
        temp[cnt] = P_70[i];
        cnt++;
        
        if(cnt == Math.sqrt(P_70.length)){
          
          P70.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
    
    }
  );

    /********************************************************
    * Name: LoadPam120
    * 
    * Loads Pam120 matrix as 2d array from 1d list
    * 
    *  @param: P_120-->Pam120 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam120", 
  
    function(P_120){

     P120      = [];
     var temp  = [];
     var cnt   = 0;
     
     for(var i = 0; i < P_120.length; i++){
        
        temp[cnt] = P_120[i];
        cnt++;
        
        if(cnt == Math.sqrt(P_120.length)){
          
          P120.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }

    }
  );

    /********************************************************
    * Name: LoadPam250
    * 
    * Loads Pam250 matrix as 2d array from 1d list
    * 
    *  @param: P_250-->Pam250 matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam250", 
  
    function(P_250){

     P250      = [];
     var temp  = [];
     var cnt   = 0;
     
     for(var i = 0; i < P_250.length; i++){
        
        temp[cnt] = P_250[i];
        cnt++;
        
        if(cnt == Math.sqrt(P_250.length)){
          
          P250.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
     
     
            
    }
  );
  
    /********************************************************
    * Name: LoadCust
    * 
    * Loads custom matrix as 2d array from 1d list
    * 
    *  @param: Cust-->custom matrix (1d list)
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadCust", 
  
    function(Cust){

     CUST      = [];
     var temp  = [];
     var cnt   = 0;
     
     for(var i = 0; i < Cust.length; i++){
        
        temp[cnt] = Cust[i];
        cnt++;
        
        if(cnt == Math.sqrt(Cust.length)){
          
          CUST.push(temp);
          temp = [];
          cnt = 0;
          
        }
        
     }
            
    }
  );

    /********************************************************
    * Name: LoadBlosum45Names
    * 
    * Loads Blosum45 alphabet
    * 
    *  @param: nameB_45-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum45Names", 
    
    function(nameB_45){
    
      nameB45 = nameB_45;
  
    }

  );
  
  
    /********************************************************
    * Name: LoadBlosum50Names
    * 
    * Loads Blosum50 alphabet
    * 
    *  @param: nameB_50-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum50Names", 
    
    function(nameB_50){
    
      nameB50 = nameB_50;
  
    }

  );
  
    /********************************************************
    * Name: LoadBlosum62Names
    * 
    * Loads Blosum62 alphabet
    * 
    *  @param: nameB_62-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum62Names", 
    
    function(nameB_62){
    
      nameB62 = nameB_62;
  
    }

  );
  
    /********************************************************
    * Name: LoadBlosum80Names
    * 
    * Loads Blosum80 alphabet
    * 
    *  @param: nameB_80-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum80Names", 
    
    function(nameB_80){
    
      nameB80 = nameB_80;
  
    }

  );
  
    /********************************************************
    * Name: LoadBlosum100Names
    * 
    * Loads Blosum100 alphabet
    * 
    *  @param: nameB_100-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadBlosum100Names", 
    
    function(nameB_100){
    
      nameB100 = nameB_100;
  
    }

  );
  
    /********************************************************
    * Name: LoadPam30Names
    * 
    * Loads Pam30 alphabet
    * 
    *  @param: nameP_30-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam30Names", 
    
    function(nameP_30){
    
      nameP30 = nameP_30;
  
    }

  );
  
    /********************************************************
    * Name: LoadPam40Names
    * 
    * Loads Pam40 alphabet
    * 
    *  @param: nameP_40-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam40Names", 
    
    function(nameP_40){
    
      nameP40 = nameP_40;
  
    }

  );
  
    /********************************************************
    * Name: LoadPam70Names
    * 
    * Loads Pam70 alphabet
    * 
    *  @param: nameP_70-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam70Names", 
    
    function(nameP_70){
    
      nameP70 = nameP_70;
  
    }

  );
  
    /********************************************************
    * Name: LoadPam120Names
    * 
    * Loads Pam120 alphabet
    * 
    *  @param: nameP_120-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam120Names", 
    
    function(nameP_120){
    
      nameP120 = nameP_120;
  
    }

  );
  
    /********************************************************
    * Name: LoadPam250Names
    * 
    * Loads Pam250 alphabet
    * 
    *  @param: nameP_250-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadPam250Names", 
    
    function(nameP_250){
    
      nameP250 = nameP_250;
  
    }

  );
  
    /********************************************************
    * Name: LoadCustNames
    * 
    * Loads custom alphabet
    * 
    *  @param: name_CUST-->1d alphabet list
    * 
    * *****************************************************/
  Shiny.addCustomMessageHandler("LoadCustNames", 
    
    function(name_CUST){
    
      nameCUST = name_CUST;
  
    }

  );
  

  }
);
</script>