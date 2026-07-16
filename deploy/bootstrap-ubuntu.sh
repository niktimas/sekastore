#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="seka-bike"
SOURCE_DIR="/opt/${APP_NAME}-source"
BRANCH="${BRANCH:-main}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo REPO_URL=https://github.com/USER/REPO.git bash deploy/bootstrap-ubuntu.sh"
  exit 1
fi

if [[ -z "${REPO_URL:-}" ]]; then
  echo "REPO_URL is required."
  echo "Example: sudo REPO_URL=https://github.com/USER/REPO.git bash deploy/bootstrap-ubuntu.sh"
  exit 1
fi

apt-get update
apt-get install -y ca-certificates git

if [[ -d "${SOURCE_DIR}/.git" ]]; then
  git -C "${SOURCE_DIR}" fetch --prune origin
  git -C "${SOURCE_DIR}" checkout "${BRANCH}"
  git -C "${SOURCE_DIR}" pull --ff-only origin "${BRANCH}"
else
  rm -rf "${SOURCE_DIR}"
  git clone --branch "${BRANCH}" "${REPO_URL}" "${SOURCE_DIR}"
fi

bash "${SOURCE_DIR}/deploy/install-ubuntu.sh"
