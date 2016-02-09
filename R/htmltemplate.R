#####################################################################
## This program is distributed in the hope that it will be useful, ##
## but WITHOUT ANY WARRANTY; without even the implied warranty of  ##
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the    ##
## GNU General Public License for more details.                    ##
#####################################################################

#' Function wich generates a list containing parameters for Tools in
#' the D3js component with default values
#'
#' @return \code{list} of parameters with default values
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
getDefaultToolParameters <- function() {
    toolParam <- list(
        jquery.css=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/',
            '1.10.3/css/base/minified/jquery-ui.min.css'),
        jquery.url=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/jquery/',
            '1.11.0/jquery.min.js'),
        jquery.ui.url=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/',
            '1.10.3/jquery-ui.min.js'),
        d3js.url=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/d3/',
            '3.5.6/d3.min.js'),
        graphrenderer.url='graphRenderer.min.js',
        raphaeljs.url=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/raphael',
            '/2.1.4/raphael-min.js'),
        qtip.url=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/qtip2/',
            '2.2.0/basic/jquery.qtip.min.js'),
        qtip.css=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/qtip2/',
            '2.2.0/basic/jquery.qtip.min.css'),
        qtip.imagesloaded.url=paste0(
            'http://cdnjs.cloudflare.com/ajax/libs/qtip2/',
            '2.2.0/basic/imagesloaded.pkg.min.js'),
        imagesurl='images/',
        pageTitle='D3js Network')
    return(toolParam)
}

#' Generate a HTML table node code for component based on template
#'
#' @param id String for component identification
#' @param toolParam \code{list} containing options for tools options
#' of the GraphRender component
#' @return String which is the HTML code generated
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
#' @importFrom whisker whisker.render
getHTMLContainerCode <- function(id, toolParam) {
    tmplValues <- c(list(id=id), toolParam)
    return(whisker::whisker.render(getHTMLDivTemplate(), tmplValues))
}

#' Generate a HTML style code for component based on template
#'
#' @param id String for component identification
#' @return String which is the HTML style code generated
#' @author Sylvain Gubian \email{DL.RSupport@@pmi.com}
#' @importFrom whisker whisker.render
getHTMLStyleCode <- function(id) {
    tmplValues <- list(id=id)
    return(whisker::whisker.render(getStyleTemplate(), tmplValues))
}

getSharedHtml <- function() {
    return(
        paste0(
            '<div id="FontSizeGetter"',
            ' style="position:absolute;visibility hidden;',
            'height auto;width auto;font-size 10px;">',
            '</div>'
        )
    )
}

getHTMLDivTemplate <- function() {
    return('
<div id={{id}}>
  <table class="main">
    <tr>
      <td>
        <table class="network">
          <tr>
            <td>
              <div id="network_{{id}}" style="cursor:auto;">
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="ui-widget-header ui-corner-all">
                <table width="100%">
                  <tr>
                    <td>
                      <table>
                        <tr>
                          <td>
                            <div id="spinner_{{id}}"
                                 style="opacity: 1e-6;">
                              <img src="{{imagesurl}}spinner.gif" />
                            </div>
                          </td>
                          <td>
                            <span id="searchButton_{{id}}"
                                  class="ui-icon ui-icon-search">
                            </span>
                          </td>
                          <td>
                            <input id="search_{{id}}"
                                   type="text"
                                   value=""
                                   class="search" />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right">
                      <table>
                        <tr>
                          <td>
                            <img src="{{imagesurl}}about.png"
                                 id="dialog_about_opener_{{id}}"
                                 name="dialog_about_opener" />
                          </td>
                          <td width="10px">
                          </td>
                          <td>
                            <img src="{{imagesurl}}reload.png"
                                 id="reload_{{id}}"
                                 name="reload" />
                          </td>
                        </td>
                        <td width="10px">
                        </td>
                        <td>
                          <img src="images/settings.png"
                               id="settings_{{id}}"
                               name="settings"
                               class="button_off" />
                        </td>
                        <td width="10px">
                        </td>
                        <td>
                          <img src="{{imagesurl}}export.png"
                               id="export_{{id}}"
                               name="export" />
                        </td>
                        <td width="10px">
                        </td>
                        <td>
                          <img src="{{imagesurl}}zoomin.png"
                               id="zoomin_{{id}}"
                               name="zoomin" />
                        </td>
                        <td>
                          <img src="{{imagesurl}}zoomout.png"
                               id="zoomout_{{id}}"
                               name="zoomout" />
                        </td>
                        <td>
                          <img src="{{imagesurl}}leading_nodes.png"
                               id="highlightLNs_{{id}}"
                               name="highlightLNs"
                               class="button_off" />
                        </td>
                        <td>
                          <img src="{{imagesurl}}drag.png"
                               id="dragMode_{{id}}"
                               name="dragMode"
                               class="button_off" />
                        </td>
                        <td>
                          <img src="{{imagesurl}}neighbors.png"
                               id="neighbors_{{id}}"
                               name="neighbors"
                               class="button_off" />
                        </td>
                        <td>
                          <img src="{{imagesurl}}tooltip.png"
                               id="tooltips_{{id}}"
                               name="tooltips"
                               class="button_off" />
                        </td>
                        <td>
                          <img src="{{imagesurl}}fullscreen.png"
                               id="magnify_{{id}}"
                               name="magnify"
                               class="button_off" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" align="center">
                    <div id="scale_{{id}}">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div id="layoutParameters_{{id}}">
                      <label id="charge_{{id}}"
                             for="layoutChargeRange_{{id}}">Charge
                      </label>
                      <div id="layoutChargeRange_{{id}}"
                           name="layoutChargeRange">
                      </div>
                      <br>
                        <label id="linkDistance_{{id}}"
                               for="layoutLinkDistance_{{id}}">
                          Link distance
                        </label>
                        <div id="layoutLinkDistance_{{id}}"
                             name="layoutLinkDistance">
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" align="center">
                      <div id="sliderbar_{{id}}">
                        <table>
                          <tr>
                            <td>
                              <div id="seek_previous_{{id}}">
                              </div>
                            </td>
                            <td>
                              <div id="slider_{{id}}">
                              </div>
                            </td>
                            <td>
                              <div id="seek_next_{{id}}">
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div id="currentContrast_{{id}}">
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div id="progressbar_{{id}}">
          <div id="progressbar-label_{{id}}">Loading...</div>
        </div>
        <div id="message_{{id}}" class="message">
        </div>
      </td>
    </tr>
  </table>
</div>
')
}


getStyleTemplate <- function(){
    return('
<style>

.ui-tooltip {
    color: #fff;
    position: absolute;
    z-index: 9999;
    text-align: center;
    height: 12px;
    padding: 8px;
    font: 12px sans-serif;
    background: #000;
    border: solid 4px #000;
    border-radius: 8px;
    pointer-events: none;
    -webkit-box-shadow: 0 0 5px #000;
    box-shadow: 0 0 5px #000;
}

div.tooltip_bar {
    color: #fff;
    position: absolute;
    z-index: 9999;
    text-align: center;
    height: 12px;
    padding: 8px;
    font: 12px sans-serif;
    background: #000;
    border: solid 4px #000;
    border-radius: 8px;
    pointer-events: none;
    -webkit-box-shadow: 0 0 5px #000;
    box-shadow: 0 0 5px #000;
}

div.tooltip_node {
    color: #fff;
    position: absolute;
    z-index: 9999;
    text-align: center;
    height: 12px;
    padding: 8px;
    font: 12px sans-serif;
    background: #000;
    border: solid 4px #000;
    border-radius: 8px;
    pointer-events: none;
    -webkit-box-shadow: 0 0 5px #aaa;
    box-shadow: 0 0 5px #aaa;
}

div.message {
    color: #f57900;
    padding: 4px;
    font: 10px sans-serif;
    background: #252a2b;
    border: solid 2px #ffffff;
    border-radius: 2px;
    pointer-events: none;
}

table.main {
    font: 10px sans-serif;
    border-collapse:collapse;
    background: #aaaaaa;
    //border: solid 1px #000000;
}

table.network {
    border-collapse:collapse;
    //border: 1px solid #000000;
    background: #ffffff;
}

div.sidepane {
    border: 2px solid #000000;
    background: #efefef;
    width: 100px;
}

.barplottext {
    font: 0.8px sans-serif;
}

#slider_{{id}} {
    width: 800px;
    margin: 15px;
}

.search {
    border: none;
    border-radius:5px;
}

.button_on {
    border: 1px solid #ff0000;
    cursor: pointer;
}

.button_off {
    border: 1px solid #ffffff;
    cursor: pointer;
}

.ui-progressbar {
    position: relative;
    background: #ffffff;
    color: #000000;
}

.ui-button .ui-button-text {
    padding: 1.0em !important;
}

#progressbar-label_{{id}} {
    position: absolute;
    left: 50%;
    top: 4px;
    font-weight: bold;
    text-shadow: 1px 1px 0 #fff;
}

.ui-menu {
    width: 200px;
}

</style>
')
}

#' @importFrom whisker whisker.render
getMinimalHTML <- function(
    pageTitle, styleContent, jsIncludes,
    jsContent, pageContent,
    sharedHtml=getSharedHtml())
{
    tmplValues  <- list(
        page_title=pageTitle,
        js_includes=jsIncludes,
        style_content=styleContent,
        js_content=jsContent,
        page_content=pageContent,
        shared_html=sharedHtml
    )
    minimalHtml <- '
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>{{{page_title}}}</title>
    {{{style_content}}}
    {{{js_includes}}}
    {{{js_content}}}
    </head>
    <body style="background-color:#444444;">
    <center>
    {{{page_content}}}
    </center>
    {{{shared_html}}}
    </body>
    </html>
    '

    return(whisker::whisker.render(minimalHtml, tmplValues))
}

