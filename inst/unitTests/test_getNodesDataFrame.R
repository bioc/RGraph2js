checkSimpleNodesDataFrame <- function(ndf) {
    ## The expected data frame is:
    ##
    ##       width   color  shape link tooltip
    ## A     1 #FFFFFF circle
    ## B     1 #FFFFFF circle
    ## C     1 #FFFFFF circle
    ## D     1 #FFFFFF circle
    ## E     1 #FFFFFF circle
    ##
    colnames <- names(ndf)
    checkEquals(length(ndf), 5)
    checkTrue("width" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("shape" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    checkEquals(as.character(ndf["A", "shape"]), 'circle')
    checkEquals(as.character(ndf["B", "shape"]), 'circle')
    checkEquals(as.character(ndf["C", "shape"]), 'circle')
    checkEquals(as.character(ndf["D", "shape"]), 'circle')
    checkEquals(as.character(ndf["E", "shape"]), 'circle')
    checkEquals(as.character(ndf["A", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["B", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["C", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["D", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["E", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["A", "width"]), '1')
    checkEquals(as.character(ndf["B", "width"]), '1')
    checkEquals(as.character(ndf["C", "width"]), '1')
    checkEquals(as.character(ndf["D", "width"]), '1')
    checkEquals(as.character(ndf["E", "width"]), '1')
}

test_getNodesDataFrame <- function() {
    v <- c(0, 0, 1, 1, 0,
           0, 0, 0, 0, 0,
           -1, 0, 0, 1, 0)
    a <- matrix(v, 3, 5)
    colnames(a) <- LETTERS[1:5]
    rownames(a) <- LETTERS[1:3]
    ## with an adjacency matrix only
    ndf <- getNodesDataFrame(A=a)
    checkSimpleNodesDataFrame(ndf)
    ## with global and specific node properties
    nGlobal <- list(color="#dedeff")
    nProp <- data.frame(
        shape=c('triangle', 'lozenge'),
        width=c(2, 4)
    )
    rownames(nProp) <- c('C', 'E')
    ndf <- getNodesDataFrame(A=a, nGlobal=nGlobal, nProp=nProp)
    colnames <- names(ndf)
    checkEquals(length(ndf), 5)
    checkTrue("width" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("shape" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    checkEquals(as.character(ndf["A", "shape"]), 'circle')
    checkEquals(as.character(ndf["B", "shape"]), 'circle')
    checkEquals(as.character(ndf["C", "shape"]), 'triangle')
    checkEquals(as.character(ndf["D", "shape"]), 'circle')
    checkEquals(as.character(ndf["E", "shape"]), 'lozenge')
    checkEquals(as.character(ndf["A", "color"]), '#dedeff')
    checkEquals(as.character(ndf["B", "color"]), '#dedeff')
    checkEquals(as.character(ndf["C", "color"]), '#dedeff')
    checkEquals(as.character(ndf["D", "color"]), '#dedeff')
    checkEquals(as.character(ndf["E", "color"]), '#dedeff')
    checkEquals(as.character(ndf["A", "width"]), '1')
    checkEquals(as.character(ndf["B", "width"]), '1')
    checkEquals(as.character(ndf["C", "width"]), '2')
    checkEquals(as.character(ndf["D", "width"]), '1')
    checkEquals(as.character(ndf["E", "width"]), '4')
}

test_getNodesDataFrame_graphAM <- function() {
    require(graph)
    ## the adjacency matrix must be square in order to create a graphAM
    ## object.  additionally it must not contain any negative value.
    v <- c(0, 0, 1, 0, 0,
           1, 0, 0, 0, 0,
           0, 0, 0, 0, 0,
           0, 1, 0, 0, 0,
           0, 1, 0, 0, 0)
    a <- matrix(v, 5, 5)
    colnames(a) <- LETTERS[1:5]
    rownames(a) <- LETTERS[1:5]
    gam <- graphAM(adjMat=a, edgemode='directed')
    adjMat <- RGraph2js:::getAdjMat(gam)
    ndf <- getNodesDataFrame(A=adjMat)
    checkSimpleNodesDataFrame(ndf)
}

test_getNodesDataFrame_graphBAM <- function() {
    require(graph)
    from <- c("A", "B", "B", "C")
    to <- c("B", "D", "E", "A")
    weight <- c(1,1,1,1)
    df <- data.frame(from, to, weight)
    gbam <- graphBAM(df, edgemode = "directed")
    adjMat <- RGraph2js:::getAdjMat(gbam)
    ndf <- getNodesDataFrame(A=adjMat)
    checkSimpleNodesDataFrame(ndf)
}

test_getNodesDataFrame_graphNEL <- function() {
    require(graph)
    from <- c("A", "B", "B", "C")
    to <- c("B", "D", "E", "A")
    L <- cbind(from, to)
    gnel <- ftM2graphNEL(L, edgemode="directed")
    adjMat <- RGraph2js:::getAdjMat(gnel)
    ndf <- getNodesDataFrame(A=adjMat)
    checkSimpleNodesDataFrame(ndf)
}

test_getNodesDataFrame_clusterGraph <- function() {
    require(graph)
    c <- list(a=c("A","B","C"), b=c("D","E","F"))
    cg <- new("clusterGraph", clusters=c)
    adjMat <- sign(as(cg, "matrix"))
    ndf <- getNodesDataFrame(A=adjMat)
    colnames <- names(ndf)
    checkEquals(length(ndf), 5)
    checkTrue("width" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("shape" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    checkEquals(as.character(ndf["A", "shape"]), 'circle')
    checkEquals(as.character(ndf["B", "shape"]), 'circle')
    checkEquals(as.character(ndf["C", "shape"]), 'circle')
    checkEquals(as.character(ndf["D", "shape"]), 'circle')
    checkEquals(as.character(ndf["E", "shape"]), 'circle')
    checkEquals(as.character(ndf["F", "shape"]), 'circle')
    checkEquals(as.character(ndf["A", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["B", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["C", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["D", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["E", "color"]), '#FFFFFF')
    checkEquals(as.character(ndf["A", "width"]), '1')
    checkEquals(as.character(ndf["B", "width"]), '1')
    checkEquals(as.character(ndf["C", "width"]), '1')
    checkEquals(as.character(ndf["D", "width"]), '1')
    checkEquals(as.character(ndf["E", "width"]), '1')
    checkEquals(as.character(ndf["F", "width"]), '1')
}
