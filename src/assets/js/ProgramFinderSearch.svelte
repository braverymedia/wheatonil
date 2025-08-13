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
</script>

<svelte:window
  on:popstate={(e) => {
    inPopState = true;
    ({ selected_areas_of_study, selected_credential_types } =
      processUrlSearchParams(location));
    // console.log(
    //   "stuff3 popstate",
    //   location,
    //   selected_areas_of_study,
    //   selected_credential_types
    // );
  }}
/>

<div class="finder" class:notInOverlay={!inOverlay}>
  <h1 class="is-fancy">{title}</h1>
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
      <div class="checkbox-container">
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
    animation: fadeInUp 0.6s cubic-bezier(0, 0, 0.2, 1);
  }
  .finder {
    background-color: var(--color--blue-600);
    display: flex;
    flex-direction: column;
    animation: fadeInUp 0.4s cubic-bezier(0, 0, 0.2, 1);
  }
  @media (min-width: 1024px) {
    .finder.notInOverlay {
      padding: var(--space--gap-xxl);
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: var(--space--gap-xxl);
    flex-shrink: 1;
    animation: fadeInUp 0.6s cubic-bezier(0, 0, 0.2, 1) 0.1s both;
  }
  label {
    display: block;
  }
  fieldset.credential_types button {
    transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
  }
  fieldset.credential_types button:hover {
    opacity: 0.9;
  }
  fieldset.credential_types button.selected {
    background-color: var(--color--white) !important;
    color: var(--color--blue-600) !important;
  }
  fieldset.credential_types,
  fieldset.areas_of_study {
    border: none;
    padding: 0;
    padding-block: unset;
  }
  fieldset.credential_types {
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    margin-inline: -1rem;
    min-width: 0; /* https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content#answer-17863685 */
  }
  fieldset.credential_types .scroller {
    display: flex;
    gap: 0.75rem;
    flex-direction: row;
    scroll-behavior: smooth;
    overflow-x: auto;
    scrollbar-width: none;
    padding-inline: var(--space--gap-medium);
  }
  fieldset.credential_types legend {
    margin-inline: var(--space--gap-medium);
  }
  legend {
    color: var(--color--white);
    margin-bottom: var(--space--gap-medium)
  }
  label.checkbox {
    color: var(--color--white);
    display: flex;
    align-items: center;
    transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1);
    animation: fadeInUp 0.4s cubic-bezier(0, 0, 0.2, 1);
  }
  label.checkbox:hover {
    opacity: 0.8;
  }
  label.checkbox input {
    margin-right: var(--space--gap-regular);
    transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1);
  }
  label.checkbox input:checked {
    opacity: 1;
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

  /* Animation keyframes */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
