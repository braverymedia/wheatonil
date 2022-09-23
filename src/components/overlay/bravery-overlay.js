//copyright year code
const getCurrentYearOverlay = () => {
    return new Date().getFullYear()
}
var year_ref = document.getElementById("copyright-year-overlay");

year_ref.innerHTML = getCurrentYearOverlay();

const showSearchSuggestion = () => {
    //TODO - add closeShowSuggestion() logic when user clicks away/out of the input
    //TODO add nav element around .overlay-content-main
    var search_panel = document.getElementById("search-suggestion-panel");
    console.log(search_panel.style)

    if (search_panel.style.display === "none") {
        search_panel.style.display = "flex";
        search_panel.style.flexDirection = "column"
        console.log("make flex direction column")
    } else {
        search_panel.style.display = "flex";
    }
}

