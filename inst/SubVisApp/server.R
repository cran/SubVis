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
# Filename:  server.R
# Provides server capabilities for running Shiny
# Receives input from ui.R and calls JavaScript functions
#
# @author:  Scott Barlowe
# @date:    May 25, 2016
###########################################################

#Loads required libraries for UI and alignment functions
library(shiny)
library(Biostrings)   


# Globals for search options
NO_SEARCH    = 1
INDEL_SEARCH = 2
MATCH_SEARCH = 3
SEQ_SEARCH   = 4

# Global for checking custom matrix status 
CUST_ON = 2

# Initial load of BLOSUM and PAM matrices
#   to the workspace
data(BLOSUM45)
data(BLOSUM50)
data(BLOSUM62)
data(BLOSUM80)
data(BLOSUM100)
data(PAM30)
data(PAM40)
data(PAM70)
data(PAM120)
data(PAM250)


# Load sub. matrices for log-odd details
B_45  <- matrix(BLOSUM45)
B_50  <- matrix(BLOSUM50)
B_62  <- matrix(BLOSUM62)
B_80  <- matrix(BLOSUM80)
B_100 <- matrix(BLOSUM100)
P_30  <- matrix(PAM30)
P_40  <- matrix(PAM40)
P_70  <- matrix(PAM70)
P_120 <- matrix(PAM120)
P_250 <- matrix(PAM250)


###########################################################
# Name: initMat
# Load standard substitution matrices from Biostrings library
#
# @param: matrices    Matrix type
# 
###########################################################
initMat<-function(matrices){
  
  switch(matrices,
         "1"  = data(BLOSUM45),   
         "2"  = data(BLOSUM50),
         "3"  = data(BLOSUM62),
         "4"  = data(BLOSUM80),
         "5"  = data(BLOSUM100),
         "6"  = data(PAM30),
         "7"  = data(PAM40),
         "8"  = data(PAM70),
         "9"  = data(PAM120),
         "10" = data(PAM250)
  )
  
}

###########################################################
# Name: getMatString
# Define strings that correspond to substitution matrix types
#
# @param: matrices    Matrix type
#
# @returns: MatString string representing matrix type
# 
###########################################################
getMatString<-function(matrices){
  
  switch(matrices,
         "1"  =  (matString <- "BLOSUM45"),   
         "2"  =  (matString <- "BLOSUM50"),
         "3"  =  (matString <- "BLOSUM62"),
         "4"  =  (matString <- "BLOSUM80"),
         "5"  =  (matString <- "BLOSUM100"),
         "6"  =  (matString <- "PAM30"),
         "7"  =  (matString <- "PAM40"),
         "8"  =  (matString <- "PAM70"),
         "9"  =  (matString <- "PAM120"),
         "10" =  (matString <- "PAM250")
  )
  
  return (matString)
  
}

###########################################################
# Name: getScopeString
# Define strings that correspond to scoring types
# 
# @param: alignScore    Scoring type
#
# @returns: ScopeString string representing scoring type
# 
###########################################################
getScopeString<-function(alignScore){
  
  switch (alignScore,
          "1" = (scopeString <- "local"),
          "2" = (scopeString <- "global"),
          "3" = (scopeString <- "overlap"),
          "4" = (scopeString <- "global-local"),
          "5" = (scopeString <- "local-global"),
  )
  
  return (scopeString)
}

###########################################################
# Name: loadCustomMat
# Loads custom substutition matrix from user.  Format for
#
# @param: pattIn      Pattern alignment
# @param: subIn       Subject alignment
# @param: gapOpen     Score assigned to alignment opening
# @param: gatExt      Score assigned to alignment extensions
# @param: alignScore  Scoring parameters (local, global, etc.)
# @param: tempTable   Table containing custom matrix
# 
# @returns:  Pairwise alignment from Biostring's 
#            pairwiseAlignment function
###########################################################
loadCustomMat<-function(pattIn, subIn, gapOpen, gapExt, alignScore, tempTable){

  tempTable <- as.matrix(tempTable)
  
  scopeString = getScopeString(alignScore)

  return ((pairwiseAlignment(pattern = pattIn, 
                             subject = subIn, 
                             substitutionMatrix = tempTable,  
                             gapOpening = strtoi(gapOpen), 
                             gapExtension = strtoi(gapExt),
                             type = scopeString)))
  
}

###########################################################
# Name: readCustomFile
# Loads custom substutition matrix from user.  Format for
#    matrix:   First row --> Characters representing lookup
#                            table.
#              First col --> Transpose of first row starting
#                            at row 2
#              All other entries are substitution values
#
# @param: fI  Input file containing custom matrix
# 
# @returns:  Custom matrix in table format
###########################################################
readCustomFile<-function(fI){
  
  tempTable<-read.table(fI$datapath, row.names = 1, 
                       header = TRUE, check.names=FALSE)

  return (tempTable)

}

###########################################################
# Name: loadPairs
# Loads list with the alignment of the raw pattern,
# raw subject, and score.  The list is arranged such 
# that    
#      index 0 --> pattern
#      index 1 --> subject
#      index 2 --> score
#      index 3 --> checked
#
# @param: pairList  List to store pattern, subject,
#                   and score
# @param: pairRaw   Alignment pair
# @param: checked   Substitution matrix type
#
# @returns: List loaded as described above
###########################################################
loadPairs<-function(pairList, pairRaw, checked){
  
  pairList<-append(pairList, toString(pattern(pairRaw)))   #slot0
  pairList<-append(pairList, toString(subject(pairRaw)))   #slot1
  pairList<-append(pairList, toString(score(pairRaw)))     #slot2
  pairList<-append(pairList, toString(checked))            #slot3

  return (pairList)

}

###########################################################
# Name: noSearch
# Loads list with empty string values since no search 
# option is selected.  The list is arranged such 
#    
#      index 4 --> ""
#      index 5 --> ""
#      index 6 --> ""
#      index 7 --> ""
#
# @param: pairList  List to fill with search options
#
# @returns: List loaded as described above
###########################################################
noSearch<-function(pairList){
  
  pairList<-append(pairList, toString("")) #slot4
  pairList<-append(pairList, toString("")) #slot5
  pairList<-append(pairList, toString("")) #slot6
  pairList<-append(pairList, toString("")) #slot7

  return (pairList)
  
}

###########################################################
# Name:  search
# Loads list with string values representing the start and 
# end position of matches  The list is arranged such 
#    
#      index 4 --> String containing all columns 
#                  representing the start of match 
#                  in pattern
#      index 5 --> String containing all columns 
#                  representing the end of match 
#                  in pattern
#      index 6 --> String containing all columns 
#                  representing the start of match 
#                  in subject
#      index 7 --> String containing all columns 
#                  representing the end of match 
#                  in subject
#
# @param: pairList  List to fill with search options
# @param: pairRaw   Alignment pair
# @param: searchSeq Sequence for which to search
#
# @returns: List loaded as described above
###########################################################
search<-function(pairList, pairRaw, searchSeq){
  
  #String of numbers separated by commas representing location 
  #of matches
  matPat<-matchPattern(toupper(searchSeq), toString(pattern(pairRaw)))
  subPat<-matchPattern(toupper(searchSeq), toString(subject(pairRaw)))

  pairList<-append(pairList, gsub(",", "", toString(start(matPat))))
  pairList<-append(pairList, gsub(",", "", toString(end(matPat))))
  pairList<-append(pairList, gsub(",", "", toString(start(subPat))))
  pairList<-append(pairList, gsub(",", "", toString(end(subPat))))
  
  return (pairList)

}

###########################################################
# Name: showIndel
# Loads list with string values representing indels 
# end position of matches  The list is arranged such 
#    
#      index 4 --> String containing all columns 
#                  representing the start of indels 
#                  in pattern
#      index 5 --> String containing all columns 
#                  representing the end of indels 
#                  in pattern
#      index 6 --> String containing all columns 
#                  representing the start of indels 
#                  in subject
#      index 7 --> String containing all columns 
#                  representing the end of indels 
#                  in subject
#
# @param: pairList  List to fill with search options
# @param: pairRaw   Alignment pair
#
# @returns: List loaded as described above
###########################################################
showIndel<-function(pairList, pairRaw){
  
  matPat<-(indel(pattern(pairRaw)))
  subPat<-(indel(subject(pairRaw)))
  
  pairList<-append(pairList, gsub(",", "", toString(unlist(start(matPat))))) #slot4
  pairList<-append(pairList, gsub(",", "", toString(unlist(end(matPat)))))   #slot5
  pairList<-append(pairList, gsub(",", "", toString(unlist(start(subPat))))) #slot6
  pairList<-append(pairList, gsub(",", "", toString(unlist(end(subPat)))))   #slot7
  
  return (pairList)

}

###########################################################
# Name: calcPID
# Stores the different percent identities calculated by the
# pid function from ......
#  
#      index 8  --> PID1
#      index 9  --> PID2
#      index 10 --> PID3
#      index 11 --> PID4
#
# @param: pairList  List to fill with search options
# @param: pairRaw   Alignment pair
#
# @returns: List loaded as described above
###########################################################
calcPID<-function(pairList, pairRaw){
  
  pairList<-append(pairList, toString(pid(pairRaw, type="PID1")/100)) #slot8
  pairList<-append(pairList, toString(pid(pairRaw, type="PID2")/100)) #slot9
  pairList<-append(pairList, toString(pid(pairRaw, type="PID3")/100)) #slot10
  pairList<-append(pairList, toString(pid(pairRaw, type="PID4")/100)) #slot11
  
}

###########################################################
# Name: calculateProtAlignment
# Calculates pairwise alignment between a pattern and 
# subject
#
# @param: matrices    Substituion matrix
# @param: pattIn      Pattern alignment
# @param: subIn       Subject alignment
# @param: gapOpen     Score assigned to alignment opening
# @param: gatExt      Score assigned to alignment extensions
# @param: alignScore  Scoring parameters (local, global, etc.)
# 
# @returns:  Pairwise alignment from Biostring's 
#            pairwiseAlignment function
###########################################################
calculateProtAlignment<-function(matrices, pattIn, subIn, gapOpen, gapExt, alignScore){

    matString   = getMatString(matrices)
    scopeString = getScopeString(alignScore)
  
    return ((pairwiseAlignment(pattern = pattIn, 
                               subject = subIn, 
                               substitutionMatrix = matString,  
                               gapOpening = strtoi(gapOpen), 
                               gapExtension = strtoi(gapExt),
                               type = scopeString)))
}


###########################################################
# Name: readSeq
# Reads fasta file 
#
# @param: fI input file
# 
# @returns:  Amino acid sequence
###########################################################
readSeq<-function(fI){
    
    return (readAAStringSet(fI$datapath, "fasta"))
  
}
                      
#Server begins
shinyServer(function(input, output, session) {
  
  values<-reactiveValues()
  values$xTemp2<-matrix(1:12, nrow = 3, ncol =4)

  goToPos     = 0     # position in the sequence(s) to go to
  searchOn    = 1     # search is turned on
  custMat     = 1      # load custom matrix
  pattIn      = NULL  # input pattern
  subIn       = NULL  # input subject

  paramList<-list()
  paramList<-c(-2, -1, "local")   # initialize penalties 
                                  # and scoring type

  origList<-list()
  origList<-append(origList, toString(pattIn)) # initialize pattern storage
  origList<-append(origList, toString(subIn))  # initialize subject storage
  
  # Load BLOSUM substitution matrices for log odds access
  session$sendCustomMessage(type = "LoadBlosum45", B_45)
  session$sendCustomMessage(type = "LoadBlosum50", B_50)
  session$sendCustomMessage(type = "LoadBlosum62", B_62)
  session$sendCustomMessage(type = "LoadBlosum80", B_80)
  session$sendCustomMessage(type = "LoadBlosum100", B_100)
  
  # Load PAM substitution matrices for log odds access
  session$sendCustomMessage(type = "LoadPam30", P_30)
  session$sendCustomMessage(type = "LoadPam40", P_40)
  session$sendCustomMessage(type = "LoadPam70", P_70)
  session$sendCustomMessage(type = "LoadPam120", P_120) 
  session$sendCustomMessage(type = "LoadPam250", P_250)

  # Load BLOSUM substituion matrix alphabets for log odds access
  session$sendCustomMessage(type = "LoadBlosum45Names", row.names(BLOSUM45))
  session$sendCustomMessage(type = "LoadBlosum50Names", row.names(BLOSUM50))
  session$sendCustomMessage(type = "LoadBlosum62Names", row.names(BLOSUM62))
  session$sendCustomMessage(type = "LoadBlosum80Names", row.names(BLOSUM80))
  session$sendCustomMessage(type = "LoadBlosum100Names", row.names(BLOSUM100))
  
  # Load PAM substituion matrix alphabets for log odds access
  session$sendCustomMessage(type = "LoadPam30Names", row.names(PAM30))
  session$sendCustomMessage(type = "LoadPam40Names", row.names(PAM40))
  session$sendCustomMessage(type = "LoadPam70Names", row.names(PAM70))
  session$sendCustomMessage(type = "LoadPam120Names", row.names(PAM120))
  session$sendCustomMessage(type = "LoadPam250Names", row.names(PAM250))
  
  
# Listen for changes in UI
  observe({
    
    input$goButton
    
    # if "GO" button is clicked
    # reload data with any changes
    if(input$goButton != 0){
            
      isolate({
        
        searchList<-list()
        pairList <- list()
        
        pattIn<-readSeq(input$fileInPat) # read pattern sequence
        subIn<-readSeq(input$fileInSub)  # read subject sequence
        
        # iterate through sustution matrices checked
        for(checked in input$subList){  
          
          initMat(checked)
    
          paramList[[1]] = input$gapOpen     # store gap penalty
          paramList[[2]] = input$gapExt      # store extension penalty
          paramList[[3]] = getScopeString(input$alignScore) #store scoring type
          
          # calculate alignments and store results
          pairRaw<-calculateProtAlignment(checked, pattIn, subIn, 
                                          input$gapOpen, input$gapExt, 
                                          input$alignScore)
          
          pairList<-loadPairs(pairList, pairRaw, checked)
          
          # search is turned off
          if(input$search == NO_SEARCH){    
            
            searchOn = NO_SEARCH 
            pairList<-noSearch(pairList)
  
          }
          
          # search for indels
          if(input$search == INDEL_SEARCH){
          
            searchOn = INDEL_SEARCH
            pairList<-showIndel(pairList, pairRaw)
          
          }
          
          # search for matches across sequences
          # nothing to do differently 
          #   for the search functions
          #   in server.R
          if(input$search == MATCH_SEARCH){
            
            searchOn = MATCH_SEARCH
            pairList<-noSearch(pairList)
            
          }
          
          # search for sequence
          if(input$search == SEQ_SEARCH){
            
            searchOn = SEQ_SEARCH 
            pairList<-search(pairList, pairRaw, input$seqSearch) 
            
          }
          
          # calculate percent identity
          pairList<-calcPID(pairList, pairRaw)
          
        }
        
        # Perform calculations and searches with 
        # custom matrix included (same as above)
        if(input$custMat == CUST_ON){
          
            newTable<-readCustomFile(input$fileIn)
          
            pairRawCust<-loadCustomMat(pattIn, subIn, input$gapOpen, 
                                       input$gapExt, input$alignScore, 
                                       newTable)
            
            pairList<-loadPairs(pairList, pairRawCust, "-1")
     
            # Load custom alphabet and matrix
            session$sendCustomMessage(type = "LoadCustNames", row.names(newTable))
            session$sendCustomMessage(type = "LoadCust", unlist(matrix(newTable)))
                        
            if(input$search == NO_SEARCH){    
              
              searchOn = NO_SEARCH
              pairList<-noSearch(pairList)
              
            }
            
            if(input$search == INDEL_SEARCH){
              
              searchOn = INDEL_SEARCH
              pairList<-showIndel(pairList, pairRawCust)
              
            }
            
            if(input$search == MATCH_SEARCH){
              
              searchOn = MATCH_SEARCH
              pairList<-noSearch(pairList)
              
            }
            
            if(input$search == SEQ_SEARCH){
              
              searchOn = SEQ_SEARCH
              pairList<-search(pairList, pairRawCust, input$seqSearch) 
              
            }
            
            pairList<-calcPID(pairList, pairRawCust)
            
          }
        
        goToPos  = input$seqGoTo  # retrieve location to go to 

      })
    
      # initialize and fill meta data
      # includes fasta file header information 
      metaList<-list()
      
      tS<-toString(names(pattIn))
      if(nchar(tS) > 30){
        tS<-substr(tS, 1, 30)
      }
      metaList<-append(metaList, tS)
      metaList<-append(metaList, toString(pattIn))
      
      tS<-toString(names(subIn))
      if(nchar(tS) > 30){
        tS<-substr(tS, 1, 30)
      }
      
      metaList<-append(metaList, tS)
      metaList<-append(metaList, toString(subIn))
      
      # send remaining messages to Javascript drawer
      session$sendCustomMessage(type = "searchCallbackHandler", searchOn)
      session$sendCustomMessage(type = "metaCallbackHandler", metaList)     
      session$sendCustomMessage(type = "goToMessage", goToPos)
      session$sendCustomMessage(type = "updateParamHandler", paramList)
      session$sendCustomMessage(type = "myCallbackHandler", pairList)
  
    }
  })

  # observe if button to increase sequence position activated
  observe({
    input$forwardButton
    if(input$forwardButton != 0){
      session$sendCustomMessage(type = "forwardMessage", 1)
    }
  })
  
  # observe if button to decrease sequence position activated
  observe({
    input$backButton
    if(input$backButton != 0){
      session$sendCustomMessage(type = "backMessage", 1)
    }
  })
  
  # observe if zoom-out button activated
  observe({
    input$zoomOutButton
    if(input$zoomOutButton != 0){
      session$sendCustomMessage(type = "zoomOutMessage", 1)
    }
  })
  
  # observe if zoom-in button activated
  observe({
    input$zoomInButton
    if(input$zoomInButton != 0){
      session$sendCustomMessage(type = "zoomInMessage", 1)
    }
  })
  
  # observe if sequences are shown in pattern-subject pairs
  observe({
    input$pairButton
    if(input$pairButton != 0){
      session$sendCustomMessage(type = "pairLayMessage", 1)
    }
  })
  
  # observe if only pattern sequences are shown
  observe({
    input$patternButton
    if(input$patternButton != 0){
      session$sendCustomMessage(type = "patLayMessage", 1)
    }
  })
  
  # observe if only subject sequences are shown  
  observe({
    input$subjectButton
    if(input$subjectButton != 0){
      session$sendCustomMessage(type = "subLayMessage", 1)
    }
  })
  
  # observe if sequence view should return to position 1
  observe({
    input$beginButton
    if(input$beginButton != 0){
      session$sendCustomMessage(type = "beginMessage", 1)
    }
  })

  # observe if sequence view should go to end position
  observe({
    input$endButton
    if(input$endButton != 0){
      session$sendCustomMessage(type = "endMessage", 1)
    }
  })
  
  # observe if sequence view should be moved down
  observe({
    input$downButton
    if(input$downButton != 0){
      session$sendCustomMessage(type = "downMessage", 1)
    }
  })
  
  # observe if sequence view should be moved down
  observe({
    input$upButton
    if(input$upButton != 0){
      session$sendCustomMessage(type = "upMessage", 1)
    }
  })

  # observe if the residue abbreviation should be shown or not
  observe({
    input$alphaButton
    if(input$alphaButton != 0){
      session$sendCustomMessage(type = "alphaMessage", 1)
    }
  })

  # observe if the overview is toggled on
  observe({
    input$overViewOn
    session$sendCustomMessage(type = "overViewMessage", input$overViewOn)  
  })

  # observe if residues should be classified according to specific properties
  observe({
    input$classifyOn
    session$sendCustomMessage(type = "classifyHandler", input$classifyOn)
  })

})