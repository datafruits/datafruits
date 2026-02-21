#!/bin/bash
set -e

OUTPUT="AGENTS.md"
RULES_DIR="rules"

# Start with the header
cat > "$OUTPUT" << 'HEADER'
# Ember Best Practices

Comprehensive performance optimization and accessibility patterns for modern Ember.js applications. Includes rules across 7 categories using gjs/gts format and modern Ember patterns.

---

HEADER

# Add sections
cat "$RULES_DIR/_sections.md" >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "---" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Add all rules
for file in "$RULES_DIR"/*.md; do
  # Skip the _sections.md file
  if [[ "$(basename "$file")" == "_sections.md" ]]; then
    continue
  fi
  
  echo "Adding $(basename "$file")..." >&2
  cat "$file" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
  echo "---" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
done

echo "Built $OUTPUT successfully!" >&2
