#' Starts the SubVis app
#' 
#' Author:  Scott Barlowe
#' Date:  June 15, 2016
#' 
#' @export
#' 
#' 
#' @examples
#' 
#' \donttest{
#' startSubVis()
#' }
#' 
startSubVis <- function() {

  subvisDir <- system.file("SubVisApp", package = "SubVis")
  shiny::runApp(subvisDir, display.mode = "normal")

}