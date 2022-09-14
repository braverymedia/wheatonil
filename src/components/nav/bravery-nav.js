const showMobileMenu = () => {
    const mobileMenu = document.getElementById("mobile-menu-content-wrapper");
    console.log(mobileMenu.style)
    mobileMenu.style.display === "none" ? mobileMenu.style.display = "flex" : mobileMenu.style.display = "none"

}