const axios = require('axios');

class AITravelRecommendationService {
  constructor(config = {}) {
    this.provider = config.provider || 'replicate'; // 'ollama' or 'replicate'
    this.ollamaUrl = config.ollamaUrl || 'http://localhost:11434';
    this.replicateApiToken = config.replicateApiToken || process.env.REPLICATE_API_TOKEN;
    this.model = config.model || 'llama2';
  }

  // Generate travel recommendations using Llama 2
  async generateRecommendations(userDetails, flights, stays) {
    const prompt = this.buildPrompt(userDetails, flights, stays);
    
    try {
      let aiResponse;
      if (this.provider === 'ollama') {
        aiResponse = await this.callOllama(prompt);
      } else if (this.provider === 'replicate') {
        aiResponse = await this.callReplicate(prompt);
      }
      
      // Parse AI response to extract recommendations
      const recommendations = this.parseAIRecommendations(
        aiResponse.recommendation,
        flights,
        stays,
        userDetails
      );
      
      return recommendations;
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      throw error;
    }
  }

  // Build a comprehensive prompt for Llama 2
  buildPrompt(userDetails, flights, stays) {
    const prompt = `You are a travel advisor helping a customer plan their trip. Based on the following information, provide personalized recommendations:

USER PREFERENCES:
- Destination: ${userDetails.destination_city}, ${userDetails.destination_country}
- Travel dates: ${userDetails.dates_start} to ${userDetails.dates_end}
- Budget: ${userDetails.budget}
- From: ${userDetails.current_city}, ${userDetails.current_country}
${userDetails.travel_style ? `- Travel style: ${userDetails.travel_style}` : ''}
${userDetails.travel_interests ? `- Interests: ${userDetails.travel_interests}` : ''}

AVAILABLE FLIGHTS (Top 5 options):
${this.formatFlights(flights.slice(0, 5))}

AVAILABLE ACCOMMODATIONS (Top 5 options):
${this.formatStays(stays.slice(0, 5))}

Based on this information, please provide:
1. THE BEST FLIGHT OPTION - Choose only ONE flight that best balances price, timing, and convenience
2. THE BEST ACCOMMODATION - Choose only ONE stay that perfectly matches the user's style and budget
3. WHY THESE ARE THE BEST CHOICES - Explain your reasoning
4. BUDGET BREAKDOWN showing estimated costs with these choices
5. KEY TRAVEL TIPS specific to their destination and travel dates

Be decisive and confident in your single recommendation for each category. Format your response in a clear, structured way.`;

    return prompt;
  }

  // Format flight data for the prompt
  formatFlights(flights) {
    return flights.map((flight, index) => {
      const outbound = flight.is_return_flight ? 'Return' : 'Outbound';
      return `
${index + 1}. ${outbound} Flight:
   - ${flight.airline} ${flight.flight_number}
   - Route: ${flight.origin_city} (${flight.origin_airport}) → ${flight.destination_city} (${flight.destination_airport})
   - Date: ${flight.departure_date} at ${flight.departure_time}
   - Price: ${flight.price} ${flight.currency}
   - Duration: ${this.calculateDuration(flight.departure_time, flight.arrival_time)}`;
    }).join('\n');
  }

  // Format flights with numbers for AI selection
  formatFlightsNumbered(flights) {
    return flights.map((flight, index) => {
      const outbound = flight.is_return_flight ? 'Return' : 'Outbound';
      return `${index + 1}. ${flight.airline} ${flight.flight_number} | ${flight.origin_airport}→${flight.destination_airport} | ${flight.departure_date} ${flight.departure_time} | ${flight.price}`;
    }).join('\n');
  }

  // Format stay data for the prompt
  formatStays(stays) {
    return stays.map((stay, index) => {
      return `
${index + 1}. ${stay.name}
   - Type: ${stay.type}
   - Location: ${stay.address}, ${stay.city}
   - Rating: ${stay.rating ? stay.rating + '/10' : 'Not rated'}
   - Total Price: ${stay.total_price} ${stay.currency} (${stay.nights_count} nights)
   ${stay.amenities ? `- Amenities: ${JSON.parse(stay.amenities).join(', ')}` : ''}
   - Website: ${stay.website}`;
    }).join('\n');
  }

  // Format stays with numbers for AI selection
  formatStaysNumbered(stays) {
    return stays.map((stay, index) => {
      const rating = stay.rating ? `${stay.rating}/10` : 'Unrated';
      return `${index + 1}. ${stay.name} | ${stay.type} | ${rating} | ${stay.total_price} ${stay.currency}`;
    }).join('\n');
  }

  // Parse AI response to extract flight and hotel selections
  parseAIRecommendations(aiText, flights, stays, userDetails) {
    try {
      // Extract flight selection
      const flightMatch = aiText.match(/FLIGHT_SELECTION:\s*(\d+)/);
      const hotelMatch = aiText.match(/HOTEL_SELECTION:\s*(\d+)/);
      const flightReasonMatch = aiText.match(/FLIGHT_REASON:\s*(.+)/);
      const hotelReasonMatch = aiText.match(/HOTEL_REASON:\s*(.+)/);
      
      let flightIndex = flightMatch ? parseInt(flightMatch[1]) - 1 : 0;
      let hotelIndex = hotelMatch ? parseInt(hotelMatch[1]) - 1 : 0;
      
      // Validate indices
      if (flightIndex < 0 || flightIndex >= flights.length) {
        flightIndex = 0; // Default to first
      }
      if (hotelIndex < 0 || hotelIndex >= stays.length) {
        hotelIndex = 0; // Default to first
      }
      
      // Get the actual objects
      const recommendedFlight = flights[flightIndex];
      const recommendedHotel = stays[hotelIndex];
      
      // Calculate budget analysis
      const budgetAnalysis = this.calculateBudgetAnalysis(recommendedFlight, recommendedHotel, userDetails);
      
      return {
        recommended_flight: recommendedFlight,
        recommended_hotel: recommendedHotel,
        flight_reason: flightReasonMatch ? flightReasonMatch[1].trim() : 'Selected based on optimal price and timing.',
        hotel_reason: hotelReasonMatch ? hotelReasonMatch[1].trim() : 'Selected based on rating and location.',
        budget_analysis: budgetAnalysis,
        ai_provider: this.provider,
        ai_model: this.model
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback to algorithmic selection
      const recommendedFlight = this.selectBestFlightObject(flights);
      const recommendedHotel = this.selectBestStayObject(stays);
      const budgetAnalysis = this.calculateBudgetAnalysis(recommendedFlight, recommendedHotel, userDetails);
      
      return {
        recommended_flight: recommendedFlight,
        recommended_hotel: recommendedHotel,
        flight_reason: 'AI parsing failed - selected based on price and timing algorithm.',
        hotel_reason: 'AI parsing failed - selected based on rating algorithm.',
        budget_analysis: budgetAnalysis,
        ai_provider: this.provider,
        ai_model: this.model,
        parsing_error: true
      };
    }
  }

  // Calculate budget analysis for recommended flight and stay
  calculateBudgetAnalysis(recommendedFlight, recommendedHotel, userDetails) {
    if (!recommendedFlight || !recommendedHotel || !userDetails.budget) {
      return {
        total_cost: 0,
        flight_cost: 0,
        accommodation_cost: 0,
        user_budget: userDetails.budget || 0,
        on_budget: false,
        budget_feedback: 'Unable to calculate budget analysis due to missing data.',
        remaining_budget: 0,
        budget_percentage_used: 0
      };
    }

    // Calculate costs
    const flightCost = recommendedFlight.price || 0;
    const accommodationCost = recommendedHotel.total_price || 0;
    const totalCost = flightCost + accommodationCost;
    
    // Budget analysis
    const userBudget = userDetails.budget;
    const onBudget = totalCost <= userBudget;
    const remainingBudget = userBudget - totalCost;
    const budgetPercentageUsed = (totalCost / userBudget) * 100;
    
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
        budgetFeedback = `Your selections exceed budget by $${overage.toFixed(2)}. The budget you entered is a bit non realistic for the place you want to travel too. Try to obtain a higher budget.`;
      } else {
        budgetFeedback = `Your selections are slightly over budget by $${overage.toFixed(2)}. You might want to adjust your budget or look for alternatives.`;
      }
    }

    return {
      total_cost: parseFloat(totalCost.toFixed(2)),
      flight_cost: parseFloat(flightCost.toFixed(2)),
      accommodation_cost: parseFloat(accommodationCost.toFixed(2)),
      user_budget: userBudget,
      on_budget: onBudget,
      budget_feedback: budgetFeedback,
      remaining_budget: parseFloat(remainingBudget.toFixed(2)),
      budget_percentage_used: parseFloat(budgetPercentageUsed.toFixed(1)),
      currency: recommendedFlight.currency || 'USD'
    };
  }

  // Select best flight and return the actual object
  selectBestFlightObject(flights) {
    if (!flights || flights.length === 0) return null;
    
    // Sort by a combination of price and departure time preference
    const scoredFlights = flights.map(flight => {
      const priceScore = 1 / (flight.price || 1);
      const timeScore = this.getTimeScore(flight.departure_time);
      const totalScore = (priceScore * 0.7) + (timeScore * 0.3);
      return { flight, score: totalScore };
    });
    
    return scoredFlights.sort((a, b) => b.score - a.score)[0].flight;
  }

  // Select best stay and return the actual object
  selectBestStayObject(stays) {
    if (!stays || stays.length === 0) return null;
    
    // Sort by rating primarily
    const scoredStays = stays.map(stay => {
      let score = 0;
      if (stay.rating) {
        score = stay.rating;
      }
      return { stay, score };
    });
    
    return scoredStays.sort((a, b) => b.score - a.score)[0].stay;
  }

  // Call Ollama API (for local Llama 2)
  async callOllama(prompt) {
    try {
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000
        }
      });

      return {
        recommendation: response.data.response,
        model: this.model,
        provider: 'ollama'
      };
    } catch (error) {
      console.error('Ollama API error:', error.message);
      throw new Error('Failed to generate recommendations using Ollama');
    }
  }

  // Call Replicate API (for cloud-based Llama 2)
  async callReplicate(prompt) {
    if (!this.replicateApiToken) {
      throw new Error('Replicate API token not provided');
    }

    try {
      // Create prediction
      const createResponse = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: 'a16z-infra/llama-2-70b-chat:2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf',
          input: {
            prompt: prompt,
            temperature: 0.7,
            top_p: 0.9,
            max_length: 2000,
            repetition_penalty: 1
          }
        },
        {
          headers: {
            'Authorization': `Token ${this.replicateApiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const predictionId = createResponse.data.id;

      // Poll for results
      let prediction = createResponse.data;
      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await axios.get(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              'Authorization': `Token ${this.replicateApiToken}`
            }
          }
        );
        
        prediction = statusResponse.data;
      }

      if (prediction.status === 'failed') {
        throw new Error('Replicate prediction failed');
      }

      console.log('Replicate prediction completed successfully:', prediction.output);

      return {
        recommendation: prediction.output.join(''),
        model: 'llama-2-70b',
        provider: 'replicate'
      };
    } catch (error) {
      console.error('Replicate API error:', error.message);
      throw new Error('Failed to generate recommendations using Replicate');
    }
  }

  // Helper functions
  calculateDuration(departure, arrival) {
    const dep = new Date(`2000-01-01T${departure}`);
    const arr = new Date(`2000-01-01T${arrival}`);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  calculateTripDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  // Generate a quick summary without AI
  generateQuickSummary(userDetails, flights, stays) {
    // Select the best flight and hotel objects
    const bestFlight = this.selectBestFlightObject(flights);
    const bestStay = this.selectBestStayObject(stays);
    
    // Calculate budget analysis
    const budgetAnalysis = this.calculateBudgetAnalysis(bestFlight, bestStay, userDetails);

    return {
      summary: {
        destination: `${userDetails.destination_city}, ${userDetails.destination_country}`,
        dates: `${userDetails.dates_start} to ${userDetails.dates_end}`,
        recommended_flight: bestFlight,
        recommended_hotel: bestStay,
        flight_reason: 'Selected based on optimal balance of price and departure time.',
        hotel_reason: 'Selected based on highest rating and suitable accommodation type.',
        budget_analysis: budgetAnalysis,
        quickTips: this.getDestinationTips(userDetails.destination_country)
      }
    };
  }

  // Helper to score departure times (prefer morning/early afternoon)
  getTimeScore(time) {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 8 && hour <= 12) return 1.0; // Morning: best
    if (hour >= 13 && hour <= 16) return 0.8; // Early afternoon: good
    if (hour >= 6 && hour <= 7) return 0.6; // Early morning: okay
    if (hour >= 17 && hour <= 20) return 0.5; // Evening: less preferred
    return 0.3; // Night/very early: least preferred
  }

  // Match accommodation type to travel style
  getStyleMatch(accommodationType, travelStyle) {
    const styleMap = {
      'luxury': { 'hotel': 1.0, 'apartment': 0.7, 'guesthouse': 0.5, 'hostel': 0.2 },
      'budget': { 'hostel': 1.0, 'guesthouse': 0.8, 'apartment': 0.6, 'hotel': 0.4 },
      'adventure': { 'hostel': 0.9, 'guesthouse': 0.8, 'apartment': 0.7, 'hotel': 0.5 },
      'cultural': { 'guesthouse': 0.9, 'apartment': 0.8, 'hotel': 0.7, 'hostel': 0.6 },
      'business': { 'hotel': 1.0, 'apartment': 0.8, 'guesthouse': 0.4, 'hostel': 0.1 },
      'family': { 'apartment': 1.0, 'hotel': 0.8, 'guesthouse': 0.5, 'hostel': 0.2 }
    };
    
    const style = travelStyle.toLowerCase();
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
      'default': [
        'Check visa requirements',
        'Get travel insurance',
        'Learn basic local phrases',
        'Research local customs'
      ]
    };

    return tips[country.toLowerCase()] || tips.default;
  }
}

module.exports = AITravelRecommendationService;