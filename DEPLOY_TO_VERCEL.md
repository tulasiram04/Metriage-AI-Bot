# Push repository to GitHub and deploy to Vercel

Follow these steps locally to push this project to GitHub (excluding `.env`) and deploy to Vercel.

1) Initialize repo and make initial commit

```bash
git init
git add .
git commit -m "Initial commit"
```

2) Create a GitHub repo and push

Option A — using GitHub CLI (`gh`):

```bash
# replace <repo-name> with your desired repo name
gh repo create <repo-name> --public --source=. --remote=origin --push
```

Option B — manual (web or plain git):

```bash
# create repo on github.com, then
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

3) Deploy on Vercel

- Go to https://vercel.com and sign in with your GitHub account.
- Import the repository you just pushed.
- In the Import settings, set the Build Command to `npm run build` (or `vite build`) and the Output Directory to `dist`.
- Add environment variables in Vercel (do NOT upload `.env`). Create the following variables in the Vercel dashboard and copy values from your local `.env`:

  - `GEMINI_API_KEY`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `CLOUDINARY_UPLOAD_FOLDER`
  - `MONGODB_URI`
  - `PORT` (optional; Vercel provides its own port)

4) Trigger a deployment

- After import and setting env vars, click Deploy. Check the Vercel dashboard for build logs and the production URL.

Notes
- `.env` is in `.gitignore` so it won't be committed. Keep secret values only in Vercel's environment settings.
- If you prefer a private repo, change visibility when creating the repo and in Vercel select the repo accordingly.
