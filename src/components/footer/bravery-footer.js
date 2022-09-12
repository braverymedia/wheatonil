const getCurrentYear = () => {
    return new Date().getFullYear()
}

var year_ref = document.getElementById("copyright-year");

year_ref.innerHTML = getCurrentYear();