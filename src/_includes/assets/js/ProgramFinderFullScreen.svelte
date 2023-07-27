<script>
  import ProgramFinderSearch from "./ProgramFinderSearch.svelte";
  export let title = "Finder";
  export let programs = [];
  let programs_filtered = programs;
  let selected_areas_of_study = [];
  let selected_credential_types = [];
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
</script>

<div class="program-finder-2023 container">
  <div class="col1">
    <ProgramFinderSearch
      {title}
      {programs}
      bind:selected_areas_of_study
      bind:selected_credential_types
    />
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
          <p class="program_name"><a href={program.link}>{program.name}</a></p>
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
  @media (min-width: 1024px) {
    .container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .col1 {
    margin: 0;
    grid-column: 1;
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
</style>
