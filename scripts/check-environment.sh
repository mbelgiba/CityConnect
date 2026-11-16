#!/usr/bin/env bash
set -u
for tool in java mvn git; do
  if command -v "$tool" >/dev/null; then printf '%-8s %s\n' "$tool" "$(command -v "$tool")"; else printf '%-8s MISSING\n' "$tool"; fi
done
java -version 2>&1 | head -n 1
mvn -version 2>&1 | head -n 2
port="${PORT:-8080}"
if command -v ss >/dev/null && ss -ltn 2>/dev/null | grep -Eq ":${port}[[:space:]]"; then echo "Port ${port}: occupied"; else echo "Port ${port}: available or cannot be checked"; fi
[[ -f pom.xml ]] && echo "pom.xml: present"
[[ -d src/main/resources/static ]] && echo "Frontend: present"
