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

#Load the shiny library
library(shiny)

#Matrix list for check box selection

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

#Scoring list for drop-down box 

scoreType = list("local"        = 1,
                 "global"       = 2,
                 "overlap"      = 3,
                 "global-local" = 4,
                 "local-global" = 5)

#Searching options for detail view

searchType = list("NONE"  = 1,
                  "INDEL" = 2,
                  "MATCH" = 3,
                  "SEQ"   = 4)

#List used for several toggles

toggleOnOff = list("OFF" = 1,
                   "ON"  = 2) 


shinyUI(navbarPage("SubVis",

     #  UI for initial parameters.  Allows the user to 
     #   1.  load the alignment files
     #   2.  select the standard matrices for analysis
     #   3.  load a custom matrix
     #   4.  select the scoring type
     
     tabPanel("Options", 
          fluidRow(
               column(4,
                    h5("FILES"),
                    fileInput("fileInPat", label = strong("File: Pattern"), multiple = FALSE, accept = NULL),
                    fileInput("fileInSub", label = strong("File: Subject"), multiple = FALSE, accept = NULL)),                                             
               column(4,
                    h5("MATRICES"),     
                    checkboxGroupInput("subList", label = h5("Standard"), choices = matList, selected = 3),
                    br(),
                    br(),
                    radioButtons("custMat", label = h5("Custom"), choices = toggleOnOff, selected = 1, inline = TRUE),
                    fileInput("fileIn", label = NULL, multiple = FALSE, accept = NULL)),                              
               column(4,
                    h5("PARAMETERS"),
                    div(style="display:inline-block", textInput("gapOpen", label = "Open", value = "-2"),
                         tags$style(type='text/css', "#gapOpen { width: 50px; }")
                    ),
                    div(style="display:inline-block",textInput("gapExt", label = "Ext", value = "-1"),
                         tags$style(type='text/css', "#gapExt { width: 50px; }")
                    ),                                     
                    div(selectInput("alignScore", choices = scoreType, label = "Score", selected = 1),
                         tags$style(type='text/css', "#score { width: 100px; }")
                    ),
                                     
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    br(),
                    br()
                                     
               )
          )
     ),
     
     # UI Components common to both the overview and detail views.
     # Overview only has zooming and Go buttons
     
     tabPanel("VIZ",  
          sidebarPanel(width = 3,
               selectInput("overViewOn", "Overview", c(Overview = "overview", Detail = "detail")),
               actionButton("zoomOutButton", strong("-")),
               actionButton("zoomInButton", "+"),
               br(),
               strong("----------------------------------"),
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
                    selectInput("classifyOn", "Classify", c(Raw = "raw", Physicochemical = "physico", 
                         Hydropathy   = "hydro", Volume   = "volume", 
                         Chemical     = "chem",  Charge   = "charge", 
                         Donor_Accept = "donor", Polarity = "pol",
                         Conservation = "conserv")),     
                    br(),
                    actionButton("beginButton", "Start"),
                    actionButton("endButton", "End"),
                    br(),
                    actionButton("pairButton", "Pair"),
                    actionButton("patternButton", "Patt"),
                    actionButton("subjectButton", "Subj"),
                    br(),
                    actionButton("upButton", "Up"),
                    actionButton("downButton", "Dn"),                             
                    actionButton("backButton", strong("<-")),
                    actionButton("forwardButton", strong("->")),
                    br(),
                    actionButton("alphaButton", "Alpha"),
                    br(),
                    strong("----------------------------------"),                                                         
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
                    br()
               ),                                         
               actionButton("goButton", strong("GO"))
          ),
     
    #  Main drawing area.  Loads JavaScript files for drawing.
    
          mainPanel(
               includeHTML("js/SubVisGlobals.js"),
               includeHTML("js/SubVisDraw.js"),
               includeHTML("js/SubVisEvents.js"),
               includeHTML("js/SubVisGetDecide.js"),
               HTML("<div style = 'margin-left: auto;margin-right: auto;'>"),
               HTML("<canvas id ='myCanvasProt' style ='border:2px solid #000000;'></canvas>"),
               HTML("</div>")
          )
     ) 
))

