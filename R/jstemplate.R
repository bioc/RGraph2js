#####################################################################
## This program is distributed in the hope that it will be useful, ##
## but WITHOUT ANY WARRANTY; without even the implied warranty of  ##
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the    ##
## GNU General Public License for more details.                    ##
#####################################################################

#' Generate a list containing parameters for the D3js component's
#' options with default values
#'
#' @section Description of the available options:
#' w : width of the component in pixels \cr
#' h : height of the component in pixels \cr
#' \cr
#' minZoomFactor : float [0,n], 1 means 100\% \cr
#' maxZoomFactor : float [0,n], 1 means 100\% \cr
#' \cr
#' layout_forceLinkDistance : float \cr
#' If distance is specified, sets the target distance between linked nodes to
#' the specified value. If distance is not specified, returns the layout's
#' current link distance, which defaults to 20. Typically, the distance is
#' specified in pixels; however, the units are arbitrary relative to the
#' layout's size.
#' \cr\cr
#' layout_forceCharge : float \cr
#' If charge is specified, sets the charge strength to the specified value.
#' If charge is not specified, returns the current charge strength, which
#' defaults to -900. A negative value results in node repulsion, while a
#' positive value results in node attraction.
#' For graph layout, negative values should be used; for n-body simulation,
#' positive values can be used.
#' All nodes are assumed to be infinitesimal points with equal charge and mass.
#' Charge forces are implemented efficiently via the Barnes-Hut algorithm,
#' computing a quadtree for each tick.
#' Setting the charge force to zero disables computation of the quadtree, which
#' can noticeably improve performance if you do not need n-body forces.
#' \cr\cr
#' layout_linkStrength : float [0,1] \cr
#' If strength is specified, sets the strength (rigidity) of links to the
#' specified value in the range [0,1].
#' If strength is not specified, returns the layout's current link strength,
#' which defaults to 1.
#' \cr\cr
#' layout_friction : float \cr
#' If friction is specified, sets the friction coefficient to the specified
#' value. If friction is not specified, returns the current coefficient,
#' which defaults to 0.9.
#' The name of this parameter is perhaps misleading; it does not correspond to
#' a standard physical coefficient of friction. Instead, it more closely
#' approximates velocity decay: at each tick of the simulation,
#' the particle velocity is scaled by the specified friction.
#' Thus, a value of 1 corresponds to a frictionless environment,
#' while a value of 0 freezes all particles in place.
#' Values outside the range [0,1] are not recommended and may have
#' destabilizing effects.
#' \cr\cr
#' layout_chargeDistance : float \cr
#' If distance is specified, sets the maximum distance over which charge forces
#' are applied.
#' If distance is not specified, returns the current maximum charge distance,
#' which defaults to infinity.
#' Specifying a finite charge distance improves the performance of the force
#' layout and produces a more localized layout; distance-limited charge forces
#' are especially useful in conjunction with custom gravity.
#' \cr\cr
#' layout_theta : float \cr
#' If theta is specified, sets the Barnes-Hut approximation criterion to the
#' specified value. If theta is not specified, returns the current value, which
#' defaults to 0.8. Unlike links, which only affect two linked nodes,
#' the charge force is global: every node affects every other node, even if
#' they are on disconnected subgraphs.
#' To avoid quadratic performance slowdown for large graphs, the force layout
#' uses the Barnes-Hut approximation which takes O(n log n) per tick.
#' For each tick, a quadtree is created to store the current node positions;
#' then for each node, the sum charge force of all other nodes on the given
#' node are computed. For clusters of nodes that are far away, the charge force
#' is approximated by treating the distance cluster of nodes as a single,
#' larger node. Theta determines the accuracy of the computation: if the ratio
#' of the area of a quadrant in the quadtree to the distance between a node to
#' the quadrant's center of mass is less than theta, all nodes in the given
#' quadrant are treated as a single, larger node rather than computed
#' individually.
#' \cr\cr
#' layout_gravity : float \cr
#' If gravity is specified, sets the gravitational strength to the specified
#' value. If gravity is not specified, returns the current gravitational
#' strength, which defaults to 0.1. The name of this parameter is perhaps
#' misleading; it does not correspond to physical gravity (which can be
#' simulated using a positive charge parameter).
#' Instead, gravity is implemented as a weak geometric constraint similar to a
#' virtual spring connecting each node to the center of the layout's size.
#' This approach has nice properties: near the center of the layout,
#' the gravitational strength is almost zero, avoiding any local distortion of
#' the layout; as nodes get pushed farther away from the center, the
#' gravitational strength becomes strong in linear proportion to the distance.
#' Thus, gravity will always overcome repulsive charge forces at some
#' threshold, preventing disconnected nodes from escaping the layout.
#' Gravity can be disabled by setting the gravitational strength to zero.
#' If you disable gravity, it is recommended that you implement some other
#' geometric constraint to prevent nodes from escaping the layout, such as
#' constraining them within the layout's bounds.
#' \cr\cr
#' maxLayoutIterations : the max allowed number to perform \cr
#' \cr
#' displayNetworkEveryNLayoutIterations : 1 means always, 0 to display only on
#' layout completion \cr
#' \cr
#' optimizeDisplayWhenLayoutRunning : boolean, TRUE to simplify the display
#' when the layout engine is running \cr
#' FALSE otherwise. \cr
#' \cr
#' nodeSize : size of the node in pixels \cr\cr
#' nodeRoundedCornerPixels : apply rounded corners on rectangle like shapes
#' \cr\cr
#' displayNodeLabels : boolean, display node names besides them \cr\cr
#' nodeBorderColor : RGB hex color \cr\cr
#' leadingNodeBorderColor : RGB hex color \cr\cr
#' noneLeadingNodeOpacity : float [0,1], 1 means fully opaque \cr\cr
#' nodeLabelsColor : RGB hex color, example "#444444" \cr\cr
#' nodeLabelsFont : example "6px sans-serif" \cr\cr
#' dragNodeBorderColor : the node border color to apply on dragging \cr
#' \cr
#' selectNodeBorderColor : the node border color to apply on left-click,
#' "#ff0000" \cr
#' \cr
#' displayBarPlotsInsideNodes : boolean, display barplots inside nodes \cr
#' \cr
#' barplotInNodeTooltips : boolean, display barplots inside node's tooltips \cr
#' \cr
#' barplotInsideNodeBorderColor : the barplot borders color, example '#000000'
#' \cr
#' barplotInsideNodeBorderWidth : the barplot borders width in pixels, example
#' '2px' \cr
#' \cr
#' nodeTooltipOpacity : float [0,1], 1 means fully opaque (for link tooltips as
#' well) \cr\cr
#' displayBarplotTooltips : boolean, (dis/en)able tooltips for each barplot's
#' bar \cr\cr
#' nodeTooltipActivationDelay : milliseconds (for link tooltips as well) \cr\cr
#' nodeTooltipDeactivationDelay : milliseconds (for link tooltips as well)
#' \cr\cr
#' barplotInNodeTooltipsFontSize : pixels \cr
#' \cr
#' enableNodeDragging : boolean, allow/deny node dragging \cr
#' \cr
#' jsFunctionToCallOnNodeClick : name of the javascript function to call
#' on node click
#' \cr
#' example:
#' \cr
#' To call the following function \cr
#' var myfunction = function(nodeObj) { alert(nodeObj.name); }; \cr
#' you should set jsFunctionToCallOnNodeClick='myfunction' \cr
#' \cr
#' displayColorScale : show a color scale in the toolbar \cr
#' \cr
#' scaleGradient : define the linear color gradient \cr
#' Linear gradient format is "<angle>-<colour>[-<colour>[:<offset>]]*-<colour>"
#' \cr
#' examples: "90-#fff-#000" => 90 degree gradient from white to black \cr
#' "0-#fff-#f00:20-#000" -> 0 degree gradient from white via red (at 20\%)
#' to black. \cr
#' \cr
#' scaleLabelsFontFamily : example "monospace" \cr\cr
#' scaleLabelsFontSize : in pixels \cr\cr
#' scaleHeight : in pixels \cr\cr
#' scaleTickSize : in pixels \cr\cr
#' scaleTicksPercents : to draw a tick every 20\%: "[20,40,60,80,100]" \cr\cr
#' exportCGI : boolean, enable a CGI convertion in the export function,
#'             permit only the SVG export otherwise \cr\cr
#'
#' @return \code{list} of parameters with default values
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
#' opts <- getDefaultOptions()
#' opts$nodeLabelsFont <- '16px sans-serif'
#'
#' g <- graph2js(A=a, opts=opts)
getDefaultOptions <- function() {
    defaultOpts <- list(
        w=860,
        h=540,
        nodeSize=50,
        nodeRoundedCornerPixels=10,
        layout_forceLinkDistance=160,
        layout_forceCharge=-900,
        layout_linkStrength=1,
        layout_friction=0.9,
        layout_chargeDistance=NULL,
        layout_theta=0.8,
        layout_gravity=0.1,
        maxLayoutIterations=300,
        displayNetworkEveryNLayoutIterations=20,
        optimizeDisplayWhenLayoutRunning=FALSE,
        displayNodeLabels=TRUE,
        nodeBorderColor='#777777',
        leadingNodeBorderColor='#000000',
        noneLeadingNodeOpacity=0.5,
        nodeLabelsColor='#444444',
        nodeLabelsFont='12px sans-serif',
        dragNodeBorderColor='#ff8400',
        selectNodeBorderColor="#ff0000",
        minZoomFactor=0.1,
        maxZoomFactor=10,
        barplotInNodeTooltips=FALSE,
        barplotInsideNodeBorderColor="#000000",
        barplotInsideNodeBorderWidth="1px",
        displayBarPlotsInsideNodes=TRUE,
        nodeTooltipOpacity=0.8,
        displayBarplotTooltips=TRUE,
        nodeTooltipActivationDelay=0,
        nodeTooltipDeactivationDelay=0,
        barplotInNodeTooltipsFontSize='8px',
        enableNodeDragging=TRUE,
        jsFunctionToCallOnNodeClick=NULL,
        displayColorScale=FALSE,
        scaleGradient=paste0(
            "0-#000080:",
            "12-#0000ff:",
            "25-#ffffff:",
            "60-#ffa500:",
            "75-#cd0000:100"
        ),
        scaleLabelsFontFamily='monospace',
        scaleLabelsFontSize=10,
        scaleHeight=25,
        scaleTickSize=4,
        scaleTicksPercents="[20,40,60,80,100]",
        exportCGI=FALSE
    )
    return(defaultOpts)
}

#' Generate javascript code based on general options
#' and network data
#'
#' @param dataJson \code{list} containing network data for nodes and links
#' @param id String for component identification
#' @param opts \code{list} containing general options for GraphRender component
#' @param toolParam \code{list} containing urls to jquery, jquery-ui, d3js,
#' GraphRender JS library, options for the GraphRender tool
#' @return String corresponding to JS code
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
#' @importFrom whisker whisker.render
getJSCode <- function(dataJson, id, opts, toolParam) {
    ## dat has to be converted in a JSON format
    optionsCode <- generateOptionsJSCode(opts)
    tmplValues <- list(
        data_json=dataJson,
        id=id,
        options_content=optionsCode
    )
    jsCode <- whisker::whisker.render(getJSTemplate(), tmplValues)
    return(jsCode)
}

#' @importFrom whisker whisker.render
getJSIncludes <- function(toolParam) {
    tmplValues <- list(
        jquery_url=toolParam$jquery.url,
        jquery_css=toolParam$jquery.css,
        jqueryui_url=toolParam$jquery.ui.url,
        qtip_url=toolParam$qtip.url,
        qtip_css=toolParam$qtip.css,
        qtip_imagesloaded_url=toolParam$qtip.imagesloaded.url,
        d3js_url=toolParam$d3js.url,
        raphaeljs_url=toolParam$raphaeljs.url,
        graphrenderer_url=toolParam$graphrenderer.url
    )
    return(whisker::whisker.render(getJSIncludesTemplate(), tmplValues))
}

#' Generate javascript code based on general options, options
#' for containers and network data
#'
#' @param opts \code{list} containing general options for GraphRender
#' component
#' @return String containing JS code for component options
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
generateOptionsJSCode <- function(opts) {
    sb <- NULL
    for(nam in names(opts)) {
        if (is.character(opts[[nam]])) {
            ## if it starts with [ and ends with ],
            ## consider it as a js array and output it as is
            if(length(grep(pattern="^\\[.*]$", opts[[nam]])) > 0) {
                sb <- c(sb, paste(nam, ' : ', opts[[nam]], sep=''))
            } else {
                sb <- c(sb, paste(nam, ' : "', opts[[nam]], '"', sep=''))
            }
        } else if (is.logical(opts[[nam]])) {
            if (!opts[[nam]]) {
                sb <- c(sb, paste(nam, ' : false', sep=''))
            } else {
                sb <- c(sb, paste(nam, ' : true', sep=''))
            }
        } else if (is.null(opts[[nam]])) {
            sb <- c(sb, paste(nam, ' : undefined', sep=''))
        } else {
            sb <- c(sb, paste(nam, ' : ', opts[[nam]], sep=''))
        }
    }
    return(paste(sb, collapse=', '))
}

getJSIncludesTemplate <- function() {
    return('
        <link rel="stylesheet" href="{{jquery_css}}" />
        <link rel="stylesheet" href="{{qtip_css}}" />
        <script type="text/javascript" src="{{jquery_url}}"></script>
        <script type="text/javascript" src="{{jqueryui_url}}"></script>
        <script type="text/javascript" src="{{qtip_url}}"></script>
        <script type="text/javascript" src="{{qtip_imagesloaded_url}}"></script>
        <script type="text/javascript" src="{{d3js_url}}"></script>
        <script type="text/javascript" src="{{raphaeljs_url}}"></script>
        <script src="{{graphrenderer_url}}" type="text/javascript"></script>
    ')
}

getJSTemplate <- function() {
    return('
<script type="text/javascript">
$(document).ready(function() {
    // Prepare settings
    var data_{{id}} = {
        "jsonVar" : {{{data_json}}}
    };
    var containers_{{id}} = {
        networkDivId : "network_{{id}}",
        dialogAboutButtonId : "dialog_about_opener_{{id}}",
        messageDivId : "message_{{id}}",
        progressbarDivId : "progressbar_{{id}}",
        progressbarLabelDivId : "progressbar-label_{{id}}",
        spinnerDivId : "spinner_{{id}}",
        searchInputId : "search_{{id}}",
        highlightLNsInputId : "highlightLNs_{{id}}",
        dragModeButtonId : "dragMode_{{id}}",
        neighborsButtonId : "neighbors_{{id}}",
        tooltipsButtonId : "tooltips_{{id}}",
        magnifyButtonId : "magnify_{{id}}",
        contrastSliderBarDivId : "sliderbar_{{id}}",
        contrastSliderDivId : "slider_{{id}}",
        contrastSeekerPrevious : "seek_previous_{{id}}",
        contrastSeekerNext : "seek_next_{{id}}",
        currentContrastDivId : "currentContrast_{{id}}",
        scaleDivId : "scale_{{id}}",  // will not be used if undefined
        currentNodeInfoDivId : "sidepane_currentnode_{{id}}",  // NOT USED YET
        exportButtonId : "export_{{id}}",
        zoominButtonId : "zoomin_{{id}}",
        zoomoutButtonId : "zoomout_{{id}}",
        reloadButtonId: "reload_{{id}}",
        layoutChargeRangeId: "layoutChargeRange_{{id}}",
        labelLayoutCharge: "charge_{{id}}",
        layoutLinkDistanceRangeId: "layoutLinkDistance_{{id}}",
        labelLayoutLinkDistance: "linkDistance_{{id}}",
        layoutParametersPane: "layoutParameters_{{id}}",
        settingsButtonId: "settings_{{id}}"
    };

    aOpts_{{id}} = {
    {{{options_content}}}
    };
    var gr_{{id}} = new GraphRenderer(
        data_{{id}},
        aOpts_{{id}},
        containers_{{id}}
    );
    gr_{{id}}.draw();
});
</script>
')
}

