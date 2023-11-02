<script>
  import ProgramFinderSearch from "./ProgramFinderSearch.svelte";
  import {
    compute_programs_filtered,
    processUrlSearchParams,
    setSearchParamsOnURL,
  } from "./program-finder-utils";
  export let title = "Finder";
  export let programs = [];
  export let isOpen = true;
  export let fullScreenPath = "/"; // where to send folks who click on "view programs"

  let fullScreenUrl;

  let programs_filtered = programs;
  let selected_areas_of_study = [];
  let selected_credential_types = [];

  ({ selected_areas_of_study, selected_credential_types } =
    processUrlSearchParams(location));
  //   console.log(
  //     "stuff2",
  //     location,
  //     selected_areas_of_study,
  //     selected_credential_types
  //   );

  $: {
    programs_filtered = compute_programs_filtered({
      programs,
      selected_areas_of_study,
      selected_credential_types,
    });

    if (fullScreenPath.startsWith("http")) {
      fullScreenUrl = new URL(fullScreenPath);
    } else {
      fullScreenUrl = new URL(location);
      fullScreenUrl.pathname = fullScreenPath;
    }
    fullScreenUrl.search = "";

    setSearchParamsOnURL({
      url: fullScreenUrl,
      selected_areas_of_study,
      selected_credential_types,
    });
  }
  function close() {
    isOpen = false;
  }
  function handle_keypress(event) {
    if (event.key === "Escape") {
      isOpen = false;
    }
  }
</script>

<svelte:window on:keyup={handle_keypress} />

{#if isOpen}
  <div
    class="program-finder-2023-popover"
    class:isOpen
    aria-hidden={isOpen ? "false" : "true"}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
    <div
      class="program-finder-2023-popover__overlay"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-label="Program Finder"
      on:click|self={close}
    >
      <div class="program-finder-2023-popover__container">
        <button class="program-finder-2023-popover__close" on:click={close}>
          <span class="v-hidden">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 44 44"
            ><path
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.667"
              d="m27.5 16.5-11 11m0-11 11 11M40.334 22c0 10.125-8.209 18.333-18.334 18.333S3.667 32.125 3.667 22C3.667 11.875 11.875 3.667 22 3.667c10.126 0 18.334 8.208 18.334 18.333Z"
            /></svg
          >
        </button>
        <ProgramFinderSearch
          {title}
          {programs}
          inOverlay={true}
          bind:selected_areas_of_study
          bind:selected_credential_types
        >
          <footer class="program-finder-2023-popover__footer">
            <a
              class="bm--cta program-finder-2023-popover__link"
              class:disabled={programs_filtered.length == 0}
              href={fullScreenUrl}>View Programs ({programs_filtered.length})</a
            >
          </footer></ProgramFinderSearch
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .program-finder-2023-popover {
    display: none;
    position: relative;
    z-index: 2000;
  }
  .program-finder-2023-popover.isOpen {
    display: block;
  }
  .program-finder-2023-popover[aria-hidden="false"]
    .program-finder-2023-popover__overlay {
    animation: bppfadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
  .program-finder-2023-popover[aria-hidden="false"]
    .program-finder-2023-popover__container {
    animation: bppslideIn 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
  .program-finder-2023-popover .program-finder-2023-popover__container,
  .program-finder-2023-popover .program-finder-2023-popover__overlay {
    will-change: transform;
  }
  .program-finder-2023-popover__overlay {
    align-items: flex-end;
    background: #0009;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }
  .program-finder-2023-popover__container {
    background-color: var(--color--black);
    color: var(--color--white);
    max-height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  @media (min-width: 768px) {
    .program-finder-2023-popover__container {
      height: auto;
      width: 560px;
    }
  }

  .disabled {
    pointer-events: none;
    cursor: default;
  }
  .program-finder-2023-overlay-inner {
    position: relative;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  @media (min-width: 768px) {
    .program-finder-2023-overlay {
      width: 35rem;
    }
  }
  .program-finder-2023-popover__close {
    background: #0000;
    border: 0;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 1rem;
    top: 1rem;
    cursor: pointer;
  }
  .program-finder-2023-popover__close svg {
    width: 44px;
    height: 44px;
  }
  .program-finder-2023-popover__link {
  }
  .program-finder-2023-popover__footer {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
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
