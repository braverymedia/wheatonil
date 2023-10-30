<script>
  import { writable } from "svelte/store";
  import {
    locationMatchesSelectedItems,
    processUrlSearchParams,
    setSearchParamsOnURL,
  } from "./program-finder-utils";
  export let title = "Finder";
  export let inOverlay = false;
  /* these constant initializers can be changed to [] to reduce bundle size since we're going to pull from the programs we're passed from the markup instead of using these hard coded ones */
  let credential_types = [
    "Bachelor",
    "Minor",
    "Certificate",
    "Master",
    "Doctoral",
  ];
  let degree_types = [
    "BA",
    "BM",
    "BS",
    "DMin",
    "MA",
    "Multiple",
    "PhD",
    "PsyD",
    "Special Program",
    "Study Abroad",
  ];
  let areas_of_study = [
    "Art, Communication, Design, and Music",
    "Business, Economics, and Marketing",
    "Education and Teaching",
    "Government, Politics, and International Relations",
    "Health",
    "Humanities",
    "Languages and Cultures",
    "Military",
    "Ministry, Mission, Spiritual Formation, and Leadership",
    "Psychology and Counseling",
    "Science, Technology, Engineering, and Mathematics",
    "Social Science",
    "Theology and Biblical Studies",
    "Pre-College Programs",
  ];

  export let programs = [];
  export let selected_areas_of_study = [];
  export let selected_credential_types = [];
  let pass = 0;
  if (programs && programs.length) {
    /* pull credential_types, areas_of_study and degree_types from the data passed into this component */
    /* for credential_types, we get two bits of data in each program: credential_types and credential_type_values. 
      the first looks like Doctorate|Minor and the latter looks like doctorate-5|minor-2
      the first are the labels we should show.  the numbers in the latter dictate position
      in case we don't have good numbers in the second, we'll load the former into credential_types, then overwrite if we have good numbers
    */
    credential_types = Object.keys(
      programs.reduce((acc, p) => {
        if (p.credential_types && Array.isArray(p.credential_types)) {
          p.credential_types.forEach((e) => {
            acc[e] = true;
          });
        } else {
          acc[p.program_type] = true;
        }
        return acc;
      }, {})
    );
    // fill array with credential_type labels based on the string-of-integer suffix on values.  will then clear out the empty slots and compare length to the ones we collected from just the names.  If they're the same, use the order set in credential_types_maybe
    let credential_types_maybe = [];
    programs.forEach((p) => {
      if (p.credential_type_values) {
        let ctvs = Array.isArray(p.credential_type_values)
          ? p.credential_type_values
          : [p.credential_type_values];
        ctvs.forEach((ctv, idx) => {
          let parts = ctv.split("-");
          let maybe_num = Number.parseInt(parts[parts.length - 1], 10);
          if (Number.isInteger(maybe_num)) {
            if (maybe_num >= 0) {
              credential_types_maybe[maybe_num] = Array.isArray(
                p.credential_types
              )
                ? p.credential_types[idx]
                : p.credential_types;
            }
          }
        });
      }
    });
    credential_types_maybe = credential_types_maybe.filter((ct) => !!ct);
    if (credential_types_maybe.length == credential_types.length) {
      credential_types = credential_types_maybe;
    }
    areas_of_study = Object.keys(
      programs.reduce((acc, p) => {
        if (p.areas_of_study && Array.isArray(p.areas_of_study)) {
          p.areas_of_study.forEach((e) => {
            acc[e] = true;
          });
        } else {
          acc[p.areas_of_study] = true;
        }
        return acc;
      }, {})
    ).sort((a, b) =>
      (a || "").toLowerCase().localeCompare((b || "").toLowerCase())
    );
    degree_types = Object.keys(
      programs.reduce((acc, p) => {
        if (p.degree_types && Array.isArray(p.degree_types)) {
          p.degree_types.forEach((e) => {
            acc[e] = true;
          });
        } else {
          acc[p.degree_types] = true;
        }
        return acc;
      }, {})
    );
  }
  function toggleCredentialType(t) {
    if (selected_credential_types.includes(t)) {
      selected_credential_types = selected_credential_types.filter(
        (ct) => ct != t
      );
    } else {
      selected_credential_types = [...selected_credential_types, t];
    }
  }

  let inPopState = false;
  $: {
    if (
      !locationMatchesSelectedItems(location, {
        selected_areas_of_study,
        selected_credential_types,
      })
    ) {
      if (!inPopState) {
        const url = new URL(location);
        setSearchParamsOnURL({
          url,
          selected_areas_of_study,
          selected_credential_types,
        });
        // console.log("pushState", pass, url.toString());
        history.pushState(null, "", url);
      } else {
        // console.log(
        //   "url not looking good, but was in a popstate so not pushingstate",
        //   location,
        //   pass
        // );
      }
    } else {
      //console.log("already looking good, not doing a pushState", pass);
      if (inPopState) {
        // console.log(
        //   "since the URL looks good and we are in a popstate, removing that state",
        //   inPopState
        // );
        inPopState = false;
      }
    }
    pass++;
  }
  let area_of_study_revealed = false;
  let area_of_study_reveal_button = null;
  let area_of_study_dialog = null;
  function handle_keypress(event) {
    if (event.key === "Escape") {
      if (area_of_study_revealed) {
        area_of_study_revealed = false;
        if (area_of_study_reveal_button) {
          area_of_study_reveal_button.focus();
        }
        event.stopPropagation();
      }
    }
  }
  function handle_focusout(event) {
    if (
      area_of_study_dialog &&
      area_of_study_dialog.contains(event.relatedTarget)
    )
      return;
    area_of_study_revealed = false;
  }
</script>

<svelte:window
  on:popstate={(e) => {
    inPopState = true;
    ({ selected_areas_of_study, selected_credential_types } =
      processUrlSearchParams(location));
    console.log(
      "stuff3 popstate",
      location,
      selected_areas_of_study,
      selected_credential_types
    );
  }}
/>

<div class="finder" class:notInOverlay={!inOverlay}>
  <div class="orange-line" />
  <h1>{title}</h1>
  <form class="form_bluebg">
    <fieldset class="credential_types">
      <legend>1. Select program type</legend>
      <div class="scroller">
        {#each credential_types as t}
          <input
            class="v-hidden"
            type="checkbox"
            bind:group={selected_credential_types}
            name="credential_types"
            value={t}
          />
          <button
            aria-hidden="true"
            type="button"
            class="bm--cta style-primary"
            class:selected={selected_credential_types.includes(t)}
            on:click={() => {
              $: toggleCredentialType(t);
            }}>{t}</button
          >
        {/each}
      </div>
    </fieldset>

    <fieldset class="areas_of_study">
      <legend>2. Area of study</legend>
      <button
        type="button"
        class="bm--cta style-primary"
        on:click={() => (area_of_study_revealed = !area_of_study_revealed)}
        bind:this={area_of_study_reveal_button}
        aria-controls="areas-dialog"
        aria-haspopup="dialog"
        aria-expanded={area_of_study_revealed}
        >{area_of_study_revealed
          ? "Hide Areas of Study"
          : "Select Areas of Study"}</button
      >
      <div
        class="scroller"
        id="areas-dialog"
        role="dialog"
        class:hidden={!area_of_study_revealed}
        on:keyup={handle_keypress}
        on:focusout={handle_focusout}
        bind:this={area_of_study_dialog}
      >
        {#each areas_of_study as area}
          <label class="checkbox"
            ><input
              type="checkbox"
              bind:group={selected_areas_of_study}
              name="areas_of_study"
              value={area}
            />{area}</label
          >
        {/each}
      </div>
    </fieldset>
  </form>
  <slot />
</div>

<style>
  h1 {
    color: var(--color--white);
  }
  .orange-line {
    width: 4.5rem;
    height: 0.1875rem;
    background-color: var(--color--orange-600);
    margin-bottom: 2rem;
  }
  .finder {
    background-color: var(--color--blue-600);
    padding: 1rem;
  }
  @media (min-width: 1024px) {
    .finder.notInOverlay {
      padding: 5.5rem;
    }
  }
  label {
    display: block;
  }
  fieldset.credential_types button.selected {
    background-color: var(--color--white) !important;
    color: var(--color--blue-600) !important;
  }
  fieldset.credential_types,
  fieldset.areas_of_study {
    margin-top: 2.5rem;
    border: none;
    padding: 0;
  }
  fieldset.credential_types {
    margin-top: 3.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    min-width: 0; /* https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content#answer-17863685 */
  }
  fieldset.credential_types .scroller {
    display: flex;
    gap: 0.75rem;
    flex-direction: row;
    overflow-x: auto;
    width: calc(100% + 2rem);
  }
  fieldset.credential_types legend,
  fieldset.areas_of_study legend {
    margin-bottom: 1.5rem;
  }
  legend {
    color: var(--color--white);
  }
  label.checkbox {
    color: var(--color--white);
    margin-top: 1rem;
    display: flex;
    align-items: center;
  }
  label.checkbox input {
    margin-right: 0.75rem;
  }
  fieldset.areas_of_study {
    position: relative;
  }
  fieldset.areas_of_study .scroller {
    overflow-y: scroll;
    border: 1px solid white;
    min-height: 5rem;
    max-height: 20rem;
    padding: 1rem;
    margin-top: 1rem;
    position: absolute;
    bottom: 0rem;
    right: 1rem;
    max-width: 19rem;
    background-color: var(--color--blue-600);
  }
  fieldset.areas_of_study .scroller.hidden {
    display: none;
  }
  .v-hidden {
    clip: rect(0, 0, 0, 0);
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
</style>
