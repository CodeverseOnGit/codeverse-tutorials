# Cloud Native Development Learning Path

Next.js (App Router) site that serves the learning path at
`codeverse.xxx.com/cloud-native-development`, with content stored as
MDX files and a gated `/studio` editor for making changes.

## How access control works

- **Public site** (`/cloud-native-development/**`): fully read-only, no
  login required. It just reads `.mdx` files at request/build time.
- **Studio** (`/studio`): requires GitHub sign-in. On sign-in, the
  user's GitHub username is checked against `EDITOR_ALLOWLIST` in your
  env vars. Only allow-listed usernames get `role: "editor"` — anyone
  else who signs in gets `role: "reader"` and the studio UI shows them
  a "no access" message.
- **Save endpoint** (`/api/chapters/save`): the actual security
  boundary. It re-checks the server-side session and role on every
  request — 403s anyone who isn't `role: "editor"`, even if they hit
  the API directly with curl/Postman, bypassing the UI entirely.

This means: hiding the Studio link from nav does nothing on its own
(anyone could visit the URL) — the role check on both the page and the
API is what actually locks it down.

## Setup walkthrough

### 1. Install dependencies

```bash
npm install
```

### 2. Create a GitHub OAuth App

Go to github.com/settings/developers → "New OAuth App":
- Homepage URL: `https://codeverse.xxx.com`
- Callback URL: `https://codeverse.xxx.com/cloud-native-development/api/auth/callback/github`

Copy the Client ID and generate a Client Secret.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `GITHUB_ID`, `GITHUB_SECRET`, a random `NEXTAUTH_SECRET`
(`openssl rand -base64 32`), and your `EDITOR_ALLOWLIST` (your own
GitHub username, comma-separated if more than one editor).

### 4. Add your content

Content lives under `content/cloud-native-development/<module-slug>/`.
Each module folder needs a `meta.json` (title + order) and one `.mdx`
file per chapter, with frontmatter for title/module/chapter/milestone/
articlePrompt. Copy the sample in `01-foundations/` as a template —
add all 9 modules and ~34 chapters this way.

### 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000/cloud-native-development` for the public
site, and `http://localhost:3000/studio` for the editor.

### 6. Deploy

Any Node host works (Vercel, a VPS with PM2, etc). Point your reverse
proxy at it:

```
codeverse.xxx.com {
  reverse_proxy /cloud-native-development* localhost:3000
}
```

(Caddy syntax shown; Nginx `location /cloud-native-development { proxy_pass ...; }` works the same way.)

### 7. Version your content (recommended)

Since content is just files, put the whole `content/` folder under git.
Every studio save currently writes straight to disk — wire the save
route up to a GitHub API commit (see the comment in
`app/api/chapters/save/route.ts`) if you want every edit to show up as
a diff'd, attributable commit instead of a silent overwrite.

## Extending the editor

The Studio page currently uses a plain textarea with a couple of
insert-shortcuts (H2/H3/code block) — enough to prove the save flow
works end to end. Swap it for **Tiptap** with
`@tiptap/extension-code-block-lowlight` when you want real WYSIWYG
(font size via heading levels, a code-block button with language
picker, etc). Tiptap's JSON output gets serialized to Markdown before
hitting `/api/chapters/save`, so nothing else in this project changes.
