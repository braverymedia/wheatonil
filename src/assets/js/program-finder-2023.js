import ProgramFinderFullScreen from "./ProgramFinderFullScreen.svelte";
import ProgramFinderOverlay from "./ProgramFinderOverlay.svelte";
import { isShowableProgram } from "./program-finder-utils";
window.addEventListener("DOMContentLoaded", (event) => {
  /* here's where we get the data elements written to the DOM by the T4 nav system */
  const data_elements = document.getElementsByClassName("program-data-2023");
  /* this prepares the array of Programs passed into the ProgramFinder component.  It's set up to expect a | as a delimiter, and expects data-name, data-credential-types, data-degree-types and data-areas-of-study as attributes on the .program-data-2023 divs */
  const programs = Array.prototype.map
    .call(data_elements, (element) => {
      return {
        name: element.dataset.name || "Unnamed",
        credential_types: (element.dataset.credentialTypes || "")
          .split("|")
          .map((e) => e.trim())
          .filter((e) => !!e),
        credential_type_values: (element.dataset.credentialTypeValues || "")
          .split("|")
          .map((e) => e.trim())
          .filter((e) => !!e),
        degree_types: (element.dataset.degreeTypes || "")
          .split("|")
          .map((e) => e.trim())
          .filter((e) => !!e),
        areas_of_study: (element.dataset.areasOfStudy || "")
          .split("|")
          .map((e) => e.trim())
          .filter((e) => !!e),
        link: element.dataset.link || "",
        concentrations: element.dataset.concentrations || "",
      };
    })
    .filter(isShowableProgram);
  const fullscreen_mountpoint = document.getElementById(
    "program-finder-mountpoint"
  );
  if (fullscreen_mountpoint) {
    const pf = new ProgramFinderFullScreen({
      /* this is the mountpoint element where the svelte component gets attached */
      target: fullscreen_mountpoint,
      props: {
        title: "Find your program",
        programs: programs,
      },
    });
  }
  // attach "open on click" handler
  let pf_overlay = null;
  const slidein_mountpoint = document.createElement("div");
  document.body.appendChild(slidein_mountpoint);
  document.addEventListener(
    "click",
    function (event) {
      if (!event) return;
      if (
        event.target.dataset.widget &&
        event.target.dataset.widget == "program-finder"
      ) {
        event.preventDefault();
        if (pf_overlay) {
          pf_overlay.$set({ isOpen: true });
          return;
        }

        pf_overlay = new ProgramFinderOverlay({
          /* this is the mountpoint element where the svelte component gets attached */
          target: slidein_mountpoint,
          props: {
            title: "Find your program",
            programs: programs,
            fullScreenPath: "/academics/programs/",
          },
        });
      }
    },
    false
  );
});
