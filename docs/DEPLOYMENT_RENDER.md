# 🚀 Deploying LandSaksham on Render

This guide walks you through deploying the **LandSaksham** system (FastAPI Backend + React Frontend) to [Render](https://render.com) in less than 5 minutes.

---

## 🌟 Method 1: 1-Click Blueprint Deployment (Recommended)

Render provides automatic multi-service deployments via `render.yaml` blueprints.

### Step 1: Push Code to GitHub
Ensure your latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure Render deployment blueprint"
git push origin main
```

### Step 2: Create Blueprint Instance on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click the **"New +"** button in the top right.
3. Select **"Blueprint"**.
4. Connect your GitHub account and choose the repository `LandSaksham` (or `pv8925844-jpg/LandSaksham`).
5. Give your blueprint a group name (e.g., `landsaksham-production`).
6. Click **"Apply"**.

Render will automatically configure and build both services:
- 🟢 `landsaksham-backend` (FastAPI Web Service on Python)
- 🟢 `landsaksham-frontend` (React + Vite Static Site with CDN)

---

## 🛠️ Method 2: Manual Service Creation (Alternative)

If you prefer to configure each service manually in the Render dashboard:

### 1. Deploy the Backend (Web Service)
1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name**: `landsaksham-backend`
   - **Region**: Nearest to your users (e.g., `Singapore` or `Frankfurt`)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. In **Environment Variables**, add:
   - `PYTHON_VERSION` = `3.11.9`
5. Click **Create Web Service**.
6. Note down your backend URL (e.g., `https://landsaksham-backend.onrender.com`).

### 2. Deploy the Frontend (Static Site)
1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name**: `landsaksham-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `./dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://<YOUR-BACKEND-SERVICE-NAME>.onrender.com/api`
   *(Example: `https://landsaksham-backend.onrender.com/api`)*
5. In **Redirects / Rewrites**:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## 🔍 Verification & Health Checks

Once deployed, you can verify your deployment with these URLs:

1. **Backend Health Check**:
   ```text
   GET https://<your-backend-url>.onrender.com/health
   Response: {"status": "healthy", "service": "nliis-backend"}
   ```

2. **Interactive API Documentation (Swagger)**:
   ```text
   https://<your-backend-url>.onrender.com/docs
   ```

3. **Frontend Application**:
   ```text
   https://<your-frontend-url>.onrender.com
   ```

---

## 💡 Important Notes

- **Free Tier Sleep Behavior**: On Render's Free tier, the backend web service spins down after 15 minutes of inactivity. When a user opens the application after inactivity, the first backend request may take ~30-50 seconds to respond. The LandSaksham frontend has built-in offline fallback data to ensure zero UI interruption during cold starts.
- **CORS**: The backend has CORS configured to permit requests from any origin (`allow_origins=["*"]`), ensuring seamless communication between your frontend and backend on Render.
