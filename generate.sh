#!/bin/bash

INPUT_DIR="$1"
OUTPUT_DIR="$2"

if [[ -z "$INPUT_DIR" || -z "$OUTPUT_DIR" ]]; then
  echo "Usage: $0 input_folder output_folder"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Temp file to hold nav HTML
NAV_FILE=$(mktemp)

# Generate navigation tree
generate_nav() {
  local dir="$1"
  local rel_path="$2"

  echo "<ul>" >> "$NAV_FILE"

  for file in "$dir"/*; do
    if [[ -d "$file" ]]; then
      local subdir_name=$(basename "$file")
      echo "<li><strong>$subdir_name</strong>" >> "$NAV_FILE"
      generate_nav "$file" "$rel_path/$subdir_name"
      echo "</li>" >> "$NAV_FILE"
    elif [[ "$file" == *.md ]]; then
      local filename=$(basename "$file" .md)
      local link_path="$rel_path/$filename.html"
      echo "<li><a href=\"$link_path\">$filename</a></li>" >> "$NAV_FILE"
    fi
  done

  echo "</ul>" >> "$NAV_FILE"
}

# Render all markdown files
render_markdown() {
  local input_path="$1"
  local output_path="$2"

  mkdir -p "$output_path"

  for file in "$input_path"/*; do
    if [[ -d "$file" ]]; then
      local subdir=$(basename "$file")
      render_markdown "$file" "$output_path/$subdir"
    elif [[ "$file" == *.md ]]; then
      local filename=$(basename "$file" .md)
      local out_file="$output_path/$filename.html"
      pandoc "$file" -f markdown -t html -o "$out_file.tmp"

      # Wrap with layout
      cat <<EOF > "$out_file"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$filename</title>
  <style>
    body { display: flex; margin: 0; font-family: sans-serif; }
    nav { width: 250px; background: #f0f0f0; padding: 1em; height: 100vh; overflow-y: auto; }
    main { flex: 1; padding: 2em; }
    a { text-decoration: none; color: #0077cc; }
  </style>
</head>
<body>
<nav>
$(cat "$NAV_FILE")
</nav>
<main>
$(cat "$out_file.tmp")
</main>
</body>
</html>
EOF

      rm "$out_file.tmp"
    fi
  done
}

# Run generation
generate_nav "$INPUT_DIR" ""
render_markdown "$INPUT_DIR" "$OUTPUT_DIR"

# Cleanup
rm "$NAV_FILE"

echo "Site generated in: $OUTPUT_DIR"
