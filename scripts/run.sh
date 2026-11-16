#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8080}"
MAVEN_REPO_LOCAL="${MAVEN_REPO_LOCAL:-${TMPDIR:-/tmp}/cityconnect-m2}"
command -v java >/dev/null || { echo "Java is missing; Java 21 is required." >&2; exit 1; }
command -v mvn >/dev/null || { echo "Maven is missing; Maven 3.9+ is required." >&2; exit 1; }
if [[ "$(java -version 2>&1 | head -n 1)" != *21.* ]]; then echo "Java 21 is required." >&2; exit 1; fi
if command -v ss >/dev/null && ss -ltn 2>/dev/null | grep -Eq ":${PORT}[[:space:]]"; then
  echo "Port ${PORT} is already in use. Choose another port, for example: PORT=8081 scripts/run.sh" >&2
  exit 1
fi
cd "$ROOT"
exec mvn -Dmaven.repo.local="$MAVEN_REPO_LOCAL" spring-boot:run
