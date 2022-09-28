//copyright year code
const getCurrentYearOverlay = () => {
    return new Date().getFullYear()
}
var year_ref = document.getElementById("copyright-year-overlay");
year_ref.innerHTML = getCurrentYearOverlay();

var search_panel = document.getElementsByClassName("hide-search-suggestion-panel");
var search_panel_div = search_panel[0];

var overlay_content_wrapper = document.getElementsByClassName("overlay-content-wrapper");
var overlay_content_wrapper_div = overlay_content_wrapper[0];

//listener for click-away from search bar
window.onclick = () => {
    if (search_panel_div.classList.contains("show-search-suggestion-panel")) {
        search_panel_div.classList.remove("show-search-suggestion-panel");
        search_panel_div.classList.add("hide-search-suggestion-panel")

        overlay_content_wrapper_div.classList.remove("hide-overlay-content-wrapper")
        overlay_content_wrapper_div.classList.add("overlay-content-wrapper")

    }
}

const showSearchSuggestion = (event) => {
    if (search_panel_div.classList.contains("hide-search-suggestion-panel")) {
        search_panel_div.classList.remove("hide-search-suggestion-panel");
        search_panel_div.classList.add("show-search-suggestion-panel");

        overlay_content_wrapper_div.classList.remove("overlay-content-wrapper")
        overlay_content_wrapper_div.classList.add("hide-overlay-content-wrapper")
        
    } 
    event.stopPropagation()
};



