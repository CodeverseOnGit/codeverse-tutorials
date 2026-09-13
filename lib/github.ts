// Uses a fine-grained Personal Access Token (Contents: Read and write,
// scoped to this one repo) stored as GITHUB_CONTENT_TOKEN. This is
// separate from the OAuth app used for sign-in — that one proves who
// you are, this one is what's actually allowed to write to the repo.

const REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const REPO_NAME = process.env.GITHUB_REPO_NAME!;
const BRANCH = process.env.GITHUB_REPO_BRANCH || 'main';
const TOKEN = process.env.GITHUB_CONTENT_TOKEN!;

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

async function githubRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
}

// GitHub requires the current file's SHA to update it (not needed for
// a brand new file). Returns null if the file doesn't exist yet.
async function getExistingSha(path: string): Promise<string | null> {
  const res = await githubRequest(`${path}?ref=${BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to check existing file: ${res.status}`);
  const data = await res.json();
  return data.sha;
}

// Creates or updates a single file in the repo via one commit.
export async function commitFile(
  path: string,
  content: string,
  commitMessage: string,
  authorName?: string,
  authorEmail?: string
) {
  const sha = await getExistingSha(path);

  const body: Record<string, unknown> = {
    message: commitMessage,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: BRANCH,
  };
  if (sha) body.sha = sha; // required only when overwriting

  if (authorName && authorEmail) {
    body.committer = { name: authorName, email: authorEmail };
    body.author = { name: authorName, email: authorEmail };
  }

  const res = await githubRequest(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit failed (${res.status}): ${err}`);
  }

  return res.json();
}