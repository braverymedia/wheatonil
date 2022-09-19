const showOverlay = () => {
    // const mobileMenu = document.getElementById("menu-overlay-content-wrapper");
    const overlay = document.getElementById("menu-overlay-content-wrapper")
    console.log("clicked", overlay)
    overlay.style.height = "100%";
}

const closeOverlay = () => {
    console.log("clicked x")
    const overlay = document.getElementById("menu-overlay-content-wrapper")
    overlay.style.height = "0%";
}