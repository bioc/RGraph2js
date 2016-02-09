#####################################################################
## This program is distributed in the hope that it will be useful, ##
## but WITHOUT ANY WARRANTY; without even the implied warranty of  ##
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the    ##
## GNU General Public License for more details.                    ##
#####################################################################

#' Function wich generates a UUID version 4
#'
#' @param seed Integer for seeding the R random generator
#' @return String corresponding to the UUID generated.
getUUID <- function(seed=NULL) {
    if (!is.null(seed)) {
        set.seed(seed)
    }
    baseuuid <- paste(
        sample(
            c(letters[1:6], 0:9),
            30,
            replace=TRUE
        ),
        collapse=""
    )
    uuid <- paste(
        substr(baseuuid, 1, 8),
        substr(baseuuid, 9, 12),
        "4",
        substr(baseuuid, 13, 15),
        sample(c("8", "9", "a", "b"), 1),
        substr(baseuuid, 16, 18),
        substr(baseuuid, 19, 30),
        sep="",
        collapse=""
    )
    return(uuid)
}
