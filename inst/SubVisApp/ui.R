########################################################################
# 
# Copyright (C) 2016  Scott Barlowe
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
#######################################################################

###########################################################
# Filename:  ui.R 
# Shiny UI for Subvis.  Provides all of the buttons, 
# drop-downs, radiobuttons, etc. for input to server.R  
# Loads four other files:
#
#        js/SubVisGlobals.js
#        js/SubVisDraw.js
#        js/SubVisEvents.js
#        js/SubVisGetDecide.js
#
# @author:  Scott Barlowe
# @date:    May 25, 2016
###########################################################

# Load the shiny library
library(shiny)

# Matrix list for check box selection

matList = list("Blosum45"  = 1, 
               "Blosum50"  = 2, 
               "Blosum62"  = 3,
               "Blosum80"  = 4,
               "Blosum100" = 5,
               "PAM30"     = 6,
               "PAM40"     = 7,
               "PAM70"     = 8,
               "PAM120"    = 9,
               "PAM250"    = 10)


checkBoxNameList = list("Blosum45", 
                        "Blosum50", 
                        "Blosum62",
                        "Blosum80",
                        "Blosum100",
                        "PAM30",
                        "PAM40",
                        "PAM70",
                        "PAM120",
                        "PAM250")

# Scoring list for drop-down box 

scoreType = list("local"        = 1,
                 "global"       = 2,
                 "overlap"      = 3,
                 "global-local" = 4,
                 "local-global" = 5)

# Searching options for detail view

searchType = list("NONE"  = 1,
                  "INDEL" = 2,
                  "MATCH" = 3,
                  "SEQ"   = 4)

# List used for several toggles

toggleOnOff = list("OFF" = 1,
                   "ON"  = 2) 


shinyUI(navbarPage(title="SubVis", id="sv",

     #  UI for initial parameters.  Allows the user to 
     #   1.  load the alignment files
     #   2.  select the standard matrices for analysis
     #   3.  load a custom matrix
     #   4.  select the scoring type

     
     
     tabPanel(title="Options",
          
          fluidRow(
               column(4,
                    
                    # Dynamic input for either Textbox or File upload  
                    selectInput("input_type", "Sequence Input Type",
                      c("Textbox", "File")
                    ),
        
                    uiOutput("ui")
                    
                ),

                column(4,
                    strong("BLOSUM MATRICES"),
                    br(),
                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[1], label = checkBoxNameList[1] ,value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[1], label="Gap", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[1], label="Ext", value = -1)),

                    br(),

                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[2], label = checkBoxNameList[2],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[2], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[2], label="", value = -1)),

                    br(),

                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[3], label = checkBoxNameList[3],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[3], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[3], label="", value = -1)),

                    br(),

                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[4], label = checkBoxNameList[4],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[4], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[4], label="", value = -1)),

                    br(),

                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[5], label = checkBoxNameList[5],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[5], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[5], label="", value = -1)),


                    radioButtons("custMat", label = "CUSTOM MATRIX", choices = toggleOnOff, selected = 1, inline = FALSE),
                    div(style="width: 200px;", fileInput("fileIn", label = NULL, multiple = FALSE, accept = NULL)),
                    br(),

                    br(),
                    br(),
                    br(),
                    br()
                    
                ),

                column(4,
                    strong("PAM MATRICES"),
                    br(),
                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[6], label = checkBoxNameList[6],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[6], label="Gap", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[6], label="Ext", value = -1)),

                    br(),
                    
                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[7], label = checkBoxNameList[7],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[7], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[7], label="", value = -1)),
                    
                    br(),
                    
                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[8], label = checkBoxNameList[8],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[8], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[8], label="", value = -1)),
                    
                    br(),
                    
                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[9], label = checkBoxNameList[9],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[9], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[9], label="", value = -1)),
                    
                    br(),
                    
                    div(style="display: inline-block; width: 100px;", checkboxInput(inputId = checkBoxIDList[10], label = checkBoxNameList[10],value=TRUE)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkGapList[10], label="", value = -2)),
                    div(style="display: inline-block; width: 50px;", textInput(inputId=checkExtList[10], label="", value = -1)),


                    div(selectInput("alignScore", choices = scoreType, label = "SCORE", selected = 1),
                         tags$style(type='text/css', "#score { width: 100px; }"),
                    br(),
                    h5(strong("PERFORM ALIGNMENT")),
                    actionButton("goButton", strong("GO"))
              )
           )
         )
      ),
     
     # UI Components common to both the overview and detail views.
     # Overview only has zooming and Go buttons
     
     tabPanel(title="VIZ", 
          br(),
          textOutput("errorText"),
          tags$head(tags$style("#errorText{color: grey;
                                 font-size: 20px;}"
                              )
                   ),
          br(),
          sidebarPanel(width = 3,
               selectInput("overViewOn", "VIEW", c(Overview = "overview", Detail = "detail", Search = "search")),
               strong("ZOOM"),
               br(),
               actionButton("zoomOutButton", strong("-")),
               actionButton("zoomInButton", "+"),
               br(),

     #  Detail view.  User can view the alignments classified as
     #                  0.  Raw values 
     #                  1.  Physicochemical properties
     #                  2.  Hydropathic properties
     #                  3.  Volume
     #                  4.  Chemical properties
     #                  5.  Charge
     #                  6.  Donor accept properties
     #                  7.  Polarity
     #                  8.  Conserved or not
     #
               conditionalPanel(condition = "input.overViewOn == 'detail'",
                    br(),
                    selectInput("classifyOn", "CLASSIFY", c(Raw = "raw", Physicochemical = "physico", 
                         Hydropathy   = "hydro", Volume   = "volume", 
                         Chemical     = "chem",  Charge   = "charge", 
                         Donor_Accept = "donor", Polarity = "pol",
                         Conservation = "conserv")),     
                    strong("BLOCKS/ALPHA"),
                    br(),
                    actionButton("alphaButton", "Alpha On/Off"),
                    br(),
                    br(),
                    strong("NAVIGATION"),
                    br(),
                    
                    actionButton("beginButton", "S"),
                    actionButton("endButton", "E"),
                    HTML("  Start/End"),
                    br(),
                    actionButton("upButton", "U"),
                    actionButton("downButton", "D"),
                    HTML("  Up/Down"),
                    br(),
                    actionButton("backButton", strong("<")),
                    actionButton("forwardButton", strong(">")),
                    HTML("  Back/Forw"),
                    br(),
                    br(),
                    strong("FILTER"),
                    br(),
                    actionButton("pairButton", "Pair"),
                    actionButton("patternButton", "Patt"),
                    actionButton("subjectButton", "Subj"),
                    br()),
               
                    conditionalPanel(condition = "input.overViewOn == 'search'",
                      br(),                                                                                                                                                    
                      div(style="display:inline-block",
                         textInput("seqGoTo", label = strong("POS (Click GO)"), value = NULL),
                         tags$style(type='text/css', "#seqGoTo { width: 50px; }")
                      ),
                      radioButtons("search", label = strong("SEARCH (Click GO)"), choices = searchType, selected = 1, inline = FALSE),
                      div(style="display:inline-block",
                         textInput("seqSearch", label = NULL, value = NULL),
                         tags$style(type='text/css', "#seqSearch { width: 50px; }")
                      ),
                    br(),
                    actionButton("goButtonViz", strong("GO")),
                    br()
                )                                         
          ),
     
    #  Main drawing area.  Loads JavaScript files for drawing.
    
          mainPanel(title ="",
               includeHTML(file.path("js", "SubVisGlobals.js", fsep = .Platform$file.sep)),
               includeHTML(file.path("js", "SubVisDraw.js", fsep = .Platform$file.sep)),
               includeHTML(file.path("js", "SubVisEvents.js", fsep = .Platform$file.sep)),
               includeHTML(file.path("js", "SubVisGetDecide.js", fsep = .Platform$file.sep)),
               HTML("<div style = 'margin-left: auto;margin-right: auto;'>"),
               HTML("<canvas id ='myCanvasProt' style ='border:2px solid #000000;'></canvas>"),
               HTML("</div>")
               
          )),

    tabPanel(title="Help",
             includeHTML(file.path("..", "doc", "SubVis.html",fsep = .Platform$file.sep))
    )

))

