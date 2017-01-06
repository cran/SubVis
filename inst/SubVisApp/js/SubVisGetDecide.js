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
 
/**************************************************************
 * Filename:  SubVisGetDecide.js
 * 
 * Utility functions for classifying parameters according to 
 * selections made by user
 * 
 *  @author: Scott Barlowe
 *  @Date:   May 25, 2016 
 *  
 * ***********************************************************/


/*************************************************************
 * Name: getColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the classification
 * 
 *  @param:    sA               Character representing residue
 *  @param:    index            Column position in the sequence
 *  @param:    len              Length of the sequence
 *  @param:    tempMatrixType   Substitution matrix type 
 * 
 * *********************************************************/
function getColor(sA, index, len, tempMatrixType){
  
  if(index >= len){
    getBlankColor();
  }
  else{
    switch(classification){
      case 0:
        noClassify(sA);        // color for raw values
        break;
      case 1:
        getPhysicoColor(sA);  // color for physicochemical
        break;
      case 2:
        getHydroColor(sA);    // color for hydropathic
        break;
      case 3:
        getVolColor(sA);      // color for volume
        break;
      case 4:
        getChemColor(sA);     // color for chemical
        break;
      case 5:
        getChargeColor(sA);   // color for charge
        break;
      case 6:
        getDonorColor(sA);    // color for donor-accept
        break;
      case 7:
        getPolarityColor(sA); // color for polarity 
        break;
      case 8:
        getConserveColor(index, tempMatrixType);  // color for conservation
        break;
    }
    
  }
     
}

/*************************************************************
 * Name: getBlankColor
 * 
 * Assigns the white to the color is the length of the 
 * sequence has been exceeded
 * 
 * *********************************************************/

function getBlankColor(){
  
  ctx.fillStyle = '#ffffff';
  
}


/*************************************************************
 * Name: noClassify
 * 
 * Assigns the color to be displayed in the sequence according
 * to the raw residue (no classification)
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
function noClassify(sA){
  
  switch(sA){
    case 'A':                     // Alanine
      ctx.fillStyle = '#F0D3D3';
      break;
    case 'R':                     // Arginine
      ctx.fillStyle = '#F59898';
      break;
    case 'N':                     // Asparagine
      ctx.fillStyle = '#F54242';
      break;
    case 'D':                     // Aspartic Acid
      ctx.fillStyle = '#CC2727';
      break;
    case 'C':                     // Cysteine
      ctx.fillStyle = '#E56EF5';
      break;
    case 'Q':                     // Glutamine
      ctx.fillStyle = '#D71AF0';
      break;
    case 'E':                     // Glutamic Acide
      ctx.fillStyle = '#B636C7';
      break;
    case 'G':                     // Glycine
      ctx.fillStyle = '#C8BCF5';
      break;
    case 'H':                     // Histidine
      ctx.fillStyle = '#6038F5';
      break;
    case 'I':                     // Isoleucine
      ctx.fillStyle = '#B4ECF0';
      break;
    case 'L':                     // Leucine
      ctx.fillStyle = '#05E5F5';
      break;
    case 'K':                     // Lysine
      ctx.fillStyle = '#478F94';
      break;
    case 'M':                     // Methionine
      ctx.fillStyle = '#79F299';
      break;
    case 'F':                     // Phenylalanine
      ctx.fillStyle = '#04DE3E';
      break;
    case 'P':                     // Proline
      ctx.fillStyle = '#0AA633';
      break;
    case 'S':                     // Serine
      ctx.fillStyle = '#6AA67A';
      break;
    case 'T':                     // Threonine
      ctx.fillStyle = '#E9F09E';
      break;
    case 'W':                     // Tryptophan
      ctx.fillStyle = '#E3F705';
      break;
    case 'Y':                     // Tyrosine
      ctx.fillStyle = '#F2D068';
      break;
    case 'V':                     // Valine
      ctx.fillStyle = '#F2B600';
      break;
    case 'Z':                     // Glutamic acid or Glutamine
      ctx.fillStyle = '#D1B45A';
      break;
    case 'B':                     // Aspartic acid or Asparagine
      ctx.fillStyle = '#C99981';
      break;
    case 'J':                     // Leucine or Isoleucine
      ctx.fillStyle = '#C75F2C';
      break;
    case 'X':                     // Any
      ctx.fillStyle = '#E6E6E6';
      break;
    case '*':                     // Translation stop
      ctx.fillStyle = '#B2B2B2';
      break;
    case '-':                     // Gap
      ctx.fillStyle = '#333333';
      break;
  }
  
}

/*************************************************************
 * Name: getPhysicoColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the physicochemical properties.  Populates aList with amino acid
 * strings and colors for legend.
 * 
 * Groups are   A,I,L,V
 *              R,H,K 
 *              C,M   
 *              S,T   
 *              D,E   
 *              N,Q   
 *              G
 *              F
 *              P
 *              W
 *              Y  
 *              AST,DASH
 *              OTHER (Ex:  X, Z, B, J --> Wildcard Values)
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
 function getPhysicoColor(sA){
  
  if(sA == 'A' || sA == 'I' || sA == 'L' || sA == 'V'){
    
    ctx.fillStyle = '#948A54';
 
  }
  
  else if(sA == 'R' || sA == 'H' || sA == 'K'){
    
    ctx.fillStyle = '#60497A';
  
  }
  
  else if(sA == 'C' || sA == 'M'){
    
    ctx.fillStyle = '#E26B0A';

  }
  
  else if(sA == 'S' || sA == 'T'){
    
    ctx.fillStyle = '#4F81BD';

  }
  else if(sA == 'D' || sA == 'E'){
    
    ctx.fillStyle = '#963634';

  }  
  
  else if(sA == 'N' || sA == 'Q'){
    
    ctx.fillStyle = '#C4D79B';

  }
  else if(sA == 'G'){
      
    ctx.fillStyle = '#FABF8F';

  }
  else if(sA == 'F'){
      
    ctx.fillStyle = '#ff3333';

  }
  else if(sA == 'P'){
      
    ctx.fillStyle = '#33cc33';

  }
  else if(sA == 'W'){
      
    ctx.fillStyle = '#ffcc00';

  }
  else if(sA == 'Y'){
      
    ctx.fillStyle = '#00ffff';

  }
  else if(sA == '*' || sA == '-'){
    
    ctx.fillStyle = '#333333';

  }
  else{
    
    ctx.fillStyle = '#666666';

  }
  
  aList = [];
  
  aList.push({cat:['A', 'I', 'L', 'V'], color:'#948A54'});
  aList.push({cat:['R', 'H', 'K'], color:'#60497A'});
  aList.push({cat:['C', 'M'], color: '#E26B0A'});
  aList.push({cat:['S', 'T'], color: '#4F81BD'});
  aList.push({cat:['D', 'E'], color: '#963634'});  
  aList.push({cat:['N', 'Q'], color: '#C4D79B'});  
  aList.push({cat:['G'], color: '#FABF8F'});
  aList.push({cat:['F'], color: '#ff3333'});
  aList.push({cat:['P'], color: '#33cc33'});
  aList.push({cat:['W'], color: '#ffcc00'});
  aList.push({cat:['Y'], color: '#00ffff'});
   
 }

/*************************************************************
 * Name: getHydroColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the hydropathic properties.  Populates aList with amino acid
 * strings and colors for legend.  
 * 
 * Groups are   A,C,I,L,M,F,W,V
 *              G,H,P,S,T,Y 
 *              R,N,D,Q,E       
 *              AST,DASH 
 *              OTHER (Ex:  X, Z, B, J --> Wildcard Values)  
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
function getHydroColor(sA){
  
  if(sA == 'A' || sA == 'C' || sA == 'I' || 
     sA == 'L' || sA == 'M' || sA == 'F' || 
     sA == 'W' || sA == 'V'){
       
    ctx.fillStyle = '#948A54';

  }
  else if(sA == 'G' || sA == 'H' || sA == 'P' || 
          sA == 'S' || sA == 'T' || sA == 'Y'){
            
    ctx.fillStyle = '#60497A';
 
  }
  else if(sA == 'R' || sA == 'N' || sA == 'D' || 
          sA == 'Q' || sA == 'E' || sA == 'K'){
            
    ctx.fillStyle = '#E26B0A';
   
  }
  else if(sA == '*' || sA == '-'){
    
    ctx.fillStyle = '#333333';

  }
  else{
    
    ctx.fillStyle = '#666666';

  }
  
  aList = [];
  
  aList.push({cat:['A', 'C', 'I', 'L', 'M', 'F', 'W', 'V'], color:'#948A54'});
  aList.push({cat:['G', 'H', 'P', 'S', 'T', 'Y'], color: '#60497A'});
  aList.push({cat:['R', 'N', 'D', 'Q', 'E', 'K'], color: '#E26B0A'});
  
}

/*************************************************************
 * Name: getVolColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the volume properties.  Populates aList with amino acid
 * strings and colors for legend.
 * 
 * Groups are   A,G,S             
 *              N,D,C,P,T       
 *              Q,E,H,V         
 *              R,I,L,K,M   
 *              F,W,Y       
 *              AST,DASH     
 *              OTHER (Ex:  X, Z, B, J --> Wildcard Values) 
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
function getVolColor(sA){
  
  if(sA == 'A' || sA == 'G' || sA == 'S'){
    
    ctx.fillStyle = '#948A54';

  }
  else if(sA == 'N' || sA == 'D' || sA == 'C' || 
          sA == 'P' || sA == 'T'){
      
    ctx.fillStyle = '#60497A';

  }
  else if(sA == 'Q' || sA == 'E' || sA == 'H' || 
          sA == 'V'){
    
    ctx.fillStyle = '#E26B0A';   

  }
  else if(sA == 'R' || sA == 'I' || sA == 'L' || 
          sA == 'K' || sA == 'M'){
      
    ctx.fillStyle = '#4F81BD';

  }
  else if(sA == 'F' || sA == 'W' || sA == 'Y'){
    
    ctx.fillStyle = '#963634';

  }
  else if(sA == '*' || sA == '-'){
    
    ctx.fillStyle = '#333333';

  }
  else{
  
    ctx.fillStyle = '#666666';

  }
  
  aList = [];
  
  aList.push({cat:['A', 'G', 'S'], color:'#948A54'});
  aList.push({cat:['N', 'D', 'C', 'P', 'T'], color:'#60497A'});
  aList.push({cat:['Q', 'E', 'H', 'V'], color: '#E26B0A'});
  aList.push({cat:['R', 'I', 'L', 'K', 'M'], color: '#4F81BD'});
  aList.push({cat:['F', 'W', 'Y'], color: '#963634'});
  
}

/*************************************************************
 * Name: getChemColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the chemical properties.  Populates aList with amino acid
 * strings and colors for legend.
 * 
 * Groups are   A,G,I,L,P,V
 *              F,W,Y       
 *              C,M           
 *              S,T         
 *              R,H,K           
 *              D,E         
 *              N,Q           
 *              AST,DASH
 *              OTHER (Ex:  X, Z, B, J --> Wildcard Values) 
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
function getChemColor(sA){
  
  if(sA == 'A' || sA == 'G' || sA == 'I' || 
     sA == 'L' || sA == 'P' || sA == 'V'){
    
    ctx.fillStyle = '#948A54';
 
  }
  else if(sA == 'F' || sA == 'W' || sA == 'Y'){
      
    ctx.fillStyle = '#60497A';

  }
  else if(sA == 'C' || sA == 'M'){
    
    ctx.fillStyle = '#E26B0A';  

  }
  else if(sA == 'S' || sA == 'T'){
  
    ctx.fillStyle = '#4F81BD';

  }
  else if(sA == 'R' || sA == 'H' || sA == 'K'){
    
    ctx.fillStyle = '#963634';

  }
  else if(sA == 'D' || sA == 'E'){
    
      ctx.fillStyle = '#C4D79B';

  }
  else if(sA == 'N' || sA == 'Q'){
    
      ctx.fillStyle = '#FABF8F';

  }
  else if(sA == '*' || sA == '-'){
    
      ctx.fillStyle = '#333333';

  }
  else{
    
      ctx.fillStyle = '#666666';

  }

  aList = [];
  
  aList.push({cat:['A', 'G', 'I', 'L', 'P', 'V'], color:'#948A54'});
  aList.push({cat:['F', 'W', 'Y'], color: '#60497A'});
  aList.push({cat:['C', 'M'], color: '#E26B0A'});
  aList.push({cat:['S', 'T'], color: '#4F81BD'});
  aList.push({cat:['R', 'H', 'K'], color: '#963634'});
  aList.push({cat:['D', 'E'], color: '#C4D79B'});
  aList.push({cat:['N', 'Q'], color: '#FABF8F'});
  
}

/*************************************************************
 * Name: getChargeColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the charge properties.  Populates aList with amino acid
 * strings and colors for legend.
 * 
 * Groups are   R,H,K       
 *              D,E         
 *              A THROUGH V
 *              AST,DASH     
 *              OTHER (Ex:  X, Z, B, J --> Wildcard Values) 
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
function getChargeColor(sA){
  
  if(sA == 'R' || sA == 'H' || sA == 'K'){
  
    ctx.fillStyle = '#948A54';

  }
  else if(sA == 'D' || sA == 'E'){
  
    ctx.fillStyle = '#60497A';     

  }
  else if(sA == 'A' || sA == 'N' || sA == 'C' || 
          sA == 'Q' || sA == 'G' || sA == 'I' || 
          sA == 'L' || sA == 'M' || sA == 'F' || 
          sA == 'P' || sA == 'S' || sA == 'T' || 
          sA == 'W' || sA == 'Y' || sA == 'V'){
        
    ctx.fillStyle = '#E26B0A';  

  }
  else if(sA == '*' || sA == '-'){
    
    ctx.fillStyle = '#333333';

  }
  else{
    
    ctx.fillStyle = '#666666';

  }
  
  aList = [];
  
  aList.push({cat:['R', 'H', 'K'], color:'#948A54'});
  aList.push({cat:['D', 'E'], color: '#60497A'});
  aList.push({cat:['A', 'N', 'C', 'Q', 'G', 'I',
                   'L', 'M', 'F', 'P', 'S', 'T',
                   'W', 'Y', 'V'], color: '#E26B0A'});
  
}

/*************************************************************
 * Name: getDonorColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the donor-accept properties.  Populates aList with amino acid
 * strings and colors for legend.
 * 
 * Groups are   R,K,W       
 *              D,E           
 *              N,Q,H,S,T,Y
 *              A THROUGH V 
 *              AST,DASH    
 *              OTHER (Ex:  X, Z, B, J --> Wildcard Values) 
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
function getDonorColor(sA){
 
  if(sA == 'R' || sA == 'K' || sA == 'W'){
    
    ctx.fillStyle = '#948A54';

  }
  else if(sA == 'D' || sA == 'E'){
    
    ctx.fillStyle = '#60497A';    

  }
  else if(sA == 'N' || sA == 'Q' || sA == 'H' || 
          sA == 'S' || sA == 'T' ||sA == 'Y'){
            
    ctx.fillStyle = '#E26B0A';

  }
  else if(sA == 'A' || sA == 'C' || sA == 'G' || 
          sA == 'I' || sA == 'L' || sA == 'M' || 
          sA == 'F' || sA == 'P' || sA == 'V'){
            
    ctx.fillStyle = '#4F81BD';

  }
  else if(sA == '*' || sA == '-'){
    
    ctx.fillStyle = '#333333';

  }
  else{
    
    ctx.fillStyle = '#666666';

  }
  
  aList = [];
  
  aList.push({cat:['R', 'K', 'W'], color:'#948A54'});
  aList.push({cat:['D', 'E'], color: '#60497A'});
  aList.push({cat:['N', 'Q', 'H', 'S', 'T', 'Y'], color: '#E26B0A'});
  aList.push({cat:['A', 'C', 'G', 'I', 'L', 'M', 'F', 'P', 'V'], color: '#4F81BD'});

}

/*************************************************************
 * Name: getPolarityColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to the polarity properties.  Populates aList with amino acid
 * strings and colors for legend.
 * 
 * Groups are   R THROUGH Y 
 *              A THROUGH V 
 *              AST,DASH 
 *              OTHER (Ex:  X, Z, B, J --> Wildcard Values) 
 * 
 *  @param:    sA  Character representing residue
 * 
 * *********************************************************/
function getPolarityColor(sA){

  if(sA == 'R' || sA == 'N' || sA == 'D' || 
     sA == 'Q' || sA == 'E' || sA == 'H' || 
     sA == 'K' || sA == 'S' || sA == 'T' || 
     sA == 'Y'){
       
    ctx.fillStyle = '#948A54';

  }
  else if(sA == 'A' || sA == 'C' || sA == 'G' || 
          sA == 'I' || sA == 'L' || sA == 'M' || 
          sA == 'F' || sA == 'P' || sA == 'W' || 
          sA == 'V'){
            
    ctx.fillStyle = '#60497A';

  }
  else if(sA == '*' || sA == '-'){
    
    ctx.fillStyle = '#333333';

  }
  else{
    
    ctx.fillStyle = '#666666';

  }
  
  aList = [];
  
  aList.push({cat:['R', 'N', 'D', 'Q', 'E', 'H', 'K', 'S', 'T', 'Y'], 
              color:'#948A54'});
  aList.push({cat:['A', 'C', 'G', 'I', 'L', 'M', 'F', 'P', 'W', 'V'],
              color:'#60497A'});

}

/*************************************************************
 * Name: getConserveColor
 * 
 * Assigns the color to be displayed in the sequence according
 * to conservation of substitution log-odds properties.
 *  
 * 
 *  @param:    col              Position in the sequence
 *  @param:    tempMatrixType   Substitution matrix type
 * 
 * *********************************************************/
function getConserveColor(col, tempMatrixType){
  
  var logOdds = getLogOdds(col, tempMatrixType)

  if(logOdds == "undef"){

    ctx.fillStyle = '#A4A4A4';

  }

  else{

    if(logOdds < 0){
              
      ctx.fillStyle = '#ff9900';
 
    }
      
    else if(logOdds > 0){
        
      ctx.fillStyle = '#33CC33';
        
    }

    else{

      ctx.fillStyle = '#E0E0D1';
    
    }
    
  }
  
}


/*************************************************************
 * Name: getLogOdds
 * 
 * Retrieves the log-odds for corresponding amino acids 
 * in the sequence.
 *  
 * 
 *  @param:    col              Position in the sequence
 *  @param:    tempMatrixType   Substitution matrix type
 *
 *  @returns:  Log-odds value in the substitution matrix
 *             for two amino acids
 * *********************************************************/
function getLogOdds(col, tempMatrixType){
  
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
  
  var tempAA1 = tempAlign1[col];
  var tempAA2 = tempAlign2[col];
  
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
  
  return logOdds;


}

/*************************************************************
 * Name: getMatrixString
 * 
 * Matches the integer with the corresponding substitution 
 * type to be displayed.  
 * 
 *  @param:    alignLabel  Integer representing a substitution
 *                         matrix type
 *  @param:    type        1) matrix type full name, 
 *                         2) matrix type abbreviation,
 *                         3) matrix data, or
 *                         4) matrix alphabet
 * 
 *  @returns:  String representing either the full
 *             substitution matrix type, abbreviated 
 *             substitution matrix type, 
 *             substitution matrix data, or
 *             substitution matrix alphabet
 * 
 * *********************************************************/
function getMatrixString(alignLabel, type){
  
  var matStFull     = null;  
  var matStAbbr     = null;
  var returnMat     = null;
  var returnStrName = null;
  
  switch(alignLabel){
    case "1":
      matStFull     = "BLOSUM45";
      matStAbbr     = "B45";
      returnMat     = B45;
      returnStrName = nameB45;
      break;
    case "2":
      matStFull     = "BLOSUM50";
      matStAbbr     = "B50";
      returnMat     = B50;
      returnStrName = nameB50;
      break;
    case "3":
      matStFull     = "BLOSUM62";
      matStAbbr     = "B62";
      returnMat     = B62;
      returnStrName = nameB62;
      break;
    case "4":
      matStFull     = "BLOSUM80";
      matStAbbr     = "B80";
      returnMat     = B80;
      returnStrName = nameB80;
      break;
    case "5":
      matStFull     = "BLOSUM100";
      matStAbbr     = "B100";
      returnMat     = B100;
      returnStrName = nameB100;
      break;
    case "6":
      matStFull     = "PAM30";
      matStAbbr     = "P30";
      returnMat     = P30;
      returnStrName = nameP30;
      break;
    case "7":
      matStFull     = "PAM40";
      matStAbbr     = "P40";
      returnMat     = P40;
      returnStrName = nameP40;
      break;
    case "8":
      matStFull     = "PAM70";
      matStAbbr     = "P70";
      returnMat     = P70;
      returnStrName = nameP70;
      break;
    case "9":
      matStFull     = "PAM120";
      matStAbbr     = "P120";
      returnMat     = P120;
      returnStrName = nameP120;
      break;
    case "10":
      matStFull     = "PAM250";
      matStAbbr     = "P250";
      returnMat     = P250;
      returnStrName = nameP250;
      break;
    default:   // Used for custom matrices
               // Index into the custom array with alignLabel 
               // Plus one is used to pass cases 1-10
      matStFull     = "CM" + (parseInt(alignLabel) - MAX_CHECKED_PLUS_ONE).toString();
      matStAbbr     = "CM" + (parseInt(alignLabel) - MAX_CHECKED_PLUS_ONE).toString();
      returnMat     = CUST[parseInt(alignLabel) - MAX_CHECKED_PLUS_ONE];
      returnStrName = nameCUST[parseInt(alignLabel) - MAX_CHECKED_PLUS_ONE];
      break;
  }
  
  if(type == 1){
    
    return matStFull;  // return full string
    
  }
  
  if(type == 2){
    
    return matStAbbr; // return abbreviated string
    
  }
  
  if(type == 3){
    
    return returnMat; // return substitution matrix
  
  }
  
  if(type == 4){
    
    return returnStrName; // return string containing alphabet for a matrix
    
  }
  
}

</script>