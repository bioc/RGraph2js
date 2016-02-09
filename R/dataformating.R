#####################################################################
## This program is distributed in the hope that it will be useful, ##
## but WITHOUT ANY WARRANTY; without even the implied warranty of  ##
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the    ##
## GNU General Public License for more details.                    ##
#####################################################################

#' Get a RGraph2js compatible adjacency matrix from the provided R object.
#'
#' @param A signed weighted adjacency \code{matrix} or an instance of the class
#' \code{graphAM}, \code{graphBAM}, \code{graphNEL} or \code{clusterGraph}
#' from the graph package
#' @return the RGraph2js compatible adjacency \code{matrix}
#' @importFrom graph adjacencyMatrix
#' @author Stephane Cano \email{stephane.cano@@pmi.com}, PMP SA.
getAdjMat <- function(A) {
    ## Check if A is a class from the graph package
    ## The weights, if any, are managed by getEdgesPropFromAdjMat()
    if("graphAM" %in% class(A)) {
        ## The following returns an adj matrix that is not weighted
        ## A <- A@adjMat
        ## rownames(A) <- colnames(A)
        A <- as(A, "matrix")
    } else if("graphBAM" %in% class(A)) {
        ## The following returns an adj matrix that is not weighted
        ## A <- adjacencyMatrix(A)
        A <- as(A, "matrix")
    } else if("graphNEL" %in% class(A)) {
        A <- as(A, "matrix")
    } else if("clusterGraph" %in% class(A)) {
        A <- as(A, "matrix")
    } else if("MultiGraph" %in% class(A)) {
        stop(
            paste0(
                "The MultiGraph class is not directly supported, however ",
                "a Multigraph object can be converted to a graphAM ",
                "or graphBAM object by calling the 'extractgraphAM()' or ",
                "'extractGraphBAM()' function."
            )
        )
    }
    return(A)
}

#' Create Edges \code{data.frame} from Adjacency matrix and properties
#'
#' @param A signed weighted adjacency matrix
#' @param eGlobal A \code{list} of properties for assigning all edges.
#' Default value is \code{NULL}
#' @param eProp A \code{data.frame} for assigning some nodes properties
#' Default value is \code{NULL}
#' @return A \code{data.frame}
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
#' @importFrom digest digest
#' @export
#' @examples
#' v <- c(0, 0, 1, 1, 0,
#'        0, 0, 0, 0, 0,
#'       -1, 0, 0, 1, 0)
#' a <- matrix(v, 3, 5)
#' colnames(a) <- LETTERS[1:5]
#' rownames(a) <- LETTERS[1:3]
#' eGlobal <- list(color="#5555ff")
#' eProp <- data.frame(from=c('A','C'), to=c('B', 'A'), width=c(2,2))
#' getEdgesDataFrame(A=a, eGlobal=eGlobal, eProp=eProp)
getEdgesDataFrame <- function(A, eGlobal=NULL, eProp=NULL) {
    ## Hash separator
    hs <- '##{CONNECTED-TO}##'
    ## Creating the edges dataframe
    e <- as.vector(A)
    from <- rep(rownames(A), ncol(A))
    to <- rep(colnames(A), each=nrow(A))
    ## 1:from -> to
    ## any edge weight is translated into edge tickness (width)
    p <- cbind(from=from[e > 0], to=to[e > 0], type='->', width=e[e > 0])
    ## -1:from -| to
    ## any edge weight is translated into edge tickness (width)
    n <- cbind(from=from[e < 0], to=to[e < 0], type='-|', width=e[e < 0])    
    ## set empty data frames when no match
    if(!any(e < 0)) {
        n <- data.frame(from=c(), to=c(), type=c())
    }
    if(!any(e > 0)) {
        p <- data.frame(from=c(), to=c(), type=c())
    }
    ## symetry:from -- to
    ## "A -> B" and "B -> A" will become "A -- B"
    ## "A -| B" and "B -| A" will become "A -- B"
    if(nrow(n) > 0) {
        for (ni in 1:nrow(n)) {
            if (any(n[, "to"] == n[ni, "from"]
                    & n[, "from"] == n[ni, "to"]
                    & n[, "type"] == n[ni, "type"])) {
                n[n[, "to"] == n[ni, "from"]
                  & n[, "from"] == n[ni, "to"]
                  & n[, "type"] == n[ni, "type"], "type"] <- '--'
                n[ni, "type"] <- '--'
            }
        }
    }
    if(nrow(p) > 0) {
        for (pi in 1:nrow(p)) {
            if (any(p[, "to"] == p[pi, "from"]
                    & p[, "from"] == p[pi, "to"]
                    & p[, "type"] == p[pi, "type"])) {
                p[p[, "to"] == p[pi, "from"]
                  & p[, "from"] == p[pi, "to"]
                  & p[, "type"] == p[pi, "type"], "type"] <- '--'
                p[pi, "type"] <- '--'
            }
        }
    }
    e <- rbind(p, n)
    ## Reordering edges
    e <- e[order(e[, 2]), ]
    e <- e[order(e[, 1]), ]
    edf <- data.frame(e)
    edf$color <- rep('#000000', nrow(e))
    if("width" %in% colnames(edf)) {
        ## get the absolute value of "width"
        edf$width <- apply(edf["width"], 1, function(x) abs(as.numeric(x)))
    } else {
        edf$width <- rep(1, nrow(e))
    }
    edf$link <- rep('', nrow(e))
    edf$tooltip <- rep('', nrow(e))
    rownames(edf) <- apply(X=as.matrix(paste(edf$from, hs, edf$to)),
                           MARGIN=1, FUN=digest::digest)
    if (!is.null(eGlobal)) {
        for(nam in names(eGlobal)) {
            if (!nam %in% colnames(eGlobal)) {
                edf[, nam] <- rep(NA, nrow(edf))
            }
            edf[, nam] <- eGlobal[[nam]]
        }
    }
    if (!is.null(eProp)) {
        for(i in 1:nrow(eProp)) {
            key <- digest::digest(paste(eProp$from[i], hs, eProp$to[i]))
            for(colnam in colnames(eProp)) {
                if (colnam == 'from' | colnam == 'to') next
                if (!is.na(eProp[i, colnam])) {
                    ## message('Changing:[', key, ',', colnam, '] into:',
                    ##         as.vector(eProp[i, colnam]), 'i=', i, '\n')
                    edf[key, colnam] <- as.vector(eProp[i, colnam])[1]
                }
            }
        }
    }
    return(edf)
}

#' Create Nodes \code{data.frame} from Adjacency matrix and properties
#' for specific nodes
#'
#' @param A signed weighted adjacency matrix
#' @param nGlobal A \code{list} of properties for assigning all nodes.
#' Default value is \code{NULL}
#' @param nProp A \code{data.frame} for assigning some nodes properties
#' Default value is \code{NULL}
#' @return A \code{data.frame}
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
#' @importFrom rjson toJSON
#' @export
#' @examples
#' v <- c(0, 0, 1, 1, 0,
#'        0, 0, 0, 0, 0,
#'       -1, 0, 0, 1, 0)
#' a <- matrix(v, 3, 5)
#' colnames(a) <- LETTERS[1:5]
#' rownames(a) <- LETTERS[1:3]
#' nGlobal <- list(color="#dedeff")
#' nProp <- data.frame(shape=c('triangle', 'lozenge'))
#' rownames(nProp) <- c('C', 'E')
#' getNodesDataFrame(A=a, nGlobal=nGlobal, nProp=nProp)
getNodesDataFrame <- function(A, nGlobal=NULL, nProp=NULL) {
    ## if (dim(A)[1] > dim(A)[2]) {
    ##    nodeNames <- rownames(A)
    ## } else {
    ##    nodeNames <- colnames(A)
    ## }
    nodesNames <- unique(union(rownames(A), colnames(A)))

    nb <- length(nodesNames)
    ndf <- data.frame(width=rep(1, nb),
                      color=rep('#FFFFFF', nb),
                      shape=rep('circle', nb),
                      link=rep('', nb),
                      tooltip=rep('', nb))
    rownames(ndf) <- nodesNames

    if (!is.null(nGlobal)) {
        for(nam in names(nGlobal)) {
            if (!nam %in% colnames(ndf)) {
                ndf[,nam] <- rep(NA, nrow(ndf))
            }
            ndf[,nam] <- nGlobal[[nam]]
        }
    }
    if (!is.null(nProp)) {
        for(nnam in rownames(nProp)) {
            for(colnam in colnames(nProp)) {
                if (!is.na(nProp[nnam, colnam])) {
                    if (is.factor(ndf[nnam, colnam])) {
                        levels(ndf[, colnam]) <- c(levels(
                                                ndf[, colnam]
                                            ),
                                            as.character(
                                                nProp[nnam, colnam]
                                            ))
                        ndf[nnam, colnam] <- nProp[nnam, colnam]
                    }
                    ndf[nnam, colnam] <- as.vector(nProp[nnam, colnam])[1]
                }
            }
        }
    }
    return(ndf)
}

#' Generates JSON string correponding the the graph description
#'
#' @param ndf A \code{data.frame} correponding to nodes definition
#' @param edf A \code{data.frame} correponding to edges definition
#' @param innerValues A \code{matrix} of numerical values for plotting
#' in the node
#' @param innerColors A \code{matrix} of string colors values for plotting
#' in the node
#' @param innerTexts A \code{matrix} of strings for plotting in the node
#' @param starplotColors A \code{matrix} of hex RGB colors for sectors colors
#' @param starplotValues A \code{matrix} of [0,1] values for starpot sectors
#' size
#' @param starplotLabels A \code{matrix} of labels identifying the sectors
#' @param starplotTooltips A \code{matrix} of text or even html content for
#' the sectors tooltips
#' @param starplotUrlLinks A \code{matrix} of text for the sectors url links
#' @param starplotSectorStartRad A \code{matrix} with a single column of
#' [0,2PI] values for the sector start in radians
#' @param starplotCircleFillColor A \code{matrix} of hex RGB colors for
#' the circle background
#' @param starplotCircleFillOpacity A \code{matrix} of [0.0,1.0] values for
#' the circle background opacity
#' @return A JSON string with formatting
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
#' @export
#' @examples
#' v <- c(0, 0, 1, 1, 0,
#'        0, 0, 0, 0, 0,
#'       -1, 0, 0, 1, 0)
#' a <- matrix(v, 3, 5)
#' colnames(a) <- LETTERS[1:5]
#' rownames(a) <- LETTERS[1:3]
#'
#' nGlobal <- list(color="#dedeff")
#' nProp <- data.frame(shape=c('triangle', 'lozenge'))
#' rownames(nProp) <- c('C', 'E')
#' ndf <-getNodesDataFrame(A=a, nGlobal=nGlobal, nProp=nProp)
#'
#' eGlobal <- list(color="#5555ff")
#' eProp <- data.frame(from=c('A','C'), to=c('B', 'A'), width=c(2,2))
#' edf <- getEdgesDataFrame(A=a, eGlobal=eGlobal, eProp=eProp)
#'
#' graph2json(ndf=ndf, edf=edf)
graph2json <- function(ndf, edf,
                       innerValues=NULL, innerColors=NULL, innerTexts=NULL,
                       starplotColors=NULL, starplotValues=NULL,
                       starplotLabels=NULL, starplotTooltips=NULL,
                       starplotUrlLinks=NULL, starplotSectorStartRad=NULL,
                       starplotCircleFillColor=NULL,
                       starplotCircleFillOpacity=NULL) {
    ## First, creating a list based on nodes and edges dataframes
    if (is.null(innerValues)) {
        innerValues <- as.matrix(rep(0, nrow(ndf)), 1)
        rownames(innerValues) <- rownames(ndf)
    }
    if (is.null(innerColors)) {
        if (!is.null(innerValues)) {
            innerColors <- matrix(
                rep("#FFFFFF", nrow(ndf)*ncol(innerValues)),
                nrow(ndf), ncol(innerValues)
            )
        } else {
            innerColors <- matrix(rep("#FFFFFF", nrow(ndf)), 1)
        }
        rownames(innerColors) <- rownames(ndf)
    } else {
        ## Making sure that the colors are without any alpha channel
        innerColors <- apply(innerColors,
                              2,
                              FUN=function(x) {
                                  substr(x, start=1, stop=7)
                              })
    }
    if (is.null(innerTexts)) {
        if (!is.null(innerValues)) {
            innerTexts <- matrix(rep('', nrow(ndf)*ncol(innerValues)),
                                  nrow(ndf),
                                  ncol(innerValues))
        } else {
            innerTexts <- matrix(rep(''), nrow(ndf), 1)
        }
        rownames(innerTexts) <- rownames(ndf)
    }
    if (is.null(rownames(innerValues))) {
        stop(paste0('innerValues matrix should have rownames ',
                    'matching with nodes names'))
    }

    ## Add the StarPlot data
    if (!is.null(starplotValues)) {
        if (is.null(rownames(starplotValues))) {
            stop('starplotValues matrix should have rownames ',
                 'matching with nodes names')
        }
        if (is.null(starplotColors)) {
            ## generate default value
            starplotColors <- matrix(
                rep("#FFFFFF", nrow(ndf)*ncol(starplotValues)),
                nrow(ndf),
                ncol(starplotValues))
            rownames(starplotColors) <- rownames(ndf)
        } else {
            ## Making sure that the colors are without any alpha channel
            starplotColors <- apply(starplotColors,
                                     2,
                                     FUN=function(x) {
                                         substr(x, start=1, stop=7)
                                     })
        }
        if (is.null(starplotLabels)) {
            ## generate default value
            starplotLabels <- matrix(
                rep("", nrow(ndf)*ncol(starplotValues)),
                nrow(ndf),
                ncol(starplotValues)
            )
            rownames(starplotLabels) <- rownames(ndf)
        }
        if (is.null(starplotTooltips)) {
            ## generate default value
            starplotTooltips <- matrix(
                rep("", nrow(ndf)*ncol(starplotValues)),
                nrow(ndf),
                ncol(starplotValues)
            )
            rownames(starplotTooltips) <- rownames(ndf)
        }
        if (is.null(starplotSectorStartRad)) {
            ## generate default value
            starplotSectorStartRad <- matrix(0, nrow(ndf), 1)
            rownames(starplotSectorStartRad) <- rownames(ndf)
        }
        if (is.null(starplotCircleFillColor)) {
            ## generate default value
            starplotCircleFillColor <- matrix(
                rep("#000000", nrow(ndf)*ncol(starplotValues)),
                nrow(ndf),
                ncol(starplotValues)
            )
            rownames(starplotCircleFillColor) <- rownames(ndf)
            starplotCircleFillOpacity <- matrix(
                rep(0.0, nrow(ndf)*ncol(starplotValues)),
                nrow(ndf),
                ncol(starplotValues)
            )
            rownames(starplotCircleFillOpacity) <- rownames(ndf)
        } else {
            ## Making sure that the colors are without any alpha channel
            starplotCircleFillColor <- apply(
                starplotCircleFillColor,
                2,
                FUN=function(x) {
                    substr(x, start=1, stop=7)
                }
            )
        }
    }

    ## Make sure that colors are not with alpha channel
    highlightNodeColorsMatIdx <- NULL
    leadingNodesMatIdx <- NULL
    highlightNodeColorsIdx <- grep('highlight', names(ndf))
    if (length(highlightNodeColorsIdx) > 0) {
        highlightNodeColorsMatIdx <- as.integer(
            gsub("\\D", "", names(ndf)[highlightNodeColorsIdx])
        )
    }
    leadingNodesIdx <- grep('leading.nodes', names(ndf))
    if (length(leadingNodesIdx) > 0) {
        leadingNodesMatIdx <- as.integer(
            gsub("\\D", "", names(ndf)[leadingNodesIdx])
        )
    }

    ## Nulling colnames for inner stuff to prevent them to be converted
    ## into a json dict
    ## contrastNames <- colnames(innerValues)
    colnames(innerValues) <- NULL
    colnames(innerColors) <- NULL
    colnames(innerTexts) <- NULL

    nl <- list(nodes=vector(length=nrow(ndf), mode='list'),
               links=vector(length=nrow(edf), mode='list'))
    for(i in 1:nrow(ndf)) {
        ## Making sure that the colors are without any alpha channel
        color <- ndf$color[i]
        if (substr(color, start=1, stop=1) == '#') {
            color <- substr(color, start=1, stop=7)
        }
        nl$nodes[[i]]  <-  list(shape=ndf$shape[i],
                                color=color,
                                id=rownames(ndf)[i],
                                urlLink=ndf$link[i],
                                name=rownames(ndf)[i],
                                nodeTooltipHtmlContent=ndf$tooltip[i],
                                borderWidth=ndf$width[i],
                                ## contrastNames=contrastNames,
                                barplotTexts=c(
                                    as.list(
                                        as.character(
                                            innerTexts[rownames(ndf)[i], ]
                                        )
                                    )
                                ),
                                barplotValues=c(
                                    as.list(
                                        as.numeric(
                                            innerValues[rownames(ndf)[i], ]
                                        )
                                    )
                                ),
                                barplotColors=c(
                                    as.list(
                                        as.character(
                                            innerColors[rownames(ndf)[i], ]
                                        )
                                    )
                                ),
                                starplotValues=starplotValues[
                                    rownames(ndf)[i],
                                ],
                                starplotColors=starplotColors[
                                    rownames(ndf)[i],
                                ],
                                starplotLabels=starplotLabels[
                                    rownames(ndf)[i],
                                ],
                                starplotTooltips=starplotTooltips[
                                    rownames(ndf)[i],
                                ],
                                starplotUrlLinks=starplotUrlLinks[
                                    rownames(ndf)[i],
                                ],
                                starplotSectorStartRad=as.numeric(
                                    starplotSectorStartRad[
                                        rownames(ndf)[i],
                                    ]
                                ),
                                starplotCircleFillColor=as.character(
                                    starplotCircleFillColor[
                                        rownames(ndf)[i],
                                    ]
                                ),
                                starplotCircleFillOpacity=as.numeric(
                                    starplotCircleFillOpacity[
                                        rownames(ndf)[i],
                                    ]
                                ),
                                x=ndf$x[i],
                                y=ndf$y[i],
                                fixed=ndf$fixed[i])

        ## Fill leadingNode and highlight colors
        if (!is.null(highlightNodeColorsMatIdx)) {
            v <- vector()
            for(j in 1:length(highlightNodeColorsIdx)) {
                highlightColor <- ndf[i, highlightNodeColorsIdx[j]]
                ## get rid of the alpha color channel
                if (substr(highlightColor, 1, 1) == '#') {
                    highlightColor <- substr(highlightColor, 1, 7)
                }
                v[highlightNodeColorsMatIdx[j]] <- highlightColor
            }
            nl$nodes[[i]]  <- c(nl$nodes[[i]], list(contrastColors=v))
        }
        if (!is.null(leadingNodesMatIdx)) {
            v <- vector()
            for(j in leadingNodesMatIdx) {
                v[leadingNodesMatIdx[j]] <- as.integer(
                                            ndf[i, leadingNodesIdx[j]])
            }
            nl$nodes[[i]]  <- c(nl$nodes[[i]], list(leadingNode=v))
        }

        nl$nodes[i] <- c(nl$nodes[i],
                         list(
                             contrastColors=ndf$name[highlightNodeColorsIdx],
                             leadingNode=ndf$name[leadingNodesIdx]
                         )
                         )
    }
    for(i in 1:nrow(edf)) {
        sourceIdx <- which(rownames(ndf) == edf$from[i])
        targetIdx <- which(rownames(ndf) == edf$to[i])
        if (length(sourceIdx) == 0 | length(targetIdx) == 0) {
            warning('Node not found in list of nodes for edge')
        } else {
            nl$links[[i]] <- list(
                             color=edf$color[i],
                             source=sourceIdx - 1,
                             direction=edf$type[i],
                             target=targetIdx - 1,
                             width=edf$width[i],
                             linkTooltipHtmlContent=edf$tooltip[i]
                         )
        }
    }
    jsonStr <- rjson::toJSON(nl)
    return(jsonStr)
}

