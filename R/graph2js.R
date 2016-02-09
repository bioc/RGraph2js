#####################################################################
## This program is distributed in the hope that it will be useful, ##
## but WITHOUT ANY WARRANTY; without even the implied warranty of  ##
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the    ##
## GNU General Public License for more details.                    ##
#####################################################################

#' @import utils
.onAttach <- function(libname, pkgname) {
    desc <- packageDescription("RGraph2js")
    msg <- paste(
        desc$Package, ": ", desc$Title, "\n",
        "Version ", desc$Version,
        " created on ",
        desc$Date,".\n", sep=""
    )
    msg <- paste(
        msg, "Copyright (c) 2015 ",
        "Stephane Cano, Sylvain Gubian, Florian Martin, PMP S.A.\n",
        sep=""
    )
    msg <- paste(
        msg,
        "Licensed under the GNU GENERAL PUBLIC LICENSE Version 2 ",
        "<https://www.gnu.org/licenses/gpl-2.0.txt>.\n",
        sep=""
    )
    packageStartupMessage(msg)
}

#' Generate the JSON code using D3js that draws A network from Adjacency
#' matrix and edges, nodes properties.
#'
#' @param A signed weighted adjacency \code{matrix} or an instance of the class
#' \code{graphAM}, \code{graphBAM}, \code{graphNEL} or \code{clusterGraph}
#' from the graph package
#' @param innerValues A \code{matrix} of inner node values to display Barplot
#' or other component. In a row, numerical values for a node.
#' @param innerColors A \code{matrix} of colors for coloring the inner node
#' barplot or component . In a row, colors values for a node.
#' @param innerTexts A \code{matrix} of labels for each bar in inner barplots.
#' In a row, labels values for a node.
#' @param starplotValues A \code{matrix} of [0,1] values for starpot sectors
#' size
#' @param starplotColors A \code{matrix} of hex RGB colors for sectors colors
#' @param starplotLabels A \code{matrix} of labels identifying the sectors
#' @param starplotTooltips A \code{matrix} of text or even html content for
#' the sectors tooltips
#' @param starplotUrlLinks A \code{matrix} of text for the sectors url links
#' @param starplotSectorStartedRad A \code{matrix} with a single column of
#' [0,2PI] values for the sector start in radians
#' @param starplotCircleFillColor A \code{matrix} of hex RGB colors for the
#' circle background
#' @param starplotCircleFillOpacity A \code{matrix} of [0.0,1.0] values for
#' the background opacity
#' @param nodesGlobal A \code{list} of global nodes properties.
#' @param nodesProp A \code{data.frame} object containing properties for
#' specifics nodes width, shape (in 'rect', 'circle', 'lozenge', 'triangle'),
#' link, tooltip, highlight.X (X from 0 to N for animation) columns
#' @param edgesGlobal A \code{list} of global edges properties.
#' @param edgesProp A \code{data.frame} object containing properties for
#' specific edges from, to, width, type, link, color columns
#' @param outputDir String that corresponds to the path to a folder or
#' file where js code and dependencies will be generated. If \code{NULL} is
#' provided, javascript code is returned in the returned \code{list} by the
#' function with the slots:
#' \cr
#' 'jsIncludes' A character string containing JS code for including the
#' necessary JS files
#' \cr\cr
#' 'styling' A character string which contains the CSS code for the
#' GraphRenderer component
#' \cr\cr
#' 'js' A character string containing the JavaScript code for the rendering
#' of the data
#' \cr\cr
#' 'html' A character string containing the HTML code for the rendering of
#' the component
#' @param filename String the name of the result HTML file, a name will be
#' automatically generated if not provided and by default.
#' @param opts \code{list} of options of the GraphRenderer component
#' (See \code{getDefaultOptions} function available options)
#' @param userCssStyles String containing user css styles. (See starplot demo)
#' @param toolsPar \code{list} of options for tools attached to GraphRenderer
#' component. (See \code{getDefaultToolParameters} for details)
#' @param id \code{function}, Unique IDs generator, Internal function
#' getUUID by default.
#' @return A list containing information of the generated js code.
#' @include jstemplate.R
#' @include htmltemplate.R
#' @include utils.R
#' @include dataformating.R
#' @importFrom graph adjacencyMatrix
#' @export
#' @examples
#' v <- c(0, 0, 1, 1, 0,
#'        0, 0, 0, 0, 0,
#'       -1, 0, 0, 1, 0)
#' a <- matrix(v, 3, 5)
#' colnames(a) <- LETTERS[1:5]
#' rownames(a) <- LETTERS[1:3]
#' g <- graph2js(a)
graph2js <- function(
    A, innerValues=NULL,
    innerColors=NULL,
    innerTexts=NULL,
    starplotValues=NULL,
    starplotColors=NULL,
    starplotLabels=NULL,
    starplotTooltips=NULL,
    starplotUrlLinks=NULL,
    starplotSectorStartedRad=NULL,
    starplotCircleFillColor=NULL,
    starplotCircleFillOpacity=NULL,
    nodesGlobal=NULL,
    nodesProp=NULL,
    edgesGlobal=NULL,
    edgesProp=NULL,
    outputDir=NULL,
    filename=NULL,
    opts=list(),
    userCssStyles=NULL,
    toolsPar=list(),
    id=getUUID())
{
    ## Merge user params and default ones
    ## Merging general options with default values
    op <- getDefaultOptions()
    op[(nam.opts <- names(opts))] <- opts
    if (length(noNms <- nam.opts[!nam.opts %in% names(op)])) {
        warning('Unknown names in opts: ', paste(noNms, collapse=', '))
    }

    ## Merging tools options with default values
    toolsOp <- getDefaultToolParameters()
    toolsOp[(nam.toolsPar <- names(toolsPar))] <- toolsPar
    if (length(noNms <- nam.toolsPar[!nam.toolsPar %in% names(toolsOp)])) {
        warning('Unknown names in opts: ', paste(noNms, collapse=', '))
    }

    ## get the adjacency matrix from the A parameter
    A <- getAdjMat(A)
    
    ## Formating JSON code with g and parameters
    ndf <- getNodesDataFrame(A, nodesGlobal, nodesProp)
    edf <- getEdgesDataFrame(A, edgesGlobal, edgesProp)
    jsonCode <- graph2json(
        ndf, edf,
        innerValues, innerColors, innerTexts,
        starplotColors, starplotValues, starplotLabels, starplotTooltips,
        starplotUrlLinks, starplotSectorStartedRad, starplotCircleFillColor,
        starplotCircleFillOpacity
    )

    ## Getting Styling content
    styling <- getHTMLStyleCode(id)
    if(!is.null(userCssStyles)) {
        styling <- paste(styling, userCssStyles)
    }

    ## Getting JS includes
    jsIncludes <- getJSIncludes(toolsOp)

    ## Getting JS content
    js <- getJSCode(jsonCode, id, op, toolsOp)

    ## Getting HTML content
    html <- getHTMLContainerCode(id, toolsOp)


    ## Including resources in case of generation of a full local version:
    if (!is.null(outputDir)) {

        if (!file.exists(outputDir)) {
            dir.create(
                path.expand(outputDir),
                showWarnings=FALSE,
                recursive=TRUE
            )
        }
        packagePath <- path.package(package="RGraph2js")
        resourcesPath <- file.path(packagePath, "resources")
        graphrendererPath <- file.path(resourcesPath, 'graphRenderer.min.js')
        imagesZippedPath <- file.path(resourcesPath, 'images.zip')
        res <- file.copy(
            from=graphrendererPath,
            to=outputDir,
            overwrite=TRUE
        )
        res <- file.copy(
            from=imagesZippedPath,
            to=outputDir,
            overwrite=TRUE
        )
        res <- unzip(file.path(outputDir, 'images.zip'), exdir=outputDir)
        unlink(file.path(outputDir, 'images.zip'))
    }

    ## Writing overall content in a connection
    if (!is.null(outputDir)) {
        if (!is.null(filename)) {
            filepath <- file.path(outputDir, filename)
        } else {
            filepath <- file.path(outputDir, paste(id, '.html', sep=''))
        }
        f <- file(filepath, 'w')
        write(
            file=f,
            getMinimalHTML(
                toolsOp$title,
                styling,
                jsIncludes,
                js,
                html
            )
        )
        close(f)
        return(list(id=id, filepath=filepath))
    } else {
        return(list(
            jsIncludes=jsIncludes,
            styling=styling,
            js=js,
            html=html,
            shared.html=getSharedHtml()))
    }
}

