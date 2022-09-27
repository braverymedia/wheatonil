const showOverlay = () => {
    // const mobileMenu = document.getElementById("menu-overlay-content-wrapper");
    const overlay = document.getElementById("menu-overlay-content-wrapper")
    overlay.style.height = "100%";
}

const closeOverlay = () => {
    const overlay = document.getElementById("menu-overlay-content-wrapper")
    overlay.style.height = "0%";
}