#!/usr/bin/env python3
"""
Fetch GitHub stats for user smurphy6492 and write to public/github-stats.json

Usage:
    GITHUB_TOKEN=<token> python scripts/fetch_github_stats.py

Environment:
    GITHUB_TOKEN: GitHub personal access token (required)
"""

import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from typing import Any, Dict, List
from urllib.error import HTTPError, URLError


GITHUB_USER = "smurphy6492"
BASE_URL = "https://api.github.com"
OUTPUT_PATH = "public/github-stats.json"


def fetch_json(url: str, token: str, headers: Dict[str, str] | None = None) -> Any:
    """Fetch JSON from GitHub API with error handling."""
    req_headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if headers:
        req_headers.update(headers)

    req = urllib.request.Request(url, headers=req_headers)

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"HTTP {e.code} error fetching {url}: {error_body}", file=sys.stderr)
        sys.exit(1)
    except URLError as e:
        print(f"Network error fetching {url}: {e.reason}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error fetching {url}: {e}", file=sys.stderr)
        sys.exit(1)


def get_user_info(token: str) -> Dict[str, Any]:
    """Fetch basic user information."""
    url = f"{BASE_URL}/users/{GITHUB_USER}"
    return fetch_json(url, token)


def get_all_repos(token: str) -> List[Dict[str, Any]]:
    """Fetch all public repositories for the user."""
    repos = []
    page = 1

    while True:
        url = f"{BASE_URL}/users/{GITHUB_USER}/repos?per_page=100&page={page}&type=owner"
        page_repos = fetch_json(url, token)

        if not page_repos:
            break

        repos.extend(page_repos)
        page += 1

        # Safety limit
        if page > 10:
            break

    return repos


def get_total_stars(repos: List[Dict[str, Any]]) -> int:
    """Calculate total stars across all repositories."""
    return sum(repo.get("stargazers_count", 0) for repo in repos)


def get_top_languages(repos: List[Dict[str, Any]], token: str, top_n: int = 3) -> List[Dict[str, Any]]:
    """Aggregate language usage across all repos and return top N."""
    language_bytes: Dict[str, int] = {}

    for repo in repos:
        # Skip forks and archived repos
        if repo.get("fork") or repo.get("archived"):
            continue

        repo_name = repo["name"]
        url = f"{BASE_URL}/repos/{GITHUB_USER}/{repo_name}/languages"

        try:
            languages = fetch_json(url, token)
            for lang, bytes_count in languages.items():
                language_bytes[lang] = language_bytes.get(lang, 0) + bytes_count
        except SystemExit:
            # If a single repo fails, continue with others
            print(f"Warning: Failed to fetch languages for {repo_name}", file=sys.stderr)
            continue

    if not language_bytes:
        return []

    # Calculate percentages
    total_bytes = sum(language_bytes.values())
    language_percentages = [
        {"name": lang, "percentage": round((bytes_count / total_bytes) * 100)}
        for lang, bytes_count in language_bytes.items()
    ]

    # Sort by percentage descending and take top N
    language_percentages.sort(key=lambda x: x["percentage"], reverse=True)
    return language_percentages[:top_n]


def get_commits_this_year(token: str) -> int:
    """Get total commits for the current year using search API."""
    current_year = datetime.now(timezone.utc).year
    url = f"{BASE_URL}/search/commits?q=author:{GITHUB_USER}+author-date:>{current_year}-01-01"

    # Commits search requires special preview header
    headers = {"Accept": "application/vnd.github.cloak-preview+json"}

    result = fetch_json(url, token, headers)
    return result.get("total_count", 0)


def main() -> None:
    """Main entry point."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("Error: GITHUB_TOKEN environment variable not set", file=sys.stderr)
        sys.exit(1)

    print(f"Fetching GitHub stats for user: {GITHUB_USER}")

    # Fetch user info
    user_info = get_user_info(token)
    public_repos = user_info.get("public_repos", 0)
    print(f"  Public repos: {public_repos}")

    # Fetch all repositories
    print("  Fetching repositories...")
    repos = get_all_repos(token)

    # Calculate total stars
    total_stars = get_total_stars(repos)
    print(f"  Total stars: {total_stars}")

    # Get top languages
    print("  Aggregating language statistics...")
    top_languages = get_top_languages(repos, token)
    print(f"  Top languages: {[lang['name'] for lang in top_languages]}")

    # Get commits this year
    print("  Fetching commit count for this year...")
    commits_this_year = get_commits_this_year(token)
    print(f"  Commits this year: {commits_this_year}")

    # Prepare output
    stats = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "public_repos": public_repos,
        "total_stars": total_stars,
        "commits_this_year": commits_this_year,
        "top_languages": top_languages,
    }

    # Write to file
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\n✓ GitHub stats written to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
