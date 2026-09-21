#!/usr/bin/env bash
# Copy every public file into ./output for Cloudflare Pages/Workers.
# Cloudflare dashboard: Build command `bash build.sh`, output directory `output`.
set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)"
out="${root}/output"

rm -rf "${out}"
mkdir -p "${out}/assets"

# Explicit pages only — never copy unpublished experience.html.
pages=(
  index.html
  projects.html
  talks.html
  open-source.html
  resume.html
)

root_files=(
  styles.css
  site.js
  robots.txt
  sitemap.xml
  llms.txt
  llms-full.txt
  ads.txt
  _redirects
)

missing=0
for file in "${pages[@]}" "${root_files[@]}"; do
  if [[ ! -f "${root}/${file}" ]]; then
    echo "build.sh: missing ${file}" >&2
    missing=1
  fi
done
if [[ ! -d "${root}/assets" ]]; then
  echo "build.sh: missing assets/" >&2
  missing=1
fi
if [[ "${missing}" -ne 0 ]]; then
  exit 1
fi

for file in "${pages[@]}" "${root_files[@]}"; do
  cp "${root}/${file}" "${out}/${file}"
done

# photo, oss.json, talks.json, projects.json, fonts, favicons, manifest, browserconfig
cp -R "${root}/assets/." "${out}/assets/"

echo "build.sh: wrote ${out}"
find "${out}" -type f | sort
