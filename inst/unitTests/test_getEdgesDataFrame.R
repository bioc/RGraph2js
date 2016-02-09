checkFromToAttributeEquals <- function(edf, from, to, attr, value) {
    checkEquals(
        as.character(
            edf[
                edf[, "from"] == from
                & edf[, "to"] == to, attr
            ]
        ),
        value)
}

checkSimpleLinks_directed <- function(edf) {
    colnames <- names(edf)
    checkEquals(length(edf), 7)
    checkTrue("from" %in% colnames)
    checkTrue("to" %in% colnames)
    checkTrue("type" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("width" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    ## check links
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="D",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="type", value="->")
}

checkSimpleLinks_undirected <- function(edf) {
    colnames <- names(edf)
    checkEquals(length(edf), 7)
    checkTrue("from" %in% colnames)
    checkTrue("to" %in% colnames)
    checkTrue("type" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("width" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    ## check links
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="C",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="D",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="D", to="B",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="E", to="B",
        attr="type", value="--")
}

checkAdvancedLinks_directed <- function(edf) {
    colnames <- names(edf)
    checkEquals(length(edf), 7)
    checkTrue("from" %in% colnames)
    checkTrue("to" %in% colnames)
    checkTrue("type" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("width" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    ## check links
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="D",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="D", to="E",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="E", to="A",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="E", to="B",
        attr="type", value="--")
}

test_getEdgesDataFrame <- function() {
    v <- c(0, 1, 1, 1, 0,
           0, -1, 0, 0, 0,
           -1, 0, 0, 1, 0)
    a <- matrix(v, 3, 5)
    colnames(a) <- LETTERS[1:5]
    rownames(a) <- LETTERS[1:3]
    ## adjacency matrix only
    edf <- getEdgesDataFrame(A=a)
    colnames <- names(edf)
    checkEquals(length(edf), 7)
    checkTrue("from" %in% colnames)
    checkTrue("to" %in% colnames)
    checkTrue("type" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("width" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    ## check links
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="C",
        attr="type", value="-|")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="D",
        attr="type", value="-|")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="type", value="->")
    ## with global and specific edge properties
    eGlobal <- list(color="#ffff00")
    eProp <- data.frame(
        from=c('A', 'C'),
        to=c('B', 'A'),
        width=c(2,2))
    edf <- getEdgesDataFrame(A=a, eGlobal=eGlobal, eProp=eProp)
    colnames <- names(edf)
    checkEquals(length(edf), 7)
    checkTrue("from" %in% colnames)
    checkTrue("to" %in% colnames)
    checkTrue("type" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("width" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    ## from A to B
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="color", value="#ffff00")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="width", value="2")
    ## from A to C
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="C",
        attr="type", value="-|")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="C",
        attr="color", value="#ffff00")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="C",
        attr="width", value="1")
    ## from B to A
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="color", value="#ffff00")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="width", value="1")
    ## from B to D
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="D",
        attr="type", value="-|")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="D",
        attr="color", value="#ffff00")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="D",
        attr="width", value="1")
    ## from B to D
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="color", value="#ffff00")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="width", value="1")
    ## from C to A
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="type", value="->")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="color", value="#ffff00")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="width", value="2")
}

test_getEdgesDataFrame_graphAM <- function() {
    require(graph)
    ## directed graph
    v <- c(0, 0, 1, 0, 0,
           4, 0, 0, 0, 0,
           0, 0, 0, 0, 0,
           0, 1, 0, 0, 0,
           0, 1, 0, 0, 0)
    a <- matrix(v, 5, 5)
    colnames(a) <- LETTERS[1:5]
    rownames(a) <- LETTERS[1:5]
    gam <- graphAM(adjMat=a, edgemode='directed', values=list(weight=1))
    adjMat <- RGraph2js:::getAdjMat(gam)
    edf <- getEdgesDataFrame(A=adjMat)
    checkSimpleLinks_directed(edf)
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="width", value="4")
    ## undirected graph
    v <- c(0, 4, 1, 0, 0,
           4, 0, 0, 1, 1,
           1, 0, 0, 0, 0,
           0, 1, 0, 0, 0,
           0, 1, 0, 0, 0)
    a <- matrix(v, 5, 5)
    colnames(a) <- LETTERS[1:5]
    rownames(a) <- LETTERS[1:5]
    gam <- graphAM(adjMat=a, edgemode='undirected', values=list(weight=1))
    adjMat <- RGraph2js:::getAdjMat(gam)
    edf <- getEdgesDataFrame(A=adjMat)
    checkSimpleLinks_undirected(edf)
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="width", value="4")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="width", value="4")
}

test_getEdgesDataFrame_graphBAM <- function() {
    require(graph)
    ## directed graph
    from <- c("A", "B", "B", "C")
    to <- c("B", "D", "E", "A")
    weight <- c(1,1,4,1)
    df <- data.frame(from, to, weight)
    gbam <- graphBAM(df, edgemode = "directed")
    adjMat <- RGraph2js:::getAdjMat(gbam)
    edf <- getEdgesDataFrame(A=adjMat)
    checkSimpleLinks_directed(edf)
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="width", value="4")
    ## undirected graph
    from <- c("A", "A", "B", "D")
    to <- c("B", "C", "E", "B")
    weight <- c(0.12,1,1,1)
    df <- data.frame(from, to, weight)
    gbam <- graphBAM(df, edgemode = "undirected")
    adjMat <- RGraph2js:::getAdjMat(gbam)
    edf <- getEdgesDataFrame(A=adjMat)
    checkSimpleLinks_undirected(edf)
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="width", value="0.12")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="width", value="0.12")
}

test_getEdgesDataFrame_graphNEL <- function() {
    require(graph)
    ## directed graph
    nodes <- c("A", "B", "C", "D", "E")
    edges <- list(
        A=list(edges=c("A", "B"), weights=c(2, 2)),
        B=list(edges=c("A", "E"), weights=c(1, 1)),
        C=list(edges=c("A", "D"), weights=c(4, 4)),
        D=list(edges=c("E"), weights=c(6)),
        E=list(edges=c("A", "B"), weights=c(1, 1))
    )
    gnel <- new("graphNEL", nodes=nodes, edgeL=edges, edgemode="directed")
    adjMat <- RGraph2js:::getAdjMat(gnel)
    edf <- getEdgesDataFrame(A=adjMat)
    checkAdvancedLinks_directed(edf)
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="A",
        attr="width", value="2")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="width", value="2")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="width", value="1")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="E",
        attr="width", value="1")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="width", value="4")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="D",
        attr="width", value="4")
    checkFromToAttributeEquals(
        edf=edf,
        from="D", to="E",
        attr="width", value="6")
    checkFromToAttributeEquals(
        edf=edf,
        from="E", to="A",
        attr="width", value="1")
    checkFromToAttributeEquals(
        edf=edf,
        from="E", to="A",
        attr="width", value="1")
    ## undirected graph
    nodes <- c("A", "B", "C", "D", "E")
    edges <- list(
        A=list(edges=c("A", "B", "C", "E"), weights=c(2, 2, 2, 2)),
        B=list(edges=c("A", "E"), weights=c(1, 1)),
        C=list(edges=c("A", "D"), weights=c(4, 4)),
        D=list(edges=c("E", "C"), weights=c(6, 6)),
        E=list(edges=c("A", "B", "D"), weights=c(1, 1, 1))
    )
    gnel <- new("graphNEL", nodes=nodes, edgeL=edges, edgemode="undirected")
    adjMat <- RGraph2js:::getAdjMat(gnel)
    edf <- getEdgesDataFrame(A=adjMat)
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="A",
        attr="width", value="2")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="C",
        attr="width", value="4")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="width", value="2")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="D",
        attr="width", value="6")
    checkFromToAttributeEquals(
        edf=edf,
        from="D", to="C",
        attr="width", value="4")
}

test_getEdgesDataFrame_clusterGraph <- function() {
    require(graph)
    c <- list(a=c("A","B","C"), b=c("D","E","F"))
    cg <- new("clusterGraph", clusters=c)
    adjMat <- RGraph2js:::getAdjMat(cg)
    edf <- getEdgesDataFrame(A=adjMat)
    colnames <- names(edf)
    checkEquals(length(edf), 7)
    checkTrue("from" %in% colnames)
    checkTrue("to" %in% colnames)
    checkTrue("type" %in% colnames)
    checkTrue("color" %in% colnames)
    checkTrue("width" %in% colnames)
    checkTrue("link" %in% colnames)
    checkTrue("tooltip" %in% colnames)
    ## check links
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="B",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="A", to="C",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="B", to="C",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="A",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="C", to="B",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="D", to="E",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="D", to="F",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="E", to="D",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="E", to="F",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="F", to="D",
        attr="type", value="--")
    checkFromToAttributeEquals(
        edf=edf,
        from="F", to="E",
        attr="type", value="--")
}
