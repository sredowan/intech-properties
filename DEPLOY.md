# Deployment Guide (Hostinger + GitHub)

This guide will help you deploy your application to Hostinger using GitHub for continuous integration.

## Prerequisites
- A GitHub account.
- A Hostinger hosting plan that supports Node.js (e.g., Business Web Hosting or VPS).
- Your project pushed to a GitHub repository.

## Step 1: Prepare Your Project
1.  Ensure your `package.json` has the `start` script: `"start": "node server.js"`.
2.  Ensure `server.js` is configured to serve the `dist` folder (already done).
3.  Push your latest changes to GitHub:
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

## Step 2: Configure Hostinger (Node.js)
1.  Log in to your Hostinger hPanel.
2.  Navigate to **Websites** and manage your website.
3.  Search for **Node.js** in the sidebar or advanced section.
4.  **Create a Node.js Application**:
    -   **Node.js Version**: Choose `18` or `20` (Recommended).
    -   **Application Mode**: `Production`.
    -   **Application Root**: `web-app` (or leave as `/` if your repo is the root).
    -   **Application Startup File**: `server.js`.
    -   **npm install**: Click this button after deployment to install dependencies.

## Step 3: Connect GitHub
1.  **Find the Git Tool**:
    -   In your website's dashboard (hPanel), look at the **Left Sidebar**.
    -   Scroll down to the **Advanced** section.
    -   Click on **Git Production** (or just **Git**).
2.  **Add a Repository**:
    -   **Repository**: `sredowan/intech-properties` (Your GitHub repo user/name).
    -   **Branch**: `main`.
    -   **Directory**: (Leave empty to deploy to public_html, or match your Node.js settings).
    -   **Webhook URL**: Copy this URL.
3.  **Setup Webhook in GitHub**:
    -   Go to your GitHub Repo -> **Settings** -> **Webhooks**.
    -   Add a new webhook with the URL from Hostinger.
    -   Content type: `application/json`.
    -   Event: `Push`.

## Step 4: Environment Variables
1.  In your Hostinger Node.js settings (or `.env` file manager):
2.  Add `VITE_DATABASE_URL`: `[Your Neon DB Connection String]`
    -   *Crucial*: Since Vite builds at deployment time, you might need to set this *before* running the build command if code depends on it, OR ensure the runtime variables are read correctly.
    -   If you use an `.env` file on the server, make sure to create it manually in the File Manager since it's ignored by Git.

## Step 5: Run
1.  After pulling the code in Hostinger:
2.  Click **npm install** in the Node.js settings.
3.  **Restart** the Node.js application.
    -   *Note*: We have already pushed the `dist` (build) folder to GitHub, so you DO NOT need to run a "Build" command on the server. The files are already there.

## Troubleshooting
-   **White Screen**: Check if the `dist` folder exists in the File Manager.
-   **500 Error**: Check the "permissions" of your folders or check `error.log`.
-   **Images not loading**: ensure `public/uploads` has write permissions.

## Database
Your database is on Neon (external), so as long as `VITE_DATABASE_URL` is set, it will connect.
