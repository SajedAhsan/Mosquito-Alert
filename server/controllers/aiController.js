const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

/**
 * AI Image Validation using Roboflow Workflow
 * Detects mosquito breeding sites using trained computer vision model
 */

/**
 * Validate image using Roboflow Workflow API
 */
async function validateWithRoboflow(imagePath) {
  try {
    // Try environment variable first, then use hardcoded as fallback
    const apiKey = process.env.ROBOFLOW_API_KEY || 'b7QBnc2Bf7oOsZ6N28Hs';

    console.log('🔑 API Key Status:', apiKey ? 'LOADED ✅' : 'MISSING ❌');
    console.log('🔑 API Key Length:', apiKey ? apiKey.length : 0);
    console.log('🔑 First 10 chars:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
    console.log('🔑 Source:', process.env.ROBOFLOW_API_KEY ? 'Environment Variable' : 'Hardcoded Fallback');

    if (!apiKey) {
      throw new Error('Roboflow API key not configured. Check .env file.');
    }

    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    console.log('📡 Calling Roboflow Workflow API...');

    // Call Roboflow Workflow API with base64 image
    const response = await axios({
      method: 'POST',
      url: 'https://serverless.roboflow.com/mosquito-breeding-sites/workflows/custom-workflow',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        api_key: apiKey,
        inputs: {
          image: {
            type: 'base64',
            value: base64Image
          }
        }
      }
    });

    console.log('✅ Roboflow response received:', JSON.stringify(response.data, null, 2));

    // Extract predictions from workflow response
    const outputs = response.data.outputs || [];
    let predictions = [];

    // Try to find predictions in the workflow structure
    if (outputs.length > 0 && outputs[0].predictions) {
      const predData = outputs[0].predictions;
      // Check if it's a classification result with predictions array
      if (predData.predictions && Array.isArray(predData.predictions)) {
        predictions = predData.predictions;
      } else if (predData.top) {
        // Single classification result
        predictions = [{
          class: predData.top,
          confidence: predData.confidence
        }];
      }
    }

    // Process results
    const detections = predictions.map(pred => ({
      class: pred.class || pred.predicted_class || pred.label,
      confidence: Math.round((pred.confidence || pred.score || 0) * 100),
      boundingBox: pred.x ? {
        x: pred.x,
        y: pred.y,
        width: pred.width,
        height: pred.height
      } : null
    })).filter(det => det.class); // Remove invalid detections

    // Filter out "not breeding spot" detections
    const validDetections = detections.filter(det =>
      !det.class.toLowerCase().includes('not breeding')
    );

    const hasBreedingSite = validDetections.length > 0;
    const maxConfidence = detections.length > 0
      ? Math.max(...detections.map(d => d.confidence))
      : 0;

    // Generate reasoning
    let reasoning = [];

    if (hasBreedingSite) {
      reasoning.push(`✅ Detected ${validDetections.length} potential breeding site(s)`);
      validDetections.forEach((det, idx) => {
        reasoning.push(`   ${idx + 1}. ${det.class} (${det.confidence}% confidence)`);
      });
      reasoning.push('💡 Image validated as mosquito breeding site');
    } else {
      reasoning.push('❌ No mosquito breeding sites detected in image');
      if (detections.length > 0) {
        reasoning.push(`   AI classified as: "${detections[0].class}" (${detections[0].confidence}% confidence)`);
      }
      reasoning.push('💡 Please upload a clear photo of a potential breeding site');
      reasoning.push('   Examples: standing water, containers, tires, gutters');
    }

    return {
      isValid: hasBreedingSite,
      confidence: maxConfidence,
      verdict: hasBreedingSite ? 'VALID' : 'INVALID',
      reasoning,
      detections: validDetections,
      allDetections: detections,
      metadata: {
        totalDetections: validDetections.length,
        totalPredictions: detections.length,
        workflowType: 'custom-workflow'
      }
    };

  } catch (error) {
    console.error('Roboflow Workflow Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * @route   POST /api/ai/validate-image
 * @desc    Validate if image shows mosquito breeding site using Roboflow AI
 * @access  Public (called before report creation)
 */
exports.validateImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image uploaded',
        isValid: false
      });
    }

    console.log(`🤖 Roboflow Workflow validation started for: ${req.file.filename}`);

    // Validate image with Roboflow
    const analysis = await validateWithRoboflow(req.file.path);

    // Log the result
    console.log(`🎯 Validation Result: ${analysis.verdict} (${analysis.confidence}% confidence)`);
    if (analysis.detections && analysis.detections.length > 0) {
      console.log(`   Detected: ${analysis.detections.map(d => d.class).join(', ')}`);
    }

    // Delete the temporary uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      isValid: analysis.isValid,
      confidence: analysis.confidence,
      verdict: analysis.verdict,
      reasoning: analysis.reasoning,
      detections: analysis.detections,
      metadata: analysis.metadata,
      timestamp: new Date(),
      modelType: 'Roboflow-Workflow'
    });

  } catch (error) {
    console.error('❌ Image Validation Error:', error.message);

    // Delete temp file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Fallback: Reject image if AI fails
    const fallbackResult = {
      isValid: false,
      confidence: 0,
      verdict: 'ERROR',
      reasoning: [
        '❌ AI validation failed',
        '⚠️ ' + error.message,
        '💡 Please try again or contact support'
      ],
      timestamp: new Date(),
      fallback: true,
      error: error.message
    };

    console.log('⚠️ Using fallback validation (rejecting image)');
    res.json(fallbackResult);
  }
};
