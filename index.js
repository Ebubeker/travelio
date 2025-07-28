require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { getFlights, parseFlightData } = require('./flights.js');
const { parseBookingResponseToStays } = require('./stays.js');
const AITravelRecommendationService = require('./ai-service.js');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer();

const aiService = new AITravelRecommendationService();

app.use(express.json());

app.post('/user-details', upload.none(), async (req, res) => {
  try {
    const {
      destination_city,
      destination_country,
      budget,
      dates_start,
      dates_end,
      travel_style,
      travel_interests,
      current_city,
      current_country,
      enable_ai = true
    } = req.body;

    const requiredFields = [
      'destination_city',
      'destination_country',
      'budget',
      'dates_start',
      'dates_end',
      'current_city',
      'current_country'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields
      });
    }

    const userDetails = {
      destination_city,
      destination_country,
      budget: parseFloat(budget),
      dates_start,
      dates_end,
      current_city,
      current_country,
      ...(travel_style && { travel_style }),
      ...(travel_interests && { travel_interests })
    };

    // console.log('Processing travel request for:', userDetails);

    // Fetch flight and stay data in parallel
    console.log('Fetching flights and stays...');
    const [flightData, stays] = await Promise.all([
      parseFlightData(userDetails, "trip-1"),
      parseBookingResponseToStays(userDetails)
    ]);

    console.log(`Found ${flightData.length} flights and ${stays.length} stays`);

    // Generate AI recommendations if enabled
    let aiRecommendations = null;
    let quickSummary = null;

    if (enable_ai && enable_ai !== 'false') {
      try {
        console.log('Generating AI recommendations...');
        aiRecommendations = await aiService.generateRecommendations(
          userDetails,
          flightData,
          stays
        );
        console.log('AI recommendations generated successfully');
      } catch (aiError) {
        console.error('AI recommendation error:', aiError.message);
        // Fall back to quick summary if AI fails
        quickSummary = aiService.generateQuickSummary(userDetails, flightData, stays);
      }
    } else {
      // Generate quick summary without AI
      quickSummary = aiService.generateQuickSummary(userDetails, flightData, stays);
    }

    // Prepare response
    const response = {
      userDetails,
      flights: flightData,
      stays: stays,
      ...(aiRecommendations && {
        recommended_outbound_flight: aiRecommendations.recommended_outbound_flight,
        recommended_return_flight: aiRecommendations.recommended_return_flight,
        recommended_hotel: aiRecommendations.recommended_hotel,
        outbound_flight_reason: aiRecommendations.outbound_flight_reason,
        return_flight_reason: aiRecommendations.return_flight_reason,
        hotel_reason: aiRecommendations.hotel_reason,
        budget_analysis: aiRecommendations.budget_analysis,
        ai_analysis: {
          provider: aiRecommendations.ai_provider,
          model: aiRecommendations.ai_model,
          parsing_error: aiRecommendations.parsing_error || false
        }
      }),
      ...(quickSummary && !aiRecommendations && {
        recommended_flight: quickSummary.summary.recommended_flight,
        recommended_hotel: quickSummary.summary.recommended_hotel,
        flight_reason: quickSummary.summary.flight_reason,
        hotel_reason: quickSummary.summary.hotel_reason,
        budget_analysis: quickSummary.summary.budget_analysis,
        quick_tips: quickSummary.summary.quickTips
      }),
      metadata: {
        flightCount: flightData.length,
        stayCount: stays.length,
        aiEnabled: enable_ai && enable_ai !== 'false',
        timestamp: new Date().toISOString()
      }
    };

    console.log('Request processed successfully');
    res.json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// New endpoint for fetching flights only
app.post('/flights', upload.none(), async (req, res) => {
  try {
    const {
      destination_city,
      destination_country,
      dates_start,
      dates_end,
      current_city,
      current_country,
      budget
    } = req.body;

    const requiredFields = [
      'destination_city',
      'destination_country',
      'dates_start',
      'dates_end',
      'current_city',
      'current_country'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields
      });
    }

    const userDetails = {
      destination_city,
      destination_country,
      dates_start,
      dates_end,
      current_city,
      current_country,
      ...(budget && { budget: parseFloat(budget) })
    };

    console.log('Fetching flights for:', userDetails);

    const flightData = await parseFlightData(userDetails, "trip-1");

    console.log(`Found ${flightData.length} flights`);

    res.json({
      flights: flightData,
      metadata: {
        flightCount: flightData.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({
      error: 'Failed to fetch flights',
      message: error.message
    });
  }
});

// New endpoint for fetching stays only
app.post('/stays', upload.none(), async (req, res) => {
  try {
    const {
      destination_city,
      destination_country,
      dates_start,
      dates_end,
      budget
    } = req.body;

    const requiredFields = [
      'destination_city',
      'destination_country',
      'dates_start',
      'dates_end'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields
      });
    }

    const userDetails = {
      destination_city,
      destination_country,
      dates_start,
      dates_end,
      ...(budget && { budget: parseFloat(budget) })
    };

    console.log('Fetching stays for:', userDetails);

    const stays = await parseBookingResponseToStays(userDetails);

    console.log(`Found ${stays.length} stays`);

    res.json({
      stays: stays,
      metadata: {
        stayCount: stays.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching stays:', error);
    res.status(500).json({
      error: 'Failed to fetch stays',
      message: error.message
    });
  }
});

app.post('/ai-recommendations', upload.none(), async (req, res) => {
  try {
    const { userDetails, flights, stays } = req.body;

    if (!userDetails || !flights || !stays) {
      return res.status(400).json({
        error: 'Missing required data',
        required: ['userDetails', 'flights', 'stays']
      });
    }

    console.log('Generating AI recommendations for provided data...');

    const recommendations = await aiService.generateRecommendations(
      userDetails,
      flights,
      stays
    );

    res.json({
      recommendations,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate AI recommendations',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    aiProvider: process.env.AI_PROVIDER || 'ollama',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Flight app backend server running on port ${PORT}`);
  console.log(`Endpoints available:`);
  console.log(`  - POST http://localhost:${PORT}/user-details`);
  console.log(`  - POST http://localhost:${PORT}/flights`);
  console.log(`  - POST http://localhost:${PORT}/stays`);
  console.log(`  - POST http://localhost:${PORT}/ai-recommendations`);
  console.log(`  - GET  http://localhost:${PORT}/health`);
  console.log(`AI Provider: ${'replicate'}`);
});

module.exports = app;