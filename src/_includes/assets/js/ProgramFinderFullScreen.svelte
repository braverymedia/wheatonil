<script>
  export let title = "Finder";
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
  let programs_filtered = programs;
  let selected_areas_of_study = [];
  let selected_credential_types = [];
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
  $: {
    /* compute which programs to show */
    programs_filtered = programs
      .filter((program) => {
        let pass = true;
        if (selected_areas_of_study.length > 0) {
          /* if there are selected areas of study, and the program has areas of study specified, conditionally show it */
          pass = false;
          if (program.areas_of_study) {
            program.areas_of_study.forEach((aos) => {
              if (selected_areas_of_study.includes(aos)) {
                pass = true;
              }
            });
          }
          if (!pass) return pass;
        }
        if (selected_credential_types.length > 0) {
          /* if there are selected credential types, and the program has credential types specified, conditionally show it */
          pass = false;
          if (program.credential_types) {
            program.credential_types.forEach((ct) => {
              if (selected_credential_types.includes(ct)) {
                pass = true;
              }
            });
          }
          if (!pass) return pass;
        }
        return pass;
      })
      .sort((a, b) => {
        return (a.name || "")
          .toLowerCase()
          .localeCompare((b.name || "").toLowerCase());
      });
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
</script>

<div class="program-finder-2023 container">
  <div class="col1">
    <div class="finder">
      <div class="orange-line" />
      <h1>{title}</h1>
      <form>
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
        </fieldset>
      </form>
    </div>
  </div>
  <div class="col2">
    <p>
      Viewing {programs_filtered.length} program{programs_filtered.length == 1
        ? ""
        : "s"}
    </p>
    <ul class="results" aria-live="polite" aria-relevant="additions removals">
      {#each programs_filtered as program}
        <li class="result">
          <p class="program_name">{program.name}</p>
          <div class="details">
            {#if program.credential_types && program.credential_types.length > 0}
              <div class="detail credential_types">
                <p class="detail_type">Credential Type</p>
                <p>{program.credential_types.join(", ")}</p>
              </div>
            {/if}
            {#if program.degree_types && program.degree_types.length > 0}
              <div class="detail degree_types">
                <p class="detail_type">Offered As</p>
                <p>{program.degree_types.join(", ")}</p>
              </div>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  h1 {
    color: var(--color--white);
  }
  @media (min-width: 1024px) {
    .container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .orange-line {
    width: 4.5rem;
    height: 0.1875rem;
    background-color: var(--color--orange-600);
    margin-bottom: 2rem;
  }
  .col1 {
    margin: 0;
    grid-column: 1;
  }
  .finder {
    background-color: var(--color--blue-600);
    padding: 1rem;
  }
  @media (min-width: 1024px) {
    .finder {
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
  form {
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
  fieldset.credential_types legend {
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

  .col2 {
    margin: 0;
    grid-column: 2;
    padding: 1rem;
  }
  @media (min-width: 1024px) {
    .col2 {
      padding: 5.5rem;
    }
  }
  ul {
    list-style: none;
    padding: 0;
  }
  .program_name {
    font-family: var(--wc-font-family--serif);
    font-size: var(--type-size--xl);
    font-weight: 400;
    color: var(--color--blue-600);
    margin-bottom: 1rem;
    line-height: 120%;
  }
  .details {
    display: flex;
    justify-content: flex-start;
    gap: 6rem;
  }
  .detail_type {
    font-size: var(--type-size--text-sm);
    font-weight: 400;
    line-height: 140%;
    color: var(--color--grey-600);
    margin: 0;
  }
  .detail {
    font-size: var(--type-size--text-md);
    font-weight: 500;
    line-height: 140%;
    color: var(--color--grey-800, #232c39);
    margin: 0;
    margin-top: 0.5rem;
    max-width: 8rem;
  }
  .results li {
    margin-top: 3rem;
    border-bottom: 1px solid var(--color--grey-300);
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
