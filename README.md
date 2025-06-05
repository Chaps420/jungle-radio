# Jungle Radio Request Line

A web app for submitting and managing song requests, with a flame-themed UI.

## Structure
- **Frontend**: `index.html` (static HTML, served via GitHub Pages)
- **Backend**: `server.js`, `package.json` (Node.js + Express, served via Render Web Service)

## Setup
1. **Create Repository**:
   - Create `JungleRadio` on GitHub, `main` branch.
   - Add files: `index.html`, `server.js`, `package.json`, `.gitignore`, `README.md`.
2. **Deploy Frontend**:
   - Enable GitHub Pages: `main` branch, `/ (root)`.
   - Update `index.html` with the Render backend URL.
3. **Deploy Backend**:
   - Create a Render Web Service from the root directory.
   - Set `ADMIN_PASSWORD` environment variable (e.g., `FPT589`).
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Test**:
   - Submit songs with URL or title/artist.
   - Use admin password (`FPT589`) to toggle admin mode.

## Optional: MongoDB
- Add MongoDB Atlas for persistent storage.
- Install `mongoose` and update `server.js`.
