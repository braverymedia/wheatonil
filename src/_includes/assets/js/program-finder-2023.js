import ProgramFinderFullScreen from "./ProgramFinderFullScreen.svelte";

window.addEventListener("DOMContentLoaded", (event) => {
  /* here's where we get the data elements written to the DOM by the T4 nav system */
  const data_elements = document.getElementsByClassName("program-data-2023");
  const pf = new ProgramFinderFullScreen({
    /* this is the mountpoint element where the svelte component gets attached */
    target: document.getElementById("program-finder-mountpoint"),
    props: {
      title: "Find your program",
      /* this prepares the array of Programs passed into the ProgramFinder component.  It's set up to expect a | as a delimiter, and expects data-name, data-credential-types, data-degree-types and data-areas-of-study as attributes on the .program-data-2023 divs */
      programs: Array.prototype.map.call(data_elements, (element) => {
        return {
          name: element.dataset.name || "Unnamed",
          credential_types: (element.dataset.credentialTypes || "")
            .split("|")
            .map((e) => e.trim()),
          credential_type_values: (element.dataset.credentialTypeValues || "")
            .split("|")
            .map((e) => e.trim()),
          degree_types: (element.dataset.degreeTypes || "")
            .split("|")
            .map((e) => e.trim()),
          areas_of_study: (element.dataset.areasOfStudy || "")
            .split("|")
            .map((e) => e.trim()),
          link: element.dataset.link || "",
        };
      }),
    },
  });
});
