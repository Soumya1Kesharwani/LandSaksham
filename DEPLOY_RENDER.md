# 🚀 Deploying LandSaksham to Render

This repository is pre-configured for 1-click zero-friction deployment on [Render](https://render.com).

---

## 🌟 Method 1: 1-Click Blueprint / Docker Deployment (Recommended)

This method deploys both the **FastAPI Backend** and the **React Vite Frontend** together as a single unified service.
- ✅ Uses only **1 Free Tier Web Service** on Render
- ✅ Zero CORS issues
- ✅ Automatic build and compilation using the included multi-stage `Dockerfile`

### Steps:
1. **Push your code to GitHub / GitLab**:
   ```bash
   git add .
   git commit -m "Configure Render deployment"
   git push origin main
   ```
2. **Open Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com/)
   - Click **New +** → **Blueprint**
   - Connect your GitHub repository (`LandSaksham` or `FINAL`).
   - Render will detect `render.yaml` automatically.
   - Click **Apply**.
3. **Done!**
   - Once deployed, your site will be live at `https://landsaksham.onrender.com` (or your assigned subdomain).
   - API Docs will be available at `https://landsaksham.onrender.com/docs`.
   - Health check at `https://landsaksham.onrender.com/health`.

---

## 🛠️ Method 2: Manual Web Service (Single Docker Container)

If you prefer to configure manually via the Render UI without Blueprints:

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `landsaksham`
   - **Language / Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile` (or `./LandSaksham/Dockerfile` if deploying from the parent repo)
   - **Instance Type**: `Free`
4. Click **Create Web Service**.

---

## 🌐 Method 3: Separate Services (Backend Web Service + Frontend Static Site)

If you want the backend API and frontend hosted as separate services on Render:

### Step A: Deploy Backend API (Web Service)
1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your repository.
3. Configure:
   - **Name**: `landsaksham-api`
   - **Language**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. Click **Create Web Service**. Note your deployed URL (e.g. `https://landsaksham-api.onrender.com`).

### Step B: Deploy Frontend (Static Site)
1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect your repository.
3. Configure:
   - **Name**: `landsaksham-web`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://landsaksham-api.onrender.com/api` (replace with your actual backend URL)
5. Add **Redirect / Rewrite Rules** (for Single Page App routing):
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
6. Click **Create Static Site**.

---

## 🔍 Verification & Health Checks

After deployment completes:
- **Frontend Command Center**: `https://<your-service>.onrender.com`
- **Interactive Swagger API Docs**: `https://<your-service>.onrender.com/docs`
- **Health Check Endpoint**: `https://<your-service>.onrender.com/health`
