const axios = require('axios');

const cabin_class = {
  "economy": "ECONOMY",
  "premium_economy": "PREMIUM_ECONOMY",
  "business": "BUSINESS",
  "first": "FIRST_CLASS",
}

async function getFlights(flightDetails) {
  try {
    const response = await axios.request({
      method: 'post',
      url: 'https://api.skypicker.com/umbrella/v2/graphql?featureName=SearchReturnItinerariesQuery',
      data: {
        "query": "query SearchReturnItinerariesQuery(\n  $search: SearchReturnInput\n  $filter: ItinerariesFilterInput\n  $options: ItinerariesOptionsInput\n  $conditions: Boolean!\n) {\n  returnItineraries(search: $search, filter: $filter, options: $options) {\n    __typename\n    ... on AppError {\n      error: message\n    }\n    ... on Itineraries {\n      server {\n        requestId\n        environment\n        packageVersion\n        serverToken\n      }\n      metadata {\n        eligibilityInformation {\n          baggageEligibilityInformation {\n            topFiveResultsBaggageEligibleForPrompt\n            numberOfBags\n          }\n          guaranteeAndRedirectsEligibilityInformation {\n            redirect {\n              anywhere\n              top10\n              isKiwiAvailable\n            }\n            guarantee {\n              anywhere\n              top10\n            }\n            combination {\n              anywhere\n              top10\n            }\n          }\n          kiwiBasicEligibility {\n            anywhere\n            top10\n          }\n          topThreeResortingOccurred\n          carriersDeeplinkEligibility\n          responseContainsKayakItinerary\n          paretoABTestEligible\n        }\n        carriers {\n          code\n          id\n        }\n        ...AirlinesFilter_data\n        ...CountriesFilter_data\n        ...WeekDaysFilter_data\n        ...TravelTip_data\n        ...Sorting_data\n        ...useSortingModes_data\n        ...PriceAlert_data\n        itinerariesCount\n        hasMorePending\n        missingProviders {\n          code\n        }\n        searchFingerprint\n        statusPerProvider {\n          provider {\n            id\n          }\n          errorHappened\n          errorMessage\n        }\n        hasTier1MarketItineraries\n        sharedItinerary {\n          __typename\n          ...TripInfo\n          ...ItineraryDebug @include(if: $conditions)\n          ... on ItineraryReturn {\n            ... on Itinerary {\n              __isItinerary: __typename\n              __typename\n              id\n              shareId\n              price {\n                amount\n                priceBeforeDiscount\n              }\n              priceEur {\n                amount\n              }\n              provider {\n                name\n                code\n                hasHighProbabilityOfPriceChange\n                contentProvider {\n                  code\n                }\n                id\n              }\n              bagsInfo {\n                includedCheckedBags\n                includedHandBags\n                hasNoBaggageSupported\n                hasNoCheckedBaggage\n                checkedBagTiers {\n                  tierPrice {\n                    amount\n                  }\n                  bags {\n                    weight {\n                      value\n                    }\n                  }\n                }\n                handBagTiers {\n                  tierPrice {\n                    amount\n                  }\n                  bags {\n                    weight {\n                      value\n                    }\n                  }\n                }\n                includedPersonalItem\n                personalItemTiers {\n                  tierPrice {\n                    amount\n                  }\n                  bags {\n                    weight {\n                      value\n                    }\n                    height {\n                      value\n                    }\n                    width {\n                      value\n                    }\n                    length {\n                      value\n                    }\n                  }\n                }\n              }\n              bookingOptions {\n                edges {\n                  node {\n                    token\n                    bookingUrl\n                    trackingPixel\n                    itineraryProvider {\n                      code\n                      name\n                      subprovider\n                      hasHighProbabilityOfPriceChange\n                      contentProvider {\n                        code\n                      }\n                      providerCategory\n                      id\n                    }\n                    price {\n                      amount\n                    }\n                    priceEur {\n                      amount\n                    }\n                    priceLocks {\n                      priceLocksCurr {\n                        default\n                        price {\n                          amount\n                          roundedFormattedValue\n                        }\n                      }\n                      priceLocksEur {\n                        default\n                        price {\n                          amount\n                          roundedFormattedValue\n                        }\n                      }\n                    }\n                    kiwiProduct\n                    disruptionTreatment\n                    usRulesApply\n                  }\n                }\n              }\n              travelHack {\n                isTrueHiddenCity\n                isVirtualInterlining\n                isThrowawayTicket\n              }\n              duration\n              pnrCount\n            }\n            legacyId\n            outbound {\n              id\n              sectorSegments {\n                guarantee\n                segment {\n                  id\n                  source {\n                    localTime\n                    utcTimeIso\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  destination {\n                    localTime\n                    utcTimeIso\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  duration\n                  type\n                  code\n                  carrier {\n                    id\n                    name\n                    code\n                  }\n                  operatingCarrier {\n                    id\n                    name\n                    code\n                  }\n                  cabinClass\n                  hiddenDestination {\n                    code\n                    name\n                    city {\n                      name\n                      id\n                    }\n                    country {\n                      name\n                      id\n                    }\n                    id\n                  }\n                  throwawayDestination {\n                    id\n                  }\n                }\n                layover {\n                  duration\n                  isBaggageRecheck\n                  isWalkingDistance\n                  transferDuration\n                  id\n                }\n              }\n              duration\n            }\n            inbound {\n              id\n              sectorSegments {\n                guarantee\n                segment {\n                  id\n                  source {\n                    localTime\n                    utcTimeIso\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  destination {\n                    localTime\n                    utcTimeIso\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  duration\n                  type\n                  code\n                  carrier {\n                    id\n                    name\n                    code\n                  }\n                  operatingCarrier {\n                    id\n                    name\n                    code\n                  }\n                  cabinClass\n                  hiddenDestination {\n                    code\n                    name\n                    city {\n                      name\n                      id\n                    }\n                    country {\n                      name\n                      id\n                    }\n                    id\n                  }\n                  throwawayDestination {\n                    id\n                  }\n                }\n                layover {\n                  duration\n                  isBaggageRecheck\n                  isWalkingDistance\n                  transferDuration\n                  id\n                }\n              }\n              duration\n            }\n            stopover {\n              nightsCount\n              arrival {\n                type\n                city {\n                  name\n                  id\n                }\n                id\n              }\n              departure {\n                type\n                city {\n                  name\n                  id\n                }\n                id\n              }\n              duration\n            }\n            lastAvailable {\n              seatsLeft\n            }\n            isRyanair\n            benefitsData {\n              automaticCheckinAvailable\n              instantChatSupportAvailable\n              disruptionProtectionAvailable\n              guaranteeAvailable\n              guaranteeFee {\n                roundedAmount\n              }\n              guaranteeFeeEur {\n                amount\n              }\n              searchReferencePrice {\n                roundedAmount\n              }\n            }\n            isAirBaggageBundleEligible\n            testEligibilityInformation {\n              paretoABTestNewItinerary\n            }\n          }\n          id\n        }\n        kayakEligibilityTest {\n          containsKayakWithNewRules\n          containsKayakWithCurrentRules\n          containsKayakAirlinesWithNewRules\n        }\n        extendedTrackingMetadata {\n          fullResponse {\n            allItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndWegoBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfWegoOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfFROnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndFRBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfU2OnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndU2BookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfVYOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndVYBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            filteredItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndWegoBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfWegoOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfU2OnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndU2BookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfFROnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndFRBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfVYOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndVYBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            airlineBreakdown {\n              carriers {\n                code\n                id\n              }\n              allItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndWegoBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfWegoOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfU2OnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndU2BookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfFROnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndFRBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfVYOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndVYBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n              filteredItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndWegoBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfWegoOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfU2OnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndU2BookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfFROnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndFRBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfVYOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndVYBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n            }\n          }\n          topTenInResponse {\n            allItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndWegoBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfWegoOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfU2OnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndU2BookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfFROnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndFRBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfVYOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndVYBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            filteredItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndWegoBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfWegoOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfU2OnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndU2BookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfFROnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndFRBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfVYOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndVYBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            airlineBreakdown {\n              carriers {\n                name\n                code\n                id\n              }\n              allItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndWegoBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfWegoOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfU2OnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndU2BookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfFROnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndFRBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfVYOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndVYBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n              filteredItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndWegoBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfWegoOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfU2OnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndU2BookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfFROnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndFRBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfVYOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndVYBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n            }\n          }\n        }\n      }\n      itineraries {\n        __typename\n        ...TripInfo\n        ...ItineraryDebug @include(if: $conditions)\n        ... on ItineraryReturn {\n          ... on Itinerary {\n            __isItinerary: __typename\n            __typename\n            id\n            shareId\n            price {\n              amount\n              priceBeforeDiscount\n            }\n            priceEur {\n              amount\n            }\n            provider {\n              name\n              code\n              hasHighProbabilityOfPriceChange\n              contentProvider {\n                code\n              }\n              id\n            }\n            bagsInfo {\n              includedCheckedBags\n              includedHandBags\n              hasNoBaggageSupported\n              hasNoCheckedBaggage\n              checkedBagTiers {\n                tierPrice {\n                  amount\n                }\n                bags {\n                  weight {\n                    value\n                  }\n                }\n              }\n              handBagTiers {\n                tierPrice {\n                  amount\n                }\n                bags {\n                  weight {\n                    value\n                  }\n                }\n              }\n              includedPersonalItem\n              personalItemTiers {\n                tierPrice {\n                  amount\n                }\n                bags {\n                  weight {\n                    value\n                  }\n                  height {\n                    value\n                  }\n                  width {\n                    value\n                  }\n                  length {\n                    value\n                  }\n                }\n              }\n            }\n            bookingOptions {\n              edges {\n                node {\n                  token\n                  bookingUrl\n                  trackingPixel\n                  itineraryProvider {\n                    code\n                    name\n                    subprovider\n                    hasHighProbabilityOfPriceChange\n                    contentProvider {\n                      code\n                    }\n                    providerCategory\n                    id\n                  }\n                  price {\n                    amount\n                  }\n                  priceEur {\n                    amount\n                  }\n                  priceLocks {\n                    priceLocksCurr {\n                      default\n                      price {\n                        amount\n                        roundedFormattedValue\n                      }\n                    }\n                    priceLocksEur {\n                      default\n                      price {\n                        amount\n                        roundedFormattedValue\n                      }\n                    }\n                  }\n                  kiwiProduct\n                  disruptionTreatment\n                  usRulesApply\n                }\n              }\n            }\n            travelHack {\n              isTrueHiddenCity\n              isVirtualInterlining\n              isThrowawayTicket\n            }\n            duration\n            pnrCount\n          }\n          legacyId\n          outbound {\n            id\n            sectorSegments {\n              guarantee\n              segment {\n                id\n                source {\n                  localTime\n                  utcTimeIso\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                destination {\n                  localTime\n                  utcTimeIso\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                duration\n                type\n                code\n                carrier {\n                  id\n                  name\n                  code\n                }\n                operatingCarrier {\n                  id\n                  name\n                  code\n                }\n                cabinClass\n                hiddenDestination {\n                  code\n                  name\n                  city {\n                    name\n                    id\n                  }\n                  country {\n                    name\n                    id\n                  }\n                  id\n                }\n                throwawayDestination {\n                  id\n                }\n              }\n              layover {\n                duration\n                isBaggageRecheck\n                isWalkingDistance\n                transferDuration\n                id\n              }\n            }\n            duration\n          }\n          inbound {\n            id\n            sectorSegments {\n              guarantee\n              segment {\n                id\n                source {\n                  localTime\n                  utcTimeIso\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                destination {\n                  localTime\n                  utcTimeIso\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                duration\n                type\n                code\n                carrier {\n                  id\n                  name\n                  code\n                }\n                operatingCarrier {\n                  id\n                  name\n                  code\n                }\n                cabinClass\n                hiddenDestination {\n                  code\n                  name\n                  city {\n                    name\n                    id\n                  }\n                  country {\n                    name\n                    id\n                  }\n                  id\n                }\n                throwawayDestination {\n                  id\n                }\n              }\n              layover {\n                duration\n                isBaggageRecheck\n                isWalkingDistance\n                transferDuration\n                id\n              }\n            }\n            duration\n          }\n          stopover {\n            nightsCount\n            arrival {\n              type\n              city {\n                name\n                id\n              }\n              id\n            }\n            departure {\n              type\n              city {\n                name\n                id\n              }\n              id\n            }\n            duration\n          }\n          lastAvailable {\n            seatsLeft\n          }\n          isRyanair\n          benefitsData {\n            automaticCheckinAvailable\n            instantChatSupportAvailable\n            disruptionProtectionAvailable\n            guaranteeAvailable\n            guaranteeFee {\n              roundedAmount\n            }\n            guaranteeFeeEur {\n              amount\n            }\n            searchReferencePrice {\n              roundedAmount\n            }\n          }\n          isAirBaggageBundleEligible\n          testEligibilityInformation {\n            paretoABTestNewItinerary\n          }\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment AirlinesFilter_data on ItinerariesMetadata {\n  carriers {\n    id\n    code\n    name\n  }\n}\n\nfragment CountriesFilter_data on ItinerariesMetadata {\n  stopoverCountries {\n    code\n    name\n    id\n  }\n}\n\nfragment ItineraryDebug on Itinerary {\n  __isItinerary: __typename\n  itineraryDebugData {\n    debug\n  }\n}\n\nfragment PrebookingStation on Station {\n  code\n  type\n  city {\n    name\n    id\n  }\n}\n\nfragment PriceAlert_data on ItinerariesMetadata {\n  priceAlertExists\n  existingPriceAlert {\n    id\n  }\n  searchFingerprint\n  hasMorePending\n  priceAlertsTopResults {\n    best {\n      price {\n        amount\n      }\n    }\n    cheapest {\n      price {\n        amount\n      }\n    }\n    fastest {\n      price {\n        amount\n      }\n    }\n    sourceTakeoffAsc {\n      price {\n        amount\n      }\n    }\n    destinationLandingAsc {\n      price {\n        amount\n      }\n    }\n  }\n}\n\nfragment Sorting_data on ItinerariesMetadata {\n  topResults {\n    best {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    cheapest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    fastest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    sourceTakeoffAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    destinationLandingAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n  }\n}\n\nfragment TravelTip_data on ItinerariesMetadata {\n  travelTips {\n    __typename\n    ... on TravelTipRadiusMoney {\n      radius\n      params {\n        name\n        value\n      }\n      savingMoney: saving {\n        amount\n        currency {\n          id\n          code\n          name\n        }\n        formattedValue\n      }\n      location {\n        __typename\n        id\n        legacyId\n        name\n        slug\n      }\n    }\n    ... on TravelTipRadiusTime {\n      radius\n      params {\n        name\n        value\n      }\n      saving\n      location {\n        __typename\n        id\n        legacyId\n        name\n        slug\n      }\n    }\n    ... on TravelTipRadiusSome {\n      radius\n      params {\n        name\n        value\n      }\n      location {\n        __typename\n        id\n        legacyId\n        name\n        slug\n      }\n    }\n    ... on TravelTipDateMoney {\n      dates {\n        start\n        end\n      }\n      params {\n        name\n        value\n      }\n      savingMoney: saving {\n        amount\n        currency {\n          id\n          code\n          name\n        }\n        formattedValue\n      }\n    }\n    ... on TravelTipDateTime {\n      dates {\n        start\n        end\n      }\n      params {\n        name\n        value\n      }\n      saving\n    }\n    ... on TravelTipDateSome {\n      dates {\n        start\n        end\n      }\n      params {\n        name\n        value\n      }\n    }\n    ... on TravelTipExtend {\n      destination {\n        __typename\n        id\n        name\n        slug\n      }\n      locations {\n        __typename\n        id\n        name\n        slug\n      }\n      price {\n        amount\n        currency {\n          id\n          code\n          name\n        }\n        formattedValue\n      }\n    }\n  }\n}\n\nfragment TripInfo on Itinerary {\n  __isItinerary: __typename\n  ... on ItineraryOneWay {\n    sector {\n      sectorSegments {\n        segment {\n          source {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n  ... on ItineraryReturn {\n    outbound {\n      sectorSegments {\n        segment {\n          source {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n          }\n          id\n        }\n      }\n      id\n    }\n    inbound {\n      sectorSegments {\n        segment {\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n  ... on ItineraryMulticity {\n    sectors {\n      sectorSegments {\n        segment {\n          source {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment WeekDaysFilter_data on ItinerariesMetadata {\n  inboundDays\n  outboundDays\n}\n\nfragment useSortingModes_data on ItinerariesMetadata {\n  topResults {\n    best {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    cheapest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    fastest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    sourceTakeoffAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    destinationLandingAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n  }\n}\n",
        "variables": {
          "search": {
            "itinerary": {
              "source": {
                "ids": [
                  `City:${flightDetails.current_city}_${flightDetails.current_country}` //"tirana_al"
                ]
              },
              "destination": {
                "ids": [
                  `City:${flightDetails.destination_city}_${flightDetails.destination_country}`
                ]
              },
              "outboundDepartureDate": {
                "start": `${flightDetails.dates_start}T00:00:00`, //"2025-07-19T00:00:00"
                "end": `${flightDetails.dates_start}T23:59:59` //"2025-07-19T23:59:59"
              },
              "inboundDepartureDate": {
                "start": `${flightDetails.dates_end}T00:00:00`,
                "end": `${flightDetails.dates_end}T23:59:59`
              }
            },
            "passengers": {
              "adults": flightDetails.passengers.adults,
              "children": flightDetails.passengers.children,
              "infants": flightDetails.passengers.infants,
              "adultsHoldBags": [
                ...Array.from({ length: flightDetails.passengers.adults }).map(() => 0)
              ],
              "adultsHandBags": [
                ...Array.from({ length: flightDetails.passengers.adults }).map(() => 0)
              ],
              "childrenHoldBags": [],
              "childrenHandBags": []
            },
            "cabinClass": {
              "cabinClass": cabin_class[flightDetails.flightClass],
              "applyMixedClasses": false
            }
          },
          "filter": {
            "allowReturnFromDifferentCity": true,
            "allowChangeInboundDestination": true,
            "allowChangeInboundSource": true,
            "allowDifferentStationConnection": true,
            "enableSelfTransfer": true,
            "enableThrowAwayTicketing": true,
            "enableTrueHiddenCity": true,
            "transportTypes": [
              "FLIGHT"
            ],
            "contentProviders": [
              "KIWI",
              "FRESH"
            ],
            "flightsApiLimit": 25,
            "limit": 10
          },
          "options": {
            "sortBy": "QUALITY",
            "mergePriceDiffRule": "INCREASED",
            "currency": "usd",
            "apiUrl": null,
            "locale": "en",
            "market": "al",
            "partner": "skypicker",
            "partnerMarket": "xx",
            "affilID": "skypicker",
            "storeSearch": false,
            "searchStrategy": "REDUCED",
            "abTestInput": {
              "priceElasticityGuarantee": "ENABLE",
              "baggageProtectionBundle": "ENABLE",
              "paretoProtectVanilla": "ENABLE",
              "guaranteeExpansionAirlinesVi": "DISABLE",
              "kiwiBasicThirdIteration": "C",
              "kayakWithoutBags": "DISABLE",
              "carriersDeeplinkResultsEnable": true,
              "carriersDeeplinkOnSEMEnable": true
            },
            "serverToken": null,
            "searchSessionId": null
          },
          "conditions": false
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      },
    })


    return response.data;
  } catch (error) {
    console.error(error);
  }

  return null;
}

async function parseFlightData(flightDetails, tripId) {
  console.log(flightDetails)
  try {
    const apiResponse = await getFlights(flightDetails);
    
    const flights = [];
    const itineraries = apiResponse.data.returnItineraries.itineraries;

    itineraries.forEach((itinerary, index) => {
      const bookingUrl = itinerary.bookingOptions?.edges?.[0]?.node?.bookingUrl || null;
      const fullBookingUrl = bookingUrl ? `https://www.kiwi.com${bookingUrl}` : null;
      const totalPrice = parseFloat(itinerary.price.amount);

      // Process outbound journey
      if (itinerary.outbound && itinerary.outbound.sectorSegments) {
        const outboundFlight = createJourneyRecord(
          itinerary.outbound.sectorSegments,
          {
            tripId,
            totalPrice,
            currency: 'USD',
            bookingReference: itinerary.shareId,
            bookingUrl: fullBookingUrl,
            isReturnFlight: false,
            itineraryIndex: index
          }
        );
        
        if (outboundFlight) {
          flights.push(outboundFlight);
        }
      }

      // Process inbound journey (return flight)
      if (itinerary.inbound && itinerary.inbound.sectorSegments) {
        const inboundFlight = createJourneyRecord(
          itinerary.inbound.sectorSegments,
          {
            tripId,
            totalPrice,
            currency: 'USD',
            bookingReference: itinerary.shareId,
            bookingUrl: fullBookingUrl,
            isReturnFlight: true,
            itineraryIndex: index
          }
        );
        
        if (inboundFlight) {
          flights.push(inboundFlight);
        }
      }
    });

    return flights;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function createJourneyRecord(sectorSegments, options) {
  if (!sectorSegments || sectorSegments.length === 0) {
    return null;
  }

  const {
    tripId,
    totalPrice,
    currency,
    bookingReference,
    bookingUrl,
    isReturnFlight,
    itineraryIndex
  } = options;

  // Get first and last segments for overall journey info
  const firstSegment = sectorSegments[0].segment;
  const lastSegment = sectorSegments[sectorSegments.length - 1].segment;

  // Calculate total journey duration
  const departureTime = new Date(firstSegment.source.localTime);
  const arrivalTime = new Date(lastSegment.destination.localTime);
  const totalDurationMinutes = (arrivalTime - departureTime) / (1000 * 60);

  // Build transit information
  const transitInfo = buildTransitInfo(sectorSegments);
  
  // Build flight segments details
  const segmentDetails = sectorSegments.map((sectorSegment, segmentIndex) => {
    const segment = sectorSegment.segment;
    const layover = sectorSegment.layover;
    
    return {
      segmentNumber: segmentIndex + 1,
      flightNumber: `${segment.carrier.code}${segment.code}`,
      airline: segment.carrier.name,
      departureAirport: segment.source.station.code,
      departureCity: segment.source.station.city.name,
      departureTime: new Date(segment.source.localTime).toISOString(),
      arrivalAirport: segment.destination.station.code,
      arrivalCity: segment.destination.station.city.name,
      arrivalTime: new Date(segment.destination.localTime).toISOString(),
      duration: segment.duration,
      cabinClass: segment.cabinClass,
      layover: layover ? {
        duration: layover.duration,
        durationFormatted: formatDuration(layover.duration),
        isBaggageRecheck: layover.isBaggageRecheck,
        isWalkingDistance: layover.isWalkingDistance
      } : null
    };
  });

  // Create comprehensive flight record
  return {
    id: null,
    trip_id: tripId,
    itinerary_index: itineraryIndex,
    
    // Overall journey information
    flight_number: createFlightNumberString(sectorSegments),
    airline: getMainAirline(sectorSegments),
    
    // Departure information (first segment)
    departure_date: departureTime.toISOString().split('T')[0],
    departure_time: departureTime.toTimeString().split(' ')[0],
    origin_airport: firstSegment.source.station.code,
    origin_city: firstSegment.source.station.city.name,
    
    // Arrival information (last segment)
    arrival_date: arrivalTime.toISOString().split('T')[0],
    arrival_time: arrivalTime.toTimeString().split(' ')[0],
    destination_airport: lastSegment.destination.station.code,
    destination_city: lastSegment.destination.station.city.name,
    
    // Journey details
    total_duration: totalDurationMinutes,
    total_duration_formatted: formatDuration(totalDurationMinutes * 60), // Convert back to seconds for formatting
    segments_count: sectorSegments.length,
    is_direct: sectorSegments.length === 1,
    
    // Transit information
    transit_airports: transitInfo.airports,
    transit_cities: transitInfo.cities,
    transit_times: transitInfo.times,
    transit_summary: transitInfo.summary,
    
    // Pricing and booking
    price: totalPrice,
    currency: currency,
    booking_reference: bookingReference,
    
    // Additional details
    seat_number: null,
    notes: createNotesWithTransitInfo(sectorSegments, bookingUrl, isReturnFlight),
    status: 'available',
    is_return_flight: isReturnFlight,
    
    // Detailed segment information
    segments: segmentDetails,
    
    created_at: new Date().toISOString()
  };
}

function buildTransitInfo(sectorSegments) {
  if (sectorSegments.length <= 1) {
    return {
      airports: [],
      cities: [],
      times: [],
      summary: 'Direct flight'
    };
  }

  const transitAirports = [];
  const transitCities = [];
  const transitTimes = [];

  // Get transit information from layovers
  for (let i = 0; i < sectorSegments.length - 1; i++) {
    const currentSegment = sectorSegments[i].segment;
    const nextLayover = sectorSegments[i].layover;
    
    const transitAirport = currentSegment.destination.station.code;
    const transitCity = currentSegment.destination.station.city.name;
    const transitDuration = nextLayover ? nextLayover.duration : 0;
    
    transitAirports.push(transitAirport);
    transitCities.push(transitCity);
    transitTimes.push({
      airport: transitAirport,
      city: transitCity,
      duration: transitDuration,
      durationFormatted: formatDuration(transitDuration)
    });
  }

  // Create summary string
  const summary = transitAirports.length > 0 
    ? `Transit via ${transitAirports.join(', ')} (${transitTimes.map(t => `${t.airport}: ${t.durationFormatted}`).join(', ')})`
    : 'Direct flight';

  return {
    airports: transitAirports,
    cities: transitCities,
    times: transitTimes,
    summary: summary
  };
}

function createFlightNumberString(sectorSegments) {
  return sectorSegments
    .map(segment => `${segment.segment.carrier.code}${segment.segment.code}`)
    .join(' → ');
}

function getMainAirline(sectorSegments) {
  // Get the airline of the first segment, or find the most common airline
  if (sectorSegments.length === 1) {
    return sectorSegments[0].segment.carrier.name;
  }
  
  // Count airlines
  const airlineCounts = {};
  sectorSegments.forEach(segment => {
    const airline = segment.segment.carrier.name;
    airlineCounts[airline] = (airlineCounts[airline] || 0) + 1;
  });
  
  // Return the most frequent airline, or first one if tied
  const sortedAirlines = Object.entries(airlineCounts)
    .sort(([,a], [,b]) => b - a);
  
  return sortedAirlines[0][0];
}

function createNotesWithTransitInfo(sectorSegments, bookingUrl, isReturnFlight) {
  let notes = isReturnFlight ? 'Return flight. ' : '';
  
  if (sectorSegments.length > 1) {
    const transitInfo = buildTransitInfo(sectorSegments);
    notes += `Multi-segment flight: ${transitInfo.summary}. `;
  }
  
  if (bookingUrl) {
    notes += `Booking URL: ${bookingUrl}`;
  }
  
  return notes.trim();
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

module.exports = {
  getFlights,
  parseFlightData
}