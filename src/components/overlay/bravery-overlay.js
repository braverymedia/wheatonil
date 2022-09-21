//copyright year code
const getCurrentYearOverlay = () => {
    return new Date().getFullYear()
}
var year_ref = document.getElementById("copyright-year-overlay");

year_ref.innerHTML = getCurrentYearOverlay();