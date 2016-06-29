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
 * Filename:  SubVisGlobals.js
 * 
 * Globals variables used for canvas management
 *                            layout management
 *                            alignment and PID management
 *                            collection structures
 *                            mouse management
 *                            searching and classification
 *                            substitution matrices
 *  
 *  @author: Scott Barlowe
 *  @date:   May 25, 2016
 * 
 * *******************************************************/

/**************************************
 * 
 * Canvas management
 * 
 *************************************/

/****  Constants  ****/

var RECT_WIDTH      = 15;                      // constant for width of rects for alignment components
var RECT_HEIGHT     = 15;                      // constant for height of rects for alignment components
var SPACE_X         = 0;                       // constant for spacing helper in the x direction        
var SPACE_Y         = 3;                       // constant for spacing helper in the y direction 
var LEFT_MARGIN     = 80 + SPACE_X;            // left margin to start drawing 
var TOP_MARGIN      = RECT_HEIGHT*2 + SPACE_Y; // top margin to start drawing
var SPACE_BTW_ROWS  = RECT_HEIGHT/2 + SPACE_Y;   // space between rows of alignments
var SPACE_BTW_PAIRS = RECT_HEIGHT;             // space between pairs of rows

/****  Non-constants  ****/

var ctx            = null;    // canvas context
var curX           = 0;       // current x coordinate when drawing
var curY           = 60;      // current y coordinate when drawing
var lastCurY       = 0;       // Last value of y
var overviewOn     = true;    // overview or detail view
var classification = 0;       // Start with no classification scheme

/**************************************
 * 
 * Layout management
 * 
 *************************************/
var maxSequenceLength = 0;       // maximum aligned sequence length
var beginMark         = 0;      // first component in the alignment drawn
var endMark           = 0;      // last componenet in the alignment drawn
var pairLayout        = 0;      // 0 if drawn in pattern/subject pairs
                                //     1 if layout is grouped by pattern
                                //     2 if layout is grouped by subject
var firstIter         = true;   // used to label only the top row
var alphaOn           = false;  // toggle for displaying residue abbreviations
                                //            or color blocks

/******************************************
 * 
 * Alignment and percent identity management
 * 
 * *****************************************/

/****  Constants  ****/

var OBJ_OFFSET   = 12;   // number of slots per alignment object
var PATT_SLOT    = 0;    // slot zero   - holds string representing pattern string
var SUBJ_SLOT    = 1;    // slot one    - holds string representing subject string
var SCR_SLOT     = 2;    // slot two    - holds string representing score
var MATRIX_SLOT  = 3;    // slot three  - holds string representing matrix type
var PATT_ST_SLOT = 4;    // slot four   - holds string representing the start position
                         //                 of all matches for pattern
var PATT_ED_SLOT = 5;    // slot five   - holds string representing the end positon 
                         //                 of all matches for pattern
var SUBJ_ST_SLOT = 6;    // slot six    - holds string representing the start position
                         //                 of all matches for subject
var SUBJ_ED_SLOT = 7     // slot seven  - holds string representing the end positon 
                         //                 of all matches for subject
var PID_1_SLOT   = 8;    // slot eight  - holds PID1   
var PID_2_SLOT   = 9;    // slot nine   - holds PID2
var PID_3_SLOT   = 10;   // slot ten    - holds PID3
var PID_4_SLOT   = 11;   // slot eleven - holds PID4
var NUM_OF_PIDS  = 4;    // number of different percent identity calculations 

/****  Non-constants  ****/

var alignments   = null; // holds alignment objects according to the number of 
                         //    slots below
var startProt    = 0;    // starting sequence    

/**************************************
 * 
 * Collection structures
 * 
 *************************************/
var pointList    = [];      // array of x, y coordinates corresponding to each alignment component
var allPointList = []; 
var scoreList    = [];      // array of score values to list
var subCrdStore  = [];      // array of substitution display coordinates for mouseover
var metaList     = null;    // list of meta data
var paramsList   = null;    // parameter list for scoring
                            // slot one - holds gap penalty
                            // slot two - holds ext. penalty
                            // slot three - holds scoring scheme

/**************************************
 * 
 *  Mouse management
 * 
 *************************************/
var mouseX             = 0;       // current x location of mouse
var mouseY             = 0;       // current y location of mouse
var currentMatrixLabel = null;    // used for highlighting in overview
var isOn               = false;   // helps in the management of mouse over
                                  //    selection in overview

/**************************************
 * 
 *  Searching and classification
 * 
 *************************************/

/****  Constants  ****/

var NO_SEARCH    = 1;    // constant for showing all amino acids
var INDEL_SEARCH = 2;    // constant for searching indels
var MATCH_SEARCH = 3;    // constant for searching for matches across sequences
var SEQ_SEARCH   = 4;    // constant for searching for input sequence

var RAW     = "raw";     // constant for raw value classification
var PHYSICO = "physico"; // constant for physicochemical classification
var HYDRO   = "hydro";   // constant for hydropathic classification
var VOL     = "volume";  // constant for volume classification
var CHEM    = "chem";    // constant for chemical classification
var CHAR    = "charge";  // constant for charge classification
var DONOR   = "donor";   // constant for donor-accept classification
var POL     = "pol";     // constant for polarity classification
var CON     = "conserv"; // constant for conservation classification

/****  substitution matrices  ****/

var B45  = null;
var B50  = null;
var B62  = null;
var B80  = null;
var B100 = null;
var P30  = null;
var P40  = null;
var P70  = null;
var P120 = null;
var P250 = null;

var CUST = null;

/****  substitution matrix row names ****/

var nameB45  = [];
var nameB50  = [];
var nameB62  = [];
var nameB80  = [];
var nameB100 = [];

var nameP30  = [];
var nameP40  = [];
var nameP70  = [];
var nameP120 = [];
var nameP250 = [];

var nameCUST = [];

/****  Non-constants  ****/

var aList = [];         // list for storing the color and amino acid
                        //    strings for the classification legend
                        //    in the detail view.
var searchOn      = 1;  // search options (none to start)
var classifyAllOn = 1;  // classification of detail view (raw to start)

</script>
