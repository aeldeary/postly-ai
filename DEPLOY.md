
# Deploying Postly-AI to Google Cloud Run

This guide assumes you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) (`gcloud`) installed and authenticated.

## Prerequisites

1.  **Google Cloud Project**: Ensure you have an active GCP project.
2.  **Billing**: Ensure billing is enabled for your project.
3.  **APIs Enabled**: Enable the Cloud Run API and Cloud Build API.
    ```bash
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com
    ```

## Deployment Steps

### 1. Set your Project ID
Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.
```bash
gcloud config set project YOUR_PROJECT_ID
```

### 2. Build and Submit the Image
Because this is a frontend application, the **API Key must be baked into the build** so Vite can replace `process.env.API_KEY` in the code.

**Replace `YOUR_ACTUAL_API_KEY` with your Gemini API Key.**

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/postly-ai --build-arg API_KEY=YOUR_ACTUAL_API_KEY
```

### 3. Deploy to Cloud Run
Deploy the built image to Cloud Run. This command allows unauthenticated (public) access to the web app.

```bash
gcloud run deploy postly-ai \
  --image gcr.io/YOUR_PROJECT_ID/postly-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

### 4. Access your App
Once the deployment finishes, the terminal will display a Service URL (e.g., `https://postly-ai-xyz-uc.a.run.app`). Click it to view your live application.

---

## 🔒 Security Note on API Keys
Since this is a client-side application (Single Page App), your API Key will be embedded in the Javascript code and visible in the browser's network tab.

**To secure your key:**
1.  Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
2.  Select your API Key.
3.  Under **Application restrictions**, select **HTTP referrers (websites)**.
4.  Add the URL of your deployed Cloud Run service (e.g., `https://postly-ai-xyz-uc.a.run.app/*`) to allow requests **only** from your app.
