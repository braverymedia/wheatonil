//copyright year code
const getCurrentYear = () => {
    return new Date().getFullYear()
}
var year_ref = document.getElementById("copyright-year");

year_ref.innerHTML = getCurrentYear();

if (window.innerWidth < 1024) {
    //accordion functionality
    var accordion = document.getElementsByClassName("accordion-trigger");
    var accordionContent = document.getElementsByClassName("accordion-content");
    for (let i = 0; i < accordion.length; i++) {
        accordion[i].addEventListener("click", function () {
            this.classList.toggle("active");

            let currentAccordion = accordionContent[i];

            if (currentAccordion.style.display === "block") {
                currentAccordion.style.display = "none";
            } else {
                currentAccordion.style.display = "block";
            }
        });
    }
}
