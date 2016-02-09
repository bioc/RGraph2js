test <- getDefaultToolParameters <- function() {
    params <- RGraph2js:::getDefaultToolParameters()
    for(url in params) {
        if(grepl(pattern="^http", x=url)) {
            mytempfile <- tempfile()
            tryCatch({download.file(
                          url=url,
                          destfile=mytempfile,
                          quiet=TRUE)},
                     error=function(err) {
                         stop(
                             paste0(
                                 "Cannot access URL ",
                                 url,
                                 " Error: ",
                                 err
                             )
                         )
                 })
            emptymsg <- paste0("The URL ",
                               url,
                               " gives no data!")
            checkTrue(file.info(mytempfile)$size != 0,
                      msg=emptymsg)
        }
    }
    
}
