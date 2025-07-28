const axios = require('axios');

class AITravelRecommendationService {
  constructor(config = {}) {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.model = 'gemini-2.0-flash';
    this.provider = 'gemini';
  }

  // Generate travel recommendations using Gemini AI
  async generateRecommendations(userDetails, flights, stays) {
    // Validate inputs
    if (!flights || flights.length === 0) {
      throw new Error('No flights data provided');
    }
    
    if (!stays || stays.length === 0) {
      throw new Error('No accommodation data provided');
    }

    const outboundFlights = flights.filter(flight => !flight.is_return_flight);
    const returnFlights = flights.filter(flight => flight.is_return_flight);

    if (outboundFlights.length === 0) {
      throw new Error('No outbound flights found');
    }

    if (returnFlights.length === 0) {
      throw new Error('No return flights found');
    }

    const prompt = this.buildPrompt(userDetails, flights, stays);
    
    try {
      const aiResponse = await this.callGemini(prompt);
      
      // Parse AI response to extract recommendations
      const recommendations = this.parseAIRecommendations(
        aiResponse.recommendation,
        flights,
        stays,
        userDetails
      );

      console.log(recommendations)
      
      return recommendations;
    } catch (error) {
      // Enhanced fallback with more detailed logging
      return this.generateFallbackRecommendations(userDetails, flights, stays, error.message);
    }
  }

  // Enhanced fallback method
  generateFallbackRecommendations(userDetails, flights, stays, errorMessage) {
    const outboundFlights = flights.filter(flight => !flight.is_return_flight);
    const returnFlights = flights.filter(flight => flight.is_return_flight);
    
    const recommendedOutboundFlight = this.selectBestFlightObject(outboundFlights);
    const recommendedReturnFlight = this.selectBestFlightObject(returnFlights);
    const recommendedHotel = this.selectBestStayObject(stays);
    
    const budgetAnalysis = this.calculateBudgetAnalysisWithTwoFlights(
      recommendedOutboundFlight, 
      recommendedReturnFlight, 
      recommendedHotel, 
      userDetails
    );
    
    return {
      recommended_outbound_flight: recommendedOutboundFlight,
      recommended_return_flight: recommendedReturnFlight,
      recommended_hotel: recommendedHotel,
      outbound_flight_reason: 'Algorithmic selection based on price and timing optimization.',
      return_flight_reason: 'Algorithmic selection based on price and timing optimization.',
      hotel_reason: 'Algorithmic selection based on rating and amenities.',
      budget_analysis: budgetAnalysis,
      ai_provider: 'fallback',
      ai_model: 'algorithmic',
      fallback_used: true,
      original_error: errorMessage
    };
  }

  // Build a comprehensive prompt for Gemini
  buildPrompt(userDetails, flights, stays) {
    // Separate outbound and return flights
    const outboundFlights = flights.filter(flight => !flight.is_return_flight).slice(0, 5);
    const returnFlights = flights.filter(flight => flight.is_return_flight).slice(0, 5);

    // Validate we have the required data
    if (outboundFlights.length === 0 || returnFlights.length === 0) {
      throw new Error('Insufficient flight data for prompt generation');
    }

    const prompt = `You are a travel advisor helping a customer plan their trip. Based on the following information, provide personalized recommendations:

USER PREFERENCES:
- Destination: ${userDetails.destination_city || 'Not specified'}, ${userDetails.destination_country || 'Not specified'}
- Travel dates: ${userDetails.dates_start || 'Not specified'} to ${userDetails.dates_end || 'Not specified'}
- Budget: ${userDetails.budget || 'Not specified'}
- From: ${userDetails.current_city || 'Not specified'}, ${userDetails.current_country || 'Not specified'}
${userDetails.travel_style ? `- Travel style: ${userDetails.travel_style}` : ''}
${userDetails.travel_interests ? `- Interests: ${userDetails.travel_interests}` : ''}

AVAILABLE OUTBOUND FLIGHTS (Top ${outboundFlights.length} options):
${this.formatFlightsByType(outboundFlights, 'Outbound')}

AVAILABLE RETURN FLIGHTS (Top ${returnFlights.length} options):
${this.formatFlightsByType(returnFlights, 'Return')}

AVAILABLE ACCOMMODATIONS (Top ${stays.slice(0, 5).length} options):
${this.formatStays(stays.slice(0, 5))}

IMPORTANT: You must provide specific numerical selections for each category.

Based on this information, please provide:
1. THE BEST OUTBOUND FLIGHT - Choose only ONE outbound flight that best balances price, timing, and convenience
2. THE BEST RETURN FLIGHT - Choose only ONE return flight that best balances price, timing, and convenience
3. THE BEST ACCOMMODATION - Choose only ONE stay that perfectly matches the user's style and budget
4. WHY THESE ARE THE BEST CHOICES - Explain your reasoning for each selection
5. BUDGET BREAKDOWN showing estimated costs with these choices
6. KEY TRAVEL TIPS specific to their destination and travel dates

Be decisive and confident in your single recommendation for each category. Format your response in a clear, structured way.

CRITICAL: To help me parse your response, you MUST include these exact markers in your answer:
OUTBOUND_FLIGHT_SELECTION: [number from 1-${outboundFlights.length}]
RETURN_FLIGHT_SELECTION: [number from 1-${returnFlights.length}]
HOTEL_SELECTION: [number from 1-${Math.min(stays.length, 5)}]
OUTBOUND_FLIGHT_REASON: [your reasoning for the outbound flight choice]
RETURN_FLIGHT_REASON: [your reasoning for the return flight choice]
HOTEL_REASON: [your reasoning for the hotel choice]

Please ensure you include ALL of these markers with the exact format shown above.`;

    return prompt;
  }

  // Enhanced format flight data for the prompt by type
  formatFlightsByType(flights, type) {
    if (!flights || flights.length === 0) {
      return `No ${type.toLowerCase()} flights available`;
    }

    return flights.map((flight, index) => {
      // Handle missing data gracefully
      const airline = flight.airline || 'Unknown Airline';
      const flightNumber = flight.flight_number || 'N/A';
      const originCity = flight.origin_city || flight.origin_airport || 'Unknown';
      const destCity = flight.destination_city || flight.destination_airport || 'Unknown';
      const originAirport = flight.origin_airport || 'N/A';
      const destAirport = flight.destination_airport || 'N/A';
      const departureDate = flight.departure_date || 'N/A';
      const departureTime = flight.departure_time || 'N/A';
      const price = flight.price || 0;
      const currency = flight.currency || 'USD';
      const duration = this.calculateDuration(flight.departure_time, flight.arrival_time);

      return `
${index + 1}. ${type} Flight:
   - ${airline} ${flightNumber}
   - Route: ${originCity} (${originAirport}) → ${destCity} (${destAirport})
   - Date: ${departureDate} at ${departureTime}
   - Price: ${price} ${currency}
   - Duration: ${duration}`;
    }).join('\n');
  }

  // Enhanced format stay data for the prompt
  formatStays(stays) {
    if (!stays || stays.length === 0) {
      return 'No accommodations available';
    }

    return stays.map((stay, index) => {
      const name = stay.name || 'Unnamed Property';
      const type = stay.type || 'Unknown Type';
      const address = stay.address || 'Address not provided';
      const city = stay.city || 'City not specified';
      const rating = stay.rating ? `${stay.rating}/10` : 'Not rated';
      const totalPrice = stay.total_price || 0;
      const currency = stay.currency || 'USD';
      const nightsCount = stay.nights_count || 'N/A';
      const website = stay.website || 'Website not available';
      
      let amenitiesText = '';
      if (stay.amenities) {
        try {
          const amenities = typeof stay.amenities === 'string' ? JSON.parse(stay.amenities) : stay.amenities;
          if (Array.isArray(amenities) && amenities.length > 0) {
            amenitiesText = `\n   - Amenities: ${amenities.join(', ')}`;
          }
        } catch (e) {
          // If amenities parsing fails, skip it
        }
      }

      return `
${index + 1}. ${name}
   - Type: ${type}
   - Location: ${address}, ${city}
   - Rating: ${rating}
   - Total Price: ${totalPrice} ${currency} (${nightsCount} nights)${amenitiesText}
   - Website: ${website}`;
    }).join('\n');
  }

  // FIXED: Enhanced parsing with better error handling and logging
  parseAIRecommendations(aiText, flights, stays, userDetails) {
    try {
      // Separate flights by type
      const outboundFlights = flights.filter(flight => !flight.is_return_flight);
      const returnFlights = flights.filter(flight => flight.is_return_flight);

      // Extract selections with more flexible regex
      const outboundFlightMatch = aiText.match(/OUTBOUND_FLIGHT_SELECTION:\s*[\[\(]?(\d+)[\]\)]?/i);
      const returnFlightMatch = aiText.match(/RETURN_FLIGHT_SELECTION:\s*[\[\(]?(\d+)[\]\)]?/i);
      const hotelMatch = aiText.match(/HOTEL_SELECTION:\s*[\[\(]?(\d+)[\]\)]?/i);
      
      // Extract reasons with more flexible patterns
      const outboundFlightReasonMatch = aiText.match(/OUTBOUND_FLIGHT_REASON:\s*(.+?)(?=\n\n|RETURN_FLIGHT_REASON|HOTEL_REASON|$)/s);
      const returnFlightReasonMatch = aiText.match(/RETURN_FLIGHT_REASON:\s*(.+?)(?=\n\n|HOTEL_REASON|$)/s);
      const hotelReasonMatch = aiText.match(/HOTEL_REASON:\s*(.+?)(?=\n\n|$)/s);
      
      // Get indices (subtract 1 for 0-based array)
      let outboundFlightIndex = outboundFlightMatch ? parseInt(outboundFlightMatch[1]) - 1 : 0;
      let returnFlightIndex = returnFlightMatch ? parseInt(returnFlightMatch[1]) - 1 : 0;
      let hotelIndex = hotelMatch ? parseInt(hotelMatch[1]) - 1 : 0;
      
      // Validate indices
      if (outboundFlightIndex < 0 || outboundFlightIndex >= outboundFlights.length) {
        outboundFlightIndex = 0;
      }
      if (returnFlightIndex < 0 || returnFlightIndex >= returnFlights.length) {
        returnFlightIndex = 0;
      }
      if (hotelIndex < 0 || hotelIndex >= stays.length) {
        hotelIndex = 0;
      }
      
      // Get the actual objects
      const recommendedOutboundFlight = outboundFlights[outboundFlightIndex];
      const recommendedReturnFlight = returnFlights[returnFlightIndex];
      const recommendedHotel = stays[hotelIndex];
      
      // FIXED: Better validation of selected objects
      if (!recommendedOutboundFlight) {
        throw new Error('Outbound flight recommendation could not be resolved');
      }
      
      if (!recommendedReturnFlight) {
        throw new Error('Return flight recommendation could not be resolved');
      }
      
      if (!recommendedHotel) {
        throw new Error('Hotel recommendation could not be resolved');
      }
      
      // Calculate budget analysis with both flights
      const budgetAnalysis = this.calculateBudgetAnalysisWithTwoFlights(
        recommendedOutboundFlight, 
        recommendedReturnFlight, 
        recommendedHotel, 
        userDetails
      );
      
      const result = {
        recommended_outbound_flight: recommendedOutboundFlight,
        recommended_return_flight: recommendedReturnFlight,
        recommended_hotel: recommendedHotel,
        outbound_flight_reason: outboundFlightReasonMatch ? outboundFlightReasonMatch[1].trim() : 'Selected based on optimal price and timing.',
        return_flight_reason: returnFlightReasonMatch ? returnFlightReasonMatch[1].trim() : 'Selected based on optimal price and timing.',
        hotel_reason: hotelReasonMatch ? hotelReasonMatch[1].trim() : 'Selected based on rating and location.',
        budget_analysis: budgetAnalysis,
        ai_provider: this.provider,
        ai_model: this.model,
        full_ai_response: aiText,
        parsing_successful: true
      };
      
      return result;
    } catch (error) {
      // Enhanced fallback
      throw new Error(`Parsing error: ${error.message}`);
    }
  }

  // Enhanced API call with better error handling
  async callGemini(prompt) {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not provided. Please set GEMINI_API_KEY environment variable or pass it in config.');
    }

    try {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
      
      const headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.geminiApiKey
      };
      
      const payload = {
        "contents": [
          {
            "parts": [
              {
                "text": prompt
              }
            ]
          }
        ],
        "generationConfig": {
          "temperature": 0.3, // Lower temperature for more consistent parsing
          "topP": 0.9,
          "maxOutputTokens": 3000, // Increased for more detailed responses
          "candidateCount": 1
        }
      };

      const response = await axios.post(url, payload, { 
        headers,
        timeout: 30000 // 30 second timeout
      });

      // Extract the generated text from Gemini's response
      let recommendation = '';
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          recommendation = candidate.content.parts[0].text;
        }
      }

      if (!recommendation) {
        throw new Error('No valid response from Gemini API - empty recommendation');
      }

      return {
        recommendation: recommendation,
        model: this.model,
        provider: this.provider
      };
    } catch (error) {
      // Provide more specific error messages
      if (error.response?.status === 400) {
        throw new Error(`Invalid request to Gemini API: ${error.response.data?.error?.message || error.message}`);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid or missing Gemini API key');
      } else if (error.response?.status === 403) {
        throw new Error('Gemini API access forbidden - check your API key permissions');
      } else if (error.response?.status === 429) {
        throw new Error('Gemini API rate limit exceeded - please try again later');
      } else {
        throw new Error(`Failed to generate recommendations using Gemini: ${error.message}`);
      }
    }
  }

  // FIXED: Better budget analysis calculation
  calculateBudgetAnalysisWithTwoFlights(outboundFlight, returnFlight, recommendedHotel, userDetails) {
    // Validate input parameters
    if (!outboundFlight || !returnFlight || !recommendedHotel) {
      return {
        total_cost: 0,
        outbound_flight_cost: 0,
        return_flight_cost: 0,
        total_flight_cost: 0,
        accommodation_cost: 0,
        user_budget: userDetails?.budget || 0,
        on_budget: false,
        budget_feedback: 'Unable to calculate budget analysis due to missing flight or hotel data.',
        remaining_budget: 0,
        budget_percentage_used: 0
      };
    }

    if (!userDetails?.budget) {
      return {
        total_cost: 0,
        outbound_flight_cost: 0,
        return_flight_cost: 0,
        total_flight_cost: 0,
        accommodation_cost: 0,
        user_budget: 0,
        on_budget: false,
        budget_feedback: 'Unable to calculate budget analysis - no budget provided.',
        remaining_budget: 0,
        budget_percentage_used: 0
      };
    }

    // Calculate costs with proper fallbacks
    const outboundFlightCost = parseFloat(outboundFlight.price) || 0;
    const returnFlightCost = parseFloat(returnFlight.price) || 0;
    const totalFlightCost = outboundFlightCost + returnFlightCost;
    const accommodationCost = parseFloat(recommendedHotel.total_price) || 0;
    const totalCost = totalFlightCost + accommodationCost;
    
    // Budget analysis
    const userBudget = parseFloat(userDetails.budget) || 0;
    const onBudget = totalCost <= userBudget;
    const remainingBudget = userBudget - totalCost;
    const budgetPercentageUsed = userBudget > 0 ? (totalCost / userBudget) * 100 : 100;
    
    // Generate feedback
    let budgetFeedback;
    if (onBudget) {
      if (remainingBudget > userBudget * 0.3) {
        budgetFeedback = `Great news! Your selections are well within budget with $${remainingBudget.toFixed(2)} remaining for activities, meals, and shopping.`;
      } else if (remainingBudget > userBudget * 0.1) {
        budgetFeedback = `Perfect! Your selections fit within budget with $${remainingBudget.toFixed(2)} left for experiences and dining.`;
      } else {
        budgetFeedback = `Your selections are within budget with $${remainingBudget.toFixed(2)} remaining. Consider this for meals and local transport.`;
      }
    } else {
      const overage = Math.abs(remainingBudget);
      if (overage > userBudget * 0.2) {
        budgetFeedback = `Your selections exceed budget by $${overage.toFixed(2)}. The budget you entered may be unrealistic for this destination. Consider increasing your budget.`;
      } else {
        budgetFeedback = `Your selections are slightly over budget by $${overage.toFixed(2)}. You might want to adjust your budget or look for alternatives.`;
      }
    }

    return {
      total_cost: parseFloat(totalCost.toFixed(2)),
      outbound_flight_cost: parseFloat(outboundFlightCost.toFixed(2)),
      return_flight_cost: parseFloat(returnFlightCost.toFixed(2)),
      total_flight_cost: parseFloat(totalFlightCost.toFixed(2)),
      accommodation_cost: parseFloat(accommodationCost.toFixed(2)),
      user_budget: userBudget,
      on_budget: onBudget,
      budget_feedback: budgetFeedback,
      remaining_budget: parseFloat(remainingBudget.toFixed(2)),
      budget_percentage_used: parseFloat(budgetPercentageUsed.toFixed(1)),
      currency: outboundFlight.currency || 'USD'
    };
  }

  // FIXED: Better flight selection algorithm
  selectBestFlightObject(flights) {
    if (!flights || flights.length === 0) {
      return null;
    }
    
    // Sort by a combination of price and departure time preference
    const scoredFlights = flights.map(flight => {
      const price = parseFloat(flight.price) || 999999;
      const priceScore = price > 0 ? 1000 / price : 0; // Higher score for lower price
      const timeScore = this.getTimeScore(flight.departure_time);
      const totalScore = (priceScore * 0.7) + (timeScore * 0.3);
      
      return { flight, score: totalScore };
    });
    
    const bestFlight = scoredFlights.sort((a, b) => b.score - a.score)[0].flight;
    
    return bestFlight;
  }

  // FIXED: Better stay selection algorithm
  selectBestStayObject(stays) {
    if (!stays || stays.length === 0) {
      return null;
    }
    
    // Sort by rating primarily, then by price
    const scoredStays = stays.map(stay => {
      let score = 0;
      
      // Rating score (weighted heavily)
      if (stay.rating && stay.rating > 0) {
        score = parseFloat(stay.rating) * 10; // Weight rating heavily
      } else {
        score = 50; // Default score for unrated properties
      }
      
      // Price score (prefer reasonable prices, penalize both free and very expensive)
      const price = parseFloat(stay.total_price) || 0;
      if (price === 0) {
        // Free stays are suspicious, lower the score but don't eliminate
        score += 20;
      } else if (price < 500) {
        // Reasonable price range
        score += (500 - price) / 10; // Bonus for lower price
      } else {
        // Expensive stays get penalty
        score -= (price - 500) / 20;
      }
      
      return { stay, score };
    });
    
    const bestStay = scoredStays.sort((a, b) => b.score - a.score)[0].stay;
    
    return bestStay;
  }

  // Helper functions
  calculateDuration(departure, arrival) {
    if (!departure || !arrival) return 'Duration unknown';
    
    try {
      const dep = new Date(`2000-01-01T${departure}`);
      const arr = new Date(`2000-01-01T${arrival}`);
      let diff = arr - dep;
      
      // Handle overnight flights
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000; // Add 24 hours
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch (error) {
      return 'Duration unknown';
    }
  }

  getTimeScore(time) {
    if (!time) return 0.3;
    
    try {
      const hour = parseInt(time.split(':')[0]);
      if (hour >= 8 && hour <= 12) return 1.0; // Morning: best
      if (hour >= 13 && hour <= 16) return 0.8; // Early afternoon: good
      if (hour >= 6 && hour <= 7) return 0.6; // Early morning: okay
      if (hour >= 17 && hour <= 20) return 0.5; // Evening: less preferred
      return 0.3; // Night/very early: least preferred
    } catch (error) {
      return 0.3;
    }
  }

  // Additional utility methods (keeping the rest of your existing methods)
  calculateTripDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  generateQuickSummary(userDetails, flights, stays) {
    const outboundFlights = flights.filter(flight => !flight.is_return_flight);
    const returnFlights = flights.filter(flight => flight.is_return_flight);
    
    const bestOutboundFlight = this.selectBestFlightObject(outboundFlights);
    const bestReturnFlight = this.selectBestFlightObject(returnFlights);
    const bestStay = this.selectBestStayObject(stays);
    
    const budgetAnalysis = this.calculateBudgetAnalysisWithTwoFlights(
      bestOutboundFlight, 
      bestReturnFlight, 
      bestStay, 
      userDetails
    );

    return {
      summary: {
        destination: `${userDetails.destination_city}, ${userDetails.destination_country}`,
        dates: `${userDetails.dates_start} to ${userDetails.dates_end}`,
        recommended_outbound_flight: bestOutboundFlight,
        recommended_return_flight: bestReturnFlight,
        recommended_hotel: bestStay,
        outbound_flight_reason: 'Selected based on optimal balance of price and departure time.',
        return_flight_reason: 'Selected based on optimal balance of price and departure time.',
        hotel_reason: 'Selected based on highest rating and suitable accommodation type.',
        budget_analysis: budgetAnalysis,
        quickTips: this.getDestinationTips(userDetails.destination_country)
      }
    };
  }

  getStyleMatch(accommodationType, travelStyle) {
    const styleMap = {
      'luxury': { 'hotel': 1.0, 'apartment': 0.7, 'guesthouse': 0.5, 'hostel': 0.2 },
      'budget': { 'hostel': 1.0, 'guesthouse': 0.8, 'apartment': 0.6, 'hotel': 0.4 },
      'adventure': { 'hostel': 0.9, 'guesthouse': 0.8, 'apartment': 0.7, 'hotel': 0.5 },
      'cultural': { 'guesthouse': 0.9, 'apartment': 0.8, 'hotel': 0.7, 'hostel': 0.6 },
      'business': { 'hotel': 1.0, 'apartment': 0.8, 'guesthouse': 0.4, 'hostel': 0.1 },
      'family': { 'apartment': 1.0, 'hotel': 0.8, 'guesthouse': 0.5, 'hostel': 0.2 }
    };
    
    const style = travelStyle?.toLowerCase();
    return styleMap[style]?.[accommodationType] || 0.5;
  }

  getDestinationTips(country) {
    const tips = {
      'albania': [
        'Currency: Albanian Lek (ALL)',
        'Best time: May-September for warm weather',
        'Don\'t miss: Albanian Riviera beaches',
        'Local transport: Buses are affordable'
      ],
      'austria': [
        'Currency: Euro (EUR)',
        'Best time: May-September for sightseeing, December-March for skiing',
        'Don\'t miss: Schönbrunn Palace, Salzburg, Hallstatt',
        'Local transport: Excellent public transport system'
      ],
      'default': [
        'Check visa requirements',
        'Get travel insurance',
        'Learn basic local phrases',
        'Research local customs'
      ]
    };

    return tips[country?.toLowerCase()] || tips.default;
  }
}

module.exports = AITravelRecommendationService;