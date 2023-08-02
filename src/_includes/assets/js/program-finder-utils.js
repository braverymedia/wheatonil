export function compute_programs_filtered({
  programs,
  selected_areas_of_study,
  selected_credential_types,
}) {
  /* compute which programs to show */
  const programs_filtered = programs
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
  return programs_filtered;
}

export function setSearchParamsOnURL({
  url,
  selected_areas_of_study,
  selected_credential_types,
}) {
  if (url && url.searchParams) {
    url.searchParams.delete("pf-aos");
    url.searchParams.delete("pf-ct");
    selected_areas_of_study.forEach((aos) =>
      url.searchParams.append("pf-aos", aos)
    );
    selected_credential_types.forEach((ct) =>
      url.searchParams.append("pf-ct", ct)
    );
  }
}

export function processUrlSearchParams(location) {
  const url = new URL(location);
  return {
    selected_areas_of_study:
      (url && url.searchParams && url.searchParams.getAll("pf-aos")) || [],
    selected_credential_types:
      (url && url.searchParams && url.searchParams.getAll("pf-ct")) || [],
  };
}
