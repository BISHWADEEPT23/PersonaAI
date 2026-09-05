# PersonaAI: Behavioral Sanctuary

A privacy-first behavioral sanctuary engine deployed on Google Cloud Run, featuring multimodal OCR, transcription, and 4-lens perspective reframing.

## 1. Environment & Prerequisites

1. Install the [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install).
2. Authenticate and set your active project:
   ```bash
   gcloud auth login
   gcloud config set project <YOUR_PROJECT_ID>
   ```
3. Enable the required Google Cloud APIs:
   ```bash
   gcloud services enable run.googleapis.com secretmanager.googleapis.com firestore.googleapis.com
   ```

## 2. Database Security Configuration

Provision Cloud Firestore in Native mode. To enforce strict Zero-Trust Isolation (owner-bound access), deploy the following `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
*Deploy these rules via the Firebase CLI:* `firebase deploy --only firestore:rules`

## 3. Secret Management Setup

Create and populate the `GEMINI_API_KEY` in Google Cloud Secret Manager to prevent hardcoded credentials from reaching the codebase.

```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the default Cloud Run service account access to read the secret
# Note: Replace <YOUR_PROJECT_NUMBER> with your actual numeric Google Cloud Project Number
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:<YOUR_PROJECT_NUMBER>-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 4. Cloud Run Deployment Flow

Deploy the containerized application directly to Google Cloud Run from your source code:

```bash
gcloud run deploy persona-ai-sanctuary \
  --source . \
  --region <YOUR_REGION> \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

## 5. Required Campaign Labeling

To register the service for automated challenge verification, apply the mandatory resource label using the following command:

```bash
gcloud run services update persona-ai-sanctuary \
  --region <YOUR_REGION> \
  --update-labels=dev-tutorial=cloud-run-ai-challenge
```
