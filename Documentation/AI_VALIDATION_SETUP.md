# AI Image Validation Setup

## Overview
The Mosquito Alert+ project now includes AI-powered image validation using Roboflow Workflow API to automatically detect mosquito breeding sites in uploaded photos.

## Features
- ✅ Real-time image validation before submission
- ✅ AI confidence scoring
- ✅ Detailed reasoning for validation results
- ✅ Fallback to manual review if AI is unavailable
- ✅ Visual feedback during validation process

## Setup Instructions

### 1. Get Roboflow API Key

1. Visit [Roboflow](https://roboflow.com/)
2. Create a free account or log in
3. Go to your workspace settings
4. Find your API key in the API section
5. Copy your API key

### 2. Add API Key to Environment Variables

Open `server/.env` and update:

```env
ROBOFLOW_API_KEY=your_actual_roboflow_api_key_here
```

### 3. Configure Roboflow Workflow (Optional)

If you have your own trained model:

1. Update the workflow URL in `server/controllers/aiController.js`:
```javascript
url: 'https://serverless.roboflow.com/YOUR-WORKSPACE/workflows/YOUR-WORKFLOW',
```

Default workflow: `mosquito-breeding-sites/workflows/custom-workflow`

### 4. Restart the Server

```bash
cd server
npm run dev
```

## How It Works

### User Flow
1. User selects an image to upload
2. Image is sent to backend for AI validation
3. Roboflow AI analyzes the image (takes 3-5 seconds)
4. AI returns verdict: VALID or INVALID
5. User sees validation result with reasoning
6. If valid, user can proceed with form submission
7. If invalid, user must select a different image

### AI Validation Criteria
- Detects standing water
- Identifies containers (tires, pots, buckets)
- Recognizes drainage areas
- Checks for mosquito-friendly environments

### Fallback Behavior
If AI service is unavailable:
- Image is automatically accepted
- Flagged for manual admin review
- User can still submit report
- Admin will validate manually

## API Endpoints

### POST `/api/ai/validate-image`
Validates an image for mosquito breeding sites

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "isValid": true,
  "confidence": 87,
  "verdict": "VALID",
  "reasoning": [
    "✅ Detected 1 potential breeding site(s)",
    "   1. Standing water (87% confidence)",
    "💡 Image validated as mosquito breeding site"
  ],
  "detections": [...],
  "timestamp": "2025-12-26T...",
  "modelType": "Roboflow-Workflow"
}
```

## Testing Without Roboflow

If you want to test without a Roboflow account, the system will use the fallback mechanism:
- All images will be accepted
- Marked for manual review
- Admin must validate each report

## Cost Considerations

Roboflow Free Tier:
- 1,000 API calls per month (free)
- Sufficient for small-scale testing
- Upgrade for production use

## Troubleshooting

### "Roboflow API key not configured"
- Check `.env` file has `ROBOFLOW_API_KEY` set
- Restart the server after adding the key

### "AI validation service unavailable"
- Check your internet connection
- Verify API key is valid
- Check Roboflow service status
- System will fall back to manual review

### Image Always Rejected
- Ensure image shows water/containers
- Check image quality (not blurry)
- Verify Roboflow model is trained correctly

## Files Modified/Created

### Backend
- ✅ `server/controllers/aiController.js` - AI validation logic
- ✅ `server/routes/aiRoutes.js` - AI routes
- ✅ `server/server.js` - Added AI routes
- ✅ `server/.env` - Added ROBOFLOW_API_KEY

### Frontend
- ✅ `client/src/pages/CreateReport.js` - Added AI validation UI
- ✅ Visual feedback during validation
- ✅ AI result display with reasoning

## Benefits

1. **Reduced Manual Work**: Admin doesn't need to validate every image
2. **Better Data Quality**: Only relevant images are submitted
3. **User Guidance**: Users get instant feedback
4. **Spam Prevention**: Prevents irrelevant submissions
5. **Confidence Scoring**: Helps prioritize reports

## Future Enhancements

- [ ] Support multiple object detection
- [ ] Add severity prediction
- [ ] Implement image preprocessing
- [ ] Add batch validation
- [ ] Store AI results in database
- [ ] Generate AI analytics dashboard
