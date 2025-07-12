const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getCountryName } = require('./countrynames');

const findStays = async (userDetails) => {
  try {
    var axios = require("axios").default;

    const searchOptionsDestination = {
      method: 'POST',
      url: 'https://www.booking.com/dml/graphql?lang=en-us',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'AutoComplete',
        variables: {
          input: {
            prefixQuery: `${userDetails.destination_city}, ${getCountryName(userDetails.destination_country)}`,
            nbSuggestions: 20,
            // filters: {
            //   destTypes: ['CITY']
            // },
            fallbackConfig: {
              mergeResults: true,
              nbMaxMergedResults: 6,
              nbMaxThirdPartyResults: 3,
              sources: ['GOOGLE', 'HERE']
            },
            requestContext: {
              pageviewId: '2bf16a94f75e00ff'
            }
          }
        },
        extensions: {},
        query: `query AutoComplete($input: AutoCompleteRequestInput!) {
          autoCompleteSuggestions(input: $input) {
            results {
              destination {
                countryCode
                destId
                destType
                latitude
                longitude
                __typename
              }
              displayInfo {
                imageUrl
                label
                labelComponents {
                  name
                  type
                  __typename
                }
                showEntireHomesCheckbox
                title
                subTitle
                __typename
              }
              metaData {
                isSkiItem
                langCode
                maxLosData {
                  extendedLoS
                  __typename
                }
                metaMatches {
                  id
                  text
                  type
                  __typename
                }
                roundTrip
                webFilters
                autocompleteResultId
                autocompleteResultSource
                __typename
              }
              __typename
            }
            __typename
          }
        }`
      }
    };

    const searchResponseDestination = await axios.request(searchOptionsDestination);

    const searchOptionsCurrent = {
      method: 'POST',
      url: 'https://www.booking.com/dml/graphql?lang=en-us',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        operationName: 'AutoComplete',
        variables: {
          input: {
            prefixQuery: `${userDetails.current_city} city, ${userDetails.current_country}`,
            nbSuggestions: 5,
            fallbackConfig: {
              mergeResults: true,
              nbMaxMergedResults: 6,
              nbMaxThirdPartyResults: 3,
              sources: ['GOOGLE', 'HERE']
            },
            requestContext: {
              pageviewId: '2bf16a94f75e00ff'
            }
          }
        },
        extensions: {},
        query: `query AutoComplete($input: AutoCompleteRequestInput!) {
          autoCompleteSuggestions(input: $input) {
            results {
              destination {
                countryCode
                destId
                destType
                latitude
                longitude
                __typename
              }
              displayInfo {
                imageUrl
                label
                labelComponents {
                  name
                  type
                  __typename
                }
                showEntireHomesCheckbox
                title
                subTitle
                __typename
              }
              metaData {
                isSkiItem
                langCode
                maxLosData {
                  extendedLoS
                  __typename
                }
                metaMatches {
                  id
                  text
                  type
                  __typename
                }
                roundTrip
                webFilters
                autocompleteResultId
                autocompleteResultSource
                __typename
              }
              __typename
            }
            __typename
          }
        }`
      }
    };

    const searchResponseCurrent = await axios.request(searchOptionsCurrent);

    const searchDestination = searchResponseDestination.data.data.autoCompleteSuggestions.results.find((result => result.destination.destType === 'CITY'));
    const searchCurrent = searchResponseCurrent.data.data.autoCompleteSuggestions.results[0];

    const startdate = new Date(userDetails.dates_start);

    const year = startdate.getFullYear();
    const month = startdate.getMonth() + 1; // getMonth() returns 0-11
    const day = startdate.getDate();

    const endDate = new Date(userDetails.dates_end);
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();

    const options = {
      method: 'POST',
      url: 'https://www.booking.com/dml/graphql',
      params: {
        ss: searchDestination.displayInfo.label,
        ssne: 'Tirana',
        ssne_untouched: 'Tirana',
        label: 'gen173nr-1FCAEoggI46AdIM1gEaAaIAQGYATG4ARfIAQzYAQHoAQH4AQKIAgGoAgO4Au7EusMGwAIB0gIkZmVhZmY4NjctNTYxNi00NjNhLWFhNWItOTQ3MTM4MmY1ZDE02AIF4AIB',
        aid: '304142',
        lang: 'en-us',
        sb: '1',
        src_elem: 'sb',
        src: 'index',
        dest_id: parseInt(searchDestination.metaData.autocompleteResultId.split("/")[1]),
        dest_type: 'city',
        place_id: `city/${parseInt(searchDestination.metaData.autocompleteResultId.split("/")[1])}`,
        ac_position: '0',
        ac_click_type: 'b',
        ac_langcode: 'en',
        ac_suggestion_list_length: '5',
        search_selected: 'true',
        search_pageview_id: '4bad78b750550427',
        ac_meta: 'GhA0YmFkNzhiNzUwNTUwNDI3IAAoATICZW46BXBhcmlzQABKAFAA',
        checkin: userDetails.dates_start,
        checkout: userDetails.dates_end,
        group_adults: '2',
        no_rooms: '1',
        group_children: '0'
      },
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        'apollographql-client-name': 'b-search-web-searchresults_rust',
        'apollographql-client-version': 'EQdHYKHU',
        'content-type': 'application/json',
        'priority': 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-booking-context-action-name': 'searchresults_irene',
        'x-booking-context-aid': '304142',
        'x-booking-csrf-token': 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJjb250ZXh0LWVucmljaG1lbnQtYXBpIiwic3ViIjoiY3NyZi10b2tlbiIsImlhdCI6MTc1MjA4MTAyMCwiZXhwIjoxNzUyMTY3NDIwfQ.o9pchNwqnfCucZlAkPTcd9_RFCFBLkljn0fZx4LSphoIzzL0Uls8dri5yZxnrWWjY2NQmoVtfjJF6zHcrwZuDw',
        'x-booking-dml-cluster': 'rust',
        'x-booking-et-serialized-state': 'EHaRyG5W9WrQ-DPXKnjSeOawzzCvQ5rS6KnRu5zBnzYH3Q6eL6DNHQRbzKBg4UTMuKJG5A1GDGzlT6ca8ZrscX3fKmsIeW8rLs32ztMhrnt3jqWuXZKPFbw',
        'x-booking-pageview-id': 'f980ad6826a5af517f1601400b34f2a5',
        'x-booking-site-type-id': '1',
        'x-booking-topic': 'capla_browser_b-search-web-searchresults',
        'cookie': 'pcm_personalization_disabled=0; cors_js=1; _gcl_au=1.1.1310596591.1751568863; FPID=FPID2.2.vWR8puxy5JGe1QiN0KoyXzXL9VppdvWQZHuStH3Cdzo%3D.1751568862; FPAU=1.1.1310596591.1751568863; _yjsu_yjad=1751568864.f264a27d-d049-4d9f-a9e1-d54cea8d3157; _ga_P07TP8FRGZ=GS2.1.s1751803652$o1$g0$t1751803653$j59$l0$h0; bkng_sso_session=eyJib29raW5nX2dsb2JhbCI6W3sibG9naW5faGludCI6IjdDUUpzSlhNbnViWDhpTnNubUhLYmVaeEcwUURjMStVYTBCZjM0R25YNUEifV19; bkng_sso_ses=eyJib29raW5nX2dsb2JhbCI6W3siaCI6IjdDUUpzSlhNbnViWDhpTnNubUhLYmVaeEcwUURjMStVYTBCZjM0R25YNUEifV19; _ga_4GY873RFCC=GS2.1.s1751803635$o1$g1$t1751805009$j5$l0$h0; _ga_ME6FRX2E79=GS2.1.s1751803340$o1$g1$t1751805635$j59$l0$h0; pcm_consent=consentedAt%3D2025-07-06T12%3A51%3A39.840Z%26countryCode%3DAL%26expiresAt%3D2026-01-02T12%3A51%3A39.840Z%26implicit%3Dfalse%26regionCode%3D10%26regulation%3Dnone%26legacyRegulation%3Dnone%26consentId%3Dcfc2866b-57c4-488d-a01f-df0d49cbbad4%26analytical%3Dtrue%26marketing%3Dtrue; BJS=-; _gid=GA1.2.1167518412.1752001663; bkng_prue=1; _gac_UA-116109-18=1.1752073531.CjwKCAjwprjDBhBTEiwA1m1d0hPzumuGQuZbSIO3suNkI5BYCsPPxn3VEfE5-Q4xCXd1GOBpxWRYXxoCyvcQAvD_BwE; _gcl_aw=GCL.1752073534.CjwKCAjwprjDBhBTEiwA1m1d0hPzumuGQuZbSIO3suNkI5BYCsPPxn3VEfE5-Q4xCXd1GOBpxWRYXxoCyvcQAvD_BwE; _gcl_gs=2.1.k1$i1752073528$u228698639; FPGCLGS=2.1.k1$i1752073531$u228698639; FPGCLAW=2.1.kCjwKCAjwprjDBhBTEiwA1m1d0hPzumuGQuZbSIO3suNkI5BYCsPPxn3VEfE5-Q4xCXd1GOBpxWRYXxoCyvcQAvD_BwE$i1752073541; FPLC=No79WZtW2AinHurv0EB%2FpIYe24Psn774za0wO1J0bVGQxKwjS9fXOJOz07UoOvp6rmoV4Vw7KG9fbJQ%2F%2BtYEOMidFAL1ort9%2BVk24tU%2Bdk1l%2B7z09b4lXyJKVCQKqg%3D%3D; cgumid=3gL_Xl9uTE9xJTJGcWRlVEJZNVFiUlRqR2tsU25EeWJ6QUdjblBEVGtua0clMkJzT3NCcyUzRA; _ga=GA1.1.1492352810.1751568862; cto_bundle=MSILxl9RdmZxRjRpcEZOdHFKNUh3S2puMVRvN0tWRUxoTldpQTlxNHU0cnY2Wmc1TUhNNm56cHBJV1BmT1FDNGJFY016Z3FtbFh5NTFlWkZwRXUlMkZsd2dRcVF6eVhLU0J3SkdwN25Vd004VCUyQkF4RiUyRjlRYVc3c0UwSjBaeiUyRldTZGNaJTJCZHhsdEllYkg5WmxCWjN6ajJ5MDFvWDBnJTNEJTNE; _uetsid=d556aa605c2e11f0a44655326db4aa1e; _uetvid=4ab5c08062db11ee9596f3f34ca7361e; _ga_A12345=GS2.1.s1752081003$o8$g1$t1752081021$j42$l0$h10977032; lastSeen=1752081021335; OptanonConsent=implicitConsentCountry=nonGDPR&implicitConsentDate=1751568861404&isGpcEnabled=0&datestamp=Wed+Jul+09+2025+19%3A10%3A26+GMT%2B0200+(Central+European+Summer+Time)&version=202501.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=3e95c4f8-9e7b-4a8c-8eac-2dca84813704&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0004%3A1&AwaitingReconsent=false; bkng_sso_auth=CAIQ0+WGHxqKAfDcBd/mZEabURAxO2A90jdwLkC9c/P/6Oa6pcaGW1CWKHDBhg37ZCPA8wM2JWdD/IDSCkDTzmnGXd0jTnK98kbKpfTCsTcjKH1+6dCjLz+BpO9SYhMPIGFyfzUy9kNOzC150eLPDuc88je7TGU6L4xjgWWFYtwzbJ4u9ST2+7XSDOLvvo/+hxn5fA==; bkng=11UmFuZG9tSVYkc2RlIyh9Yaa29%2F3xUOLb9qg0InA%2FFDd4iALMnllEdA0ittVCW6ghi6pvm1NF9DqsxHvVH97EJqcc8y96GOtffgr2LIfweKaFS2E2q4NLXc5F7vse7D13IdFmgxAZWwOX8DurgfC28O4A33ywXbEwSlHiLyG5016Yvsk2KIl%2BcW4NxvlNdMKON3uwS9zfr%2B1vtG65O1uUDq1fq%2BbJmRu7%2FU6gFhYYOhk%3D; aws-waf-token=75de38f5-bd56-49e7-b2ac-77048522acb5:DgoAcut+MhywAgAA:jL49Hz1OZMT89VglvJ7UF8dnWuhoGH6iAf+6sJxB419i7Gep7DiyiMgehLuB3YUAiAu0AR6tPqSy9oMvnlon//4N3Q1KG+tq11l/2A2HaLblfnsDDQOT7Sn9EQ5yOk42RDUSl3ovX7+ysKZAbOEWXS8a3F/KOxQBI6JzZUhsPkJ+PFhxTadkk22MKohAofmI893eff4Ruxf5aH2a6Eexb9wt1rpQfIDK2f3uy2fhE8OV3EdIHfso4wzYoEyvlcVHeU4=',
        'Referer': `https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggI46AdIM1gEaAaIAQGYATG4ARfIAQzYAQHoAQH4AQKIAgGoAgO4Au7EusMGwAIB0gIkZmVhZmY4NjctNTYxNi00NjNhLWFhNWItOTQ3MTM4MmY1ZDE02AIF4AIB&aid=304142&ss=${searchDestination.displayInfo.label}&ssne=Tirana&ssne_untouched=Tirana&lang=en-us&sb=1&src_elem=sb&dest_id=${parseInt(searchDestination.metaData.autocompleteResultId.split("/")[1])}&dest_type=city&place_id=city%2F${parseInt(searchDestination.metaData.autocompleteResultId.split("/")[1])}&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=4bad78b750550427&checkin=${userDetails.dates_start}&checkout=${userDetails.dates_end}&group_adults=2&no_rooms=1&group_children=0`,
        'Referrer-Policy': 'origin-when-cross-origin'
      },
      data: {
        operationName: 'FullSearch',
        variables: {
          includeBundle: true,
          input: {
            acidCarouselContext: null,
            childrenAges: [],
            dates: {
              checkin: userDetails.dates_start,
              checkout: userDetails.dates_end
            },
            doAvailabilityCheck: false,
            encodedAutocompleteMeta: null,
            enableCampaigns: true,
            filters: {},
            flexibleDatesConfig: {
              broadDatesCalendar: {
                checkinMonths: [],
                los: [],
                startWeekdays: []
              },
              dateFlexUseCase: 'DATE_RANGE',
              dateRangeCalendar: {
                checkin: [userDetails.dates_start],
                checkout: [userDetails.dates_end]
              }
            },
            forcedBlocks: null,
            location: {
              searchString: searchDestination.displayInfo.label,
              destType: 'CITY',
              destId: parseInt(searchDestination.metaData.autocompleteResultId.split("/")[1])
            },
            metaContext: {
              metaCampaignId: 0,
              externalTotalPrice: null,
              feedPrice: null,
              hotelCenterAccountId: null,
              rateRuleId: null,
              dragongateTraceId: null,
              pricingProductsTag: null
            },
            nbRooms: 1,
            nbAdults: 2,
            nbChildren: 0,
            showAparthotelAsHotel: true,
            needsRoomsMatch: false,
            optionalFeatures: {
              forceArpExperiments: true,
              testProperties: false
            },
            pagination: {
              rowsPerPage: 25,
              offset: 0
            },
            rawQueryForSession: `/searchresults.html?label=gen173nr-1FCAEoggI46AdIM1gEaAaIAQGYATG4ARfIAQzYAQHoAQH4AQKIAgGoAgO4Au7EusMGwAIB0gIkZmVhZmY4NjctNTYxNi00NjNhLWFhNWItOTQ3MTM4MmY1ZDE02AIF4AIB&aid=304142&ss=${searchDestination.displayInfo.label}&ssne=Tirana&ssne_untouched=Tirana&lang=en-us&sb=1&src_elem=sb&dest_id=${parseInt(searchDestination.metaData.autocompleteResultId.split("/")[1])}&dest_type=city&place_id=city%2F${parseInt(searchDestination.metaData.autocompleteResultId.split("/")[1])}&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=4bad78b750550427&checkin=${userDetails.dates_start}&checkout=${userDetails.dates_end}&group_adults=2&no_rooms=1&group_children=0`,
            referrerBlock: {
              clickPosition: 0,
              clickType: 'b',
              blockName: 'searchbox'
            },
            sbCalendarOpen: false,
            travelPurpose: 2,
            seoThemeIds: [],
            useSearchParamsFromSession: true,
            merchInput: {
              testCampaignIds: []
            },
            webSearchContext: {
              reason: 'CLIENT_SIDE_UPDATE',
              source: 'SEARCH_RESULTS',
              outcome: 'SEARCH_RESULTS'
            },
            clientSideRequestId: 'f980ad6826a5af517f1601400b34f2a5'
          },
          carouselLowCodeExp: false
        },
        extensions: {},
        query: `query FullSearch($input: SearchQueryInput!, $carouselLowCodeExp: Boolean!, $includeBundle: Boolean = false) {
      searchQueries {
        search(input: $input) {
          ...FullSearchFragment
          __typename
        }
        __typename
      }
    }
    
    fragment FullSearchFragment on SearchQueryOutput {
      banners {
        ...Banner
        __typename
      }
      breadcrumbs {
        ... on SearchResultsBreadcrumb {
          ...SearchResultsBreadcrumb
          __typename
        }
        ... on LandingPageBreadcrumb {
          ...LandingPageBreadcrumb
          __typename
        }
        __typename
      }
      carousels {
        ...Carousel
        __typename
      }
      destinationLocation {
        ...DestinationLocation
        __typename
      }
      entireHomesSearchEnabled
      dateFlexibilityOptions {
        enabled
        __typename
      }
      flexibleDatesConfig {
        broadDatesCalendar {
          checkinMonths
          los
          startWeekdays
          losType
          __typename
        }
        dateFlexUseCase
        dateRangeCalendar {
          flexWindow
          checkin
          checkout
          __typename
        }
        __typename
      }
      filters {
        ...FilterData
        __typename
      }
      filtersTrackOnView {
        type
        experimentHash
        value
        __typename
      }
      appliedFilterOptions {
        ...FilterOption
        __typename
      }
      recommendedFilterOptions {
        ...FilterOption
        __typename
      }
      pagination {
        nbResultsPerPage
        nbResultsTotal
        __typename
      }
      tripTypes {
        ...TripTypesData
        __typename
      }
      results {
        ...BasicPropertyData
        ...PropertyUspBadges
        ...MatchingUnitConfigurations
        ...PropertyBlocks
        ...BookerExperienceData
        ...TopPhotos
        generatedPropertyTitle
        priceDisplayInfoIrene {
          ...PriceDisplayInfoIrene
          __typename
        }
        licenseDetails {
          nextToHotelName
          __typename
        }
        isTpiExclusiveProperty
        propertyCribsAvailabilityLabel
        mlBookingHomeTags
        trackOnView {
          type
          experimentHash
          value
          __typename
        }
        __typename
      }
      searchMeta {
        ...SearchMetadata
        __typename
      }
      sorters {
        option {
          ...SorterFields
          __typename
        }
        __typename
      }
      zeroResultsSection {
        ...ZeroResultsSection
        __typename
      }
      rocketmilesSearchUuid
      previousSearches {
        ...PreviousSearches
        __typename
      }
      merchComponents {
        ...MerchRegionIrene
        __typename
      }
      wishlistData {
        numProperties
        __typename
      }
      seoThemes {
        id
        caption
        __typename
      }
      gridViewPreference
      advancedSearchWidget {
        title
        legalDisclaimer
        description
        placeholder
        ctaText
        helperText
        __typename
      }
      visualFiltersGroups {
        ...VisualFiltersGroup
        __typename
      }
      __typename
    }
    
    fragment BasicPropertyData on SearchResultProperty {
      acceptsWalletCredit
      basicPropertyData {
        accommodationTypeId
        id
        isTestProperty
        location {
          address
          city
          countryCode
          __typename
        }
        pageName
        ufi
        photos {
          main {
            highResUrl {
              relativeUrl
              __typename
            }
            lowResUrl {
              relativeUrl
              __typename
            }
            highResJpegUrl {
              relativeUrl
              __typename
            }
            lowResJpegUrl {
              relativeUrl
              __typename
            }
            tags {
              id
              __typename
            }
            __typename
          }
          __typename
        }
        reviewScore: reviews {
          score: totalScore
          reviewCount: reviewsCount
          totalScoreTextTag {
            translation
            __typename
          }
          showScore
          secondaryScore
          secondaryTextTag {
            translation
            __typename
          }
          showSecondaryScore
          __typename
        }
        externalReviewScore: externalReviews {
          score: totalScore
          reviewCount: reviewsCount
          showScore
          totalScoreTextTag {
            translation
            __typename
          }
          __typename
        }
        starRating {
          value
          symbol
          caption {
            translation
            __typename
          }
          tocLink {
            translation
            __typename
          }
          showAdditionalInfoIcon
          __typename
        }
        isClosed
        paymentConfig {
          installments {
            minPriceFormatted
            maxAcceptCount
            __typename
          }
          __typename
        }
        __typename
      }
      badges {
        caption {
          translation
          __typename
        }
        closedFacilities {
          startDate
          endDate
          __typename
        }
        __typename
      }
      customBadges {
        showSkiToDoor
        showBhTravelCreditBadge
        showOnlineCheckinBadge
        __typename
      }
      description {
        text
        __typename
      }
      displayName {
        text
        translationTag {
          translation
          __typename
        }
        __typename
      }
      geniusInfo {
        benefitsCommunication {
          header {
            title
            __typename
          }
          items {
            title
            __typename
          }
          __typename
        }
        geniusBenefits
        geniusBenefitsData {
          hotelCardHasFreeBreakfast
          hotelCardHasFreeRoomUpgrade
          sortedBenefits
          __typename
        }
        showGeniusRateBadge
        __typename
      }
      location {
        displayLocation
        mainDistance
        mainDistanceDescription
        publicTransportDistanceDescription
        skiLiftDistance
        beachDistance
        nearbyBeachNames
        beachWalkingTime
        geoDistanceMeters
        isCentrallyLocated
        isWithinBestLocationScoreArea
        popularFreeDistrictName
        nearbyUsNaturalParkText
        __typename
      }
      mealPlanIncluded {
        mealPlanType
        text
        __typename
      }
      persuasion {
        autoextended
        geniusRateAvailable
        highlighted
        preferred
        preferredPlus
        showNativeAdLabel
        nativeAdId
        nativeAdsCpc
        nativeAdsTracking
        sponsoredAdsData {
          isDsaCompliant
          legalEntityName
          designType
          __typename
        }
        __typename
      }
      policies {
        showFreeCancellation
        showNoPrepayment
        showPetsAllowedForFree
        enableJapaneseUsersSpecialCase
        __typename
      }
      ribbon {
        ribbonType
        text
        __typename
      }
      recommendedDate {
        checkin
        checkout
        lengthOfStay
        __typename
      }
      showGeniusLoginMessage
      hostTraderLabel
      soldOutInfo {
        isSoldOut
        messages {
          text
          __typename
        }
        alternativeDatesMessages {
          text
          __typename
        }
        __typename
      }
      nbWishlists
      nonMatchingFlexibleFilterOptions {
        label
        __typename
      }
      visibilityBoosterEnabled
      showAdLabel
      isNewlyOpened
      propertySustainability {
        isSustainable
        certifications {
          name
          __typename
        }
        __typename
      }
      seoThemes {
        caption
        __typename
      }
      relocationMode {
        distanceToCityCenterKm
        distanceToCityCenterMiles
        distanceToOriginalHotelKm
        distanceToOriginalHotelMiles
        phoneNumber
        __typename
      }
      bundleRatesAvailable
      __typename
    }
    
    fragment Banner on Banner {
      name
      type
      isDismissible
      showAfterDismissedDuration
      position
      requestAlternativeDates
      merchId
      title {
        text
        __typename
      }
      imageUrl
      paragraphs {
        text
        __typename
      }
      metadata {
        key
        value
        __typename
      }
      pendingReviewInfo {
        propertyPhoto {
          lowResUrl {
            relativeUrl
            __typename
          }
          lowResJpegUrl {
            relativeUrl
            __typename
          }
          __typename
        }
        propertyName
        urlAccessCode
        __typename
      }
      nbDeals
      primaryAction {
        text {
          text
          __typename
        }
        action {
          name
          context {
            key
            value
            __typename
          }
          __typename
        }
        __typename
      }
      secondaryAction {
        text {
          text
          __typename
        }
        action {
          name
          context {
            key
            value
            __typename
          }
          __typename
        }
        __typename
      }
      iconName
      flexibleFilterOptions {
        optionId
        filterName
        __typename
      }
      trackOnView {
        type
        experimentHash
        value
        __typename
      }
      dateFlexQueryOptions {
        text {
          text
          __typename
        }
        action {
          name
          context {
            key
            value
            __typename
          }
          __typename
        }
        isApplied
        __typename
      }
      __typename
    }
    
    fragment Carousel on Carousel {
      aggregatedCountsByFilterId
      carouselId
      position
      contentType
      hotelId
      name
      soldoutProperties
      priority
      themeId
      title {
        text
        __typename
      }
      slides {
        captionText {
          text
          __typename
        }
        name
        photoUrl
        subtitle {
          text
          __typename
        }
        type
        title {
          text
          __typename
        }
        action {
          context {
            key
            value
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    
    fragment DestinationLocation on DestinationLocation {
      name {
        text
        __typename
      }
      inName {
        text
        __typename
      }
      countryCode
      ufi
      __typename
    }
    
    fragment FilterData on Filter {
      trackOnView {
        type
        experimentHash
        value
        __typename
      }
      trackOnClick {
        type
        experimentHash
        value
        __typename
      }
      name
      field
      category
      filterStyle
      title {
        text
        translationTag {
          translation
          __typename
        }
        __typename
      }
      subtitle
      options {
        parentId
        genericId
        trackOnView {
          type
          experimentHash
          value
          __typename
        }
        trackOnClick {
          type
          experimentHash
          value
          __typename
        }
        trackOnSelect {
          type
          experimentHash
          value
          __typename
        }
        trackOnDeSelect {
          type
          experimentHash
          value
          __typename
        }
        trackOnViewPopular {
          type
          experimentHash
          value
          __typename
        }
        trackOnClickPopular {
          type
          experimentHash
          value
          __typename
        }
        trackOnSelectPopular {
          type
          experimentHash
          value
          __typename
        }
        trackOnDeSelectPopular {
          type
          experimentHash
          value
          __typename
        }
        ...FilterOption
        __typename
      }
      filterLayout {
        isCollapsable
        collapsedCount
        __typename
      }
          stepperOptions {
        min
        max
        default
        selected
        title {
          text
          translationTag {
            translation
            __typename
          }
          __typename
        }
        field
        labels {
          text
          translationTag {
            translation
            __typename
          }
          __typename
        }
        trackOnView {
          type
          experimentHash
          value
          __typename
        }
        trackOnClick {
          type
          experimentHash
          value
          __typename
        }
        trackOnSelect {
          type
          experimentHash
          value
          __typename
        }
        trackOnDeSelect {
          type
          experimentHash
          value
          __typename
        }
        trackOnClickDecrease {
          type
          experimentHash
          value
          __typename
        }
        trackOnClickIncrease {
          type
          experimentHash
          value
          __typename
        }
        trackOnDecrease {
          type
          experimentHash
          value
          __typename
        }
        trackOnIncrease {
          type
          experimentHash
          value
          __typename
        }
        __typename
      }
      sliderOptions {
        min
        max
        minSelected
        maxSelected
        minPriceStep
        minSelectedFormatted
        currency
        histogram
        selectedRange {
          translation
          __typename
        }
        __typename
      }
      distanceToPoiData {
        options {
          text
          value
          isDefault
          __typename
        }
        poiNotFound
        poiPlaceholder
        poiHelper
        isSelected
        selectedOptionValue
        selectedPlaceId {
          numValue
          stringValue
          __typename
        }
        selectedPoiType {
          destType
          source
          __typename
        }
        selectedPoiText
        selectedPoiLatitude
        selectedPoiLongitude
        __typename
      }
      __typename
    }
    
    fragment FilterOption on Option {
      optionId: id
      count
      selected
      urlId
      source
      field
      additionalLabel {
        text
        translationTag {
          translation
          __typename
        }
        __typename
      }
      value {
        text
        translationTag {
          translation
          __typename
        }
        __typename
      }
      starRating {
        value
        symbol
        caption {
          translation
          __typename
        }
        showAdditionalInfoIcon
        __typename
      }
      __typename
    }
    
    fragment LandingPageBreadcrumb on LandingPageBreadcrumb {
      destType
      name
      urlParts
      __typename
    }
    
    fragment MatchingUnitConfigurations on SearchResultProperty {
      matchingUnitConfigurations {
        commonConfiguration {
          name
          unitId
          bedConfigurations {
            beds {
              count
              type
              __typename
            }
            nbAllBeds
            __typename
          }
          nbAllBeds
          nbBathrooms
          nbBedrooms
          nbKitchens
          nbLivingrooms
          nbUnits
          unitTypeNames {
            translation
            __typename
          }
          localizedArea {
            localizedArea
            unit
            __typename
          }
          __typename
        }
        unitConfigurations {
          name
          unitId
          bedConfigurations {
            beds {
              count
              type
              __typename
            }
            nbAllBeds
            __typename
          }
          apartmentRooms {
            config {
              roomId: id
              roomType
              bedTypeId
              bedCount: count
              __typename
            }
            roomName: tag {
              tag
              translation
              __typename
            }
            __typename
          }
          nbAllBeds
          nbBathrooms
          nbBedrooms
          nbKitchens
          nbLivingrooms
          nbUnits
          unitTypeNames {
            translation
            __typename
          }
          localizedArea {
            localizedArea
            unit
            __typename
          }
          unitTypeId
          __typename
        }
        __typename
      }
      __typename
    }
    
    fragment PropertyBlocks on SearchResultProperty {
      blocks {
        blockId {
          roomId
          occupancy
          policyGroupId
          packageId
          mealPlanId
          bundleId
          __typename
        }
        finalPrice {
          amount
          currency
          __typename
        }
        originalPrice {
          amount
          currency
          __typename
        }
        onlyXLeftMessage {
          tag
          variables {
            key
            value
            __typename
          }
          translation
          __typename
        }
        freeCancellationUntil
        hasCrib
        blockMatchTags {
          childStaysForFree
          freeStayChildrenAges
          __typename
        }
        thirdPartyInventoryContext {
          isTpiBlock
          __typename
        }
        bundle @include(if: $includeBundle) {
          highlightedText
          __typename
        }
        __typename
      }
      __typename
    }
    
    fragment PriceDisplayInfoIrene on PriceDisplayInfoIrene {
      badges {
        name {
          translation
          __typename
        }
        tooltip {
          translation
          __typename
        }
        style
        identifier
        __typename
      }
      chargesInfo {
        translation
        __typename
      }
      displayPrice {
        copy {
          translation
          __typename
        }
        amountPerStay {
          amount
          amountRounded
          amountUnformatted
          currency
          __typename
        }
        amountPerStayHotelCurr {
          amount
          amountRounded
          amountUnformatted
          currency
          __typename
        }
        __typename
      }
      averagePricePerNight {
        amount
        amountRounded
        amountUnformatted
        currency
        __typename
      }
      priceBeforeDiscount {
        copy {
          translation
          __typename
        }
        amountPerStay {
          amount
          amountRounded
          amountUnformatted
          currency
          __typename
        }
        __typename
      }
      rewards {
        rewardsList {
          termsAndConditions
          amountPerStay {
            amount
            amountRounded
            amountUnformatted
            currency
            __typename
          }
          breakdown {
            productType
            amountPerStay {
              amount
              amountRounded
              amountUnformatted
              currency
              __typename
            }
            __typename
          }
          __typename
        }
        rewardsAggregated {
          amountPerStay {
            amount
            amountRounded
            amountUnformatted
            currency
            __typename
          }
          copy {
            translation
            __typename
          }
          __typename
        }
        __typename
      }
      useRoundedAmount
      discounts {
        amount {
          amount
          amountRounded
          amountUnformatted
          currency
          __typename
        }
        name {
          translation
          __typename
        }
        description {
          translation
          __typename
        }
        itemType
        productId
        __typename
      }
      excludedCharges {
        excludeChargesAggregated {
          copy {
            translation
            __typename
          }
          amountPerStay {
            amount
            amountRounded
            amountUnformatted
            currency
            __typename
          }
          __typename
        }
        excludeChargesList {
          chargeMode
          chargeInclusion
          chargeType
          amountPerStay {
            amount
            amountRounded
            amountUnformatted
            currency
            __typename
          }
          __typename
        }
        __typename
      }
      taxExceptions {
        shortDescription {
          translation
          __typename
        }
        longDescription {
          translation
          __typename
        }
        __typename
      }
      displayConfig {
        key
        value
        __typename
      }
      serverTranslations {
        key
        value
        __typename
      }
      __typename
    }
    
    fragment BookerExperienceData on SearchResultProperty {
      bookerExperienceContentUIComponentProps {
        ... on BookerExperienceContentLoyaltyBadgeListProps {
          badges {
            amount
            variant
            key
            title
            hidePopover
            popover
            tncMessage
            tncUrl
            logoSrc
            logoAlt
            __typename
          }
          __typename
        }
        ... on BookerExperienceContentFinancialBadgeProps {
          paymentMethod
          backgroundColor
          hideAccepted
          __typename
        }
        __typename
      }
      __typename
    }
    
    fragment TopPhotos on SearchResultProperty {
      topPhotos {
        highResUrl {
          relativeUrl
          __typename
        }
        lowResUrl {
          relativeUrl
          __typename
        }
        highResJpegUrl {
          relativeUrl
          __typename
        }
        lowResJpegUrl {
          relativeUrl
          __typename
        }
        __typename
      }
      __typename
    }
    
    fragment SearchMetadata on SearchMeta {
      availabilityInfo {
        hasLowAvailability
        unavailabilityPercent
        totalAvailableNotAutoextended
        totalAutoextendedAvailable
        __typename
      }
      boundingBoxes {
        swLat
        swLon
        neLat
        neLon
        type
        __typename
      }
      childrenAges
      dates {
        checkin
        checkout
        lengthOfStayInDays
        __typename
      }
      destId
      destType
      guessedLocation {
        destId
        destType
        destName
        __typename
      }
      maxLengthOfStayInDays
      nbRooms
      nbAdults
      nbChildren
      userHasSelectedFilters
      customerValueStatus
      isAffiliateBookingOwned
      affiliatePartnerChannelId
      affiliateVerticalType
      geniusLevel
      __typename
    }
    
    fragment SearchResultsBreadcrumb on SearchResultsBreadcrumb {
      destId
      destType
      name
      __typename
    }
    
    fragment SorterFields on SorterOption {
      type: name
      captionTranslationTag {
        translation
        __typename
      }
      tooltipTranslationTag {
        translation
        __typename
      }
      isSelected: selected
      __typename
    }
    
    fragment TripTypesData on TripTypes {
      beach {
        isBeachUfi
        isEnabledBeachUfi
        __typename
      }
      ski {
        isSkiExperience
        isSkiScaleUfi
        __typename
      }
      __typename
    }
    
    fragment ZeroResultsSection on ZeroResultsSection {
      title {
        text
        __typename
      }
      primaryAction {
        text {
          text
          __typename
        }
        action {
          name
          __typename
        }
        __typename
      }
      paragraphs {
        text
        __typename
      }
      type
      __typename
    }
    
    fragment PreviousSearches on PreviousSearch {
      childrenAges
      __typename
    }
    
    fragment MerchRegionIrene on MerchComponentsResultIrene {
      regions {
        id
        components {
          ... on PromotionalBannerIrene {
            promotionalBannerCampaignId
            contentArea {
              title {
                ... on PromotionalBannerSimpleTitleIrene {
                  value
                  __typename
                }
                __typename
              }
              subTitle {
                ... on PromotionalBannerSimpleSubTitleIrene {
                  value
                  __typename
                }
                __typename
              }
              caption {
                ... on PromotionalBannerSimpleCaptionIrene {
                  value
                  __typename
                }
                ... on PromotionalBannerCountdownCaptionIrene {
                  campaignEnd
                  __typename
                }
                __typename
              }
              buttons {
                variant
                cta {
                  ariaLabel
                  text
                  targetLanding {
                    ... on OpenContextSheet {
                      sheet {
                        ... on WebContextSheet {
                          title
                          body {
                            items {
                              ... on ContextSheetTextItem {
                                text
                                __typename
                              }
                              ... on ContextSheetList {
                                items {
                                  text
                                  __typename
                                }
                                __typename
                              }
                              __typename
                            }
                            __typename
                          }
                          buttons {
                            variant
                            cta {
                              text
                              ariaLabel
                              targetLanding {
                                ... on DirectLinkLanding {
                                  urlPath
                                  queryParams {
                                    name
                                    value
                                    __typename
                                  }
                                  __typename
                                }
                                ... on LoginLanding {
                                  stub
                                  __typename
                                }
                                ... on DeeplinkLanding {
                                  urlPath
                                  queryParams {
                                    name
                                    value
                                    __typename
                                  }
                                  __typename
                                }
                                ... on ResolvedLinkLanding {
                                  url
                                  __typename
                                }
                                __typename
                              }
                              __typename
                            }
                            __typename
                          }
                          __typename
                        }
                        __typename
                      }
                      __typename
                    }
                    ... on SearchResultsLandingIrene {
                      destType
                      destId
                      checkin
                      checkout
                      nrAdults
                      nrChildren
                      childrenAges
                      nrRooms
                      filters {
                        name
                        value
                        __typename
                      }
                      __typename
                    }
                    ... on DirectLinkLandingIrene {
                      urlPath
                      queryParams {
                        name
                        value
                        __typename
                      }
                      __typename
                    }
                    ... on LoginLandingIrene {
                      stub
                      __typename
                    }
                    ... on DeeplinkLandingIrene {
                      urlPath
                      queryParams {
                        name
                        value
                        __typename
                      }
                      __typename
                    }
                    ... on SorterLandingIrene {
                      sorterName
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            designVariant {
              ... on DesktopPromotionalFullBleedImageIrene {
                image: image {
                  id
                  url(width: 814, height: 138)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on DesktopPromotionalImageLeftIrene {
                imageOpt: image {
                  id
                  url(width: 248, height: 248)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on DesktopPromotionalImageRightIrene {
                imageOpt: image {
                  id
                  url(width: 248, height: 248)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on MdotPromotionalFullBleedImageIrene {
                image: image {
                  id
                  url(width: 358, height: 136)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on MdotPromotionalImageLeftIrene {
                imageOpt: image {
                  id
                  url(width: 128, height: 128)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on MdotPromotionalImageRightIrene {
                imageOpt: image {
                  id
                  url(width: 128, height: 128)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on MdotPromotionalIllustrationLeftIrene {
                imageOpt: image {
                  id
                  url(width: 200, height: 200)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on MdotPromotionalIllustrationRightIrene {
                imageOpt: image {
                  id
                  url(width: 200, height: 200)
                  alt
                  overlayGradient
                  primaryColorHex
                  __typename
                }
                colorScheme
                signature
                __typename
              }
              ... on MdotPromotionalImageTopIrene {
                colorScheme
                signature
                __typename
              }
              __typename
            }
            __typename
          }
          ... on MerchCarouselIrene @include(if: $carouselLowCodeExp) {
            carouselCampaignId
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    
    fragment VisualFiltersGroup on VisualFiltersGroup {
      groupId: id
      position
      title {
        text
        __typename
      }
      visualFilters {
        title {
          text
          __typename
        }
        description {
          text
          __typename
        }
        photoUrl
        action {
          name
          context {
            key
            value
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    
    fragment PropertyUspBadges on SearchResultProperty {
      propertyUspBadges {
        name
        translatedName
        __typename
      }
      __typename
    }`
      }
    };

    const response = await axios.request(options);

    return response.data;
  } catch (error) {
    console.log("error")
  }
  return []
}

async function parseBookingResponseToStays(userDetails, tripId = null) {
  const jsonData = await findStays(userDetails);
  if (!tripId) {
    tripId = uuidv4();
  }

  const staysData = [];

  // Navigate to the search results
  try {
    const results = jsonData.data.searchQueries.search.results;

    results.forEach((propertyData, idx) => {
      try {
        const basicData = propertyData.basicPropertyData;
        const locationData = propertyData.location;

        // Extract accommodation type
        const accommodationTypeId = basicData.accommodationTypeId || 204;
        const stayType = mapAccommodationType(accommodationTypeId);

        // Extract rating
        let rating = null;
        if (basicData.reviewScore && basicData.reviewScore.score) {
          rating = Math.round(basicData.reviewScore.score * 10) / 10;
        }

        // Extract star rating
        let starRating = null;
        if (basicData.starRating && basicData.starRating.value) {
          starRating = basicData.starRating.value;
        }

        // Format address
        const addressParts = [];
        if (basicData.location.address) {
          addressParts.push(basicData.location.address);
        }
        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

        // Extract amenities/features (if available)
        const amenities = [];
        if (propertyData.customBadges) {
          const badges = propertyData.customBadges;
          if (badges.showOnlineCheckinBadge) {
            amenities.push("Online Check-in");
          }
          if (badges.showSkiToDoor) {
            amenities.push("Ski-to-door");
          }
        }

        const photo = "https://cf.bstatic.com" + propertyData.basicPropertyData.photos.main.highResUrl.relativeUrl;

        const bookingLink = generateBookingLink(basicData, propertyData);

        const finalPrice = propertyData.blocks?.[0]?.finalPrice?.amount ?? 0;
        const currency = propertyData.blocks?.[0]?.finalPrice?.currency ?? 0;

        const stayRecord = {
          id: idx + 1, 
          trip_id: tripId,
          name: propertyData.displayName.text,
          type: stayType,
          address: fullAddress,
          city: basicData.location.city || '',
          country: getCountryName(basicData.location.countryCode || ''),
          check_in_date: userDetails.dates_start,
          check_in_time: '15:00:00', 
          check_out_date: userDetails.dates_end,
          check_out_time: '11:00:00',
          nights_count: Math.abs((new Date(userDetails.dates_end) - new Date(userDetails.dates_start)) / 86400000),
          price_per_night: finalPrice / Math.abs((new Date(userDetails.dates_end) - new Date(userDetails.dates_start)) / 86400000),
          total_price: finalPrice,
          currency: currency,
          booking_reference: null,
          room_type: null,
          guests_count: 1,
          phone: null,
          email: null,
          website: `https://www.booking.com/hotel/${basicData.pageName || ''}.html`,
          booking_link: bookingLink,
          rating: rating,
          notes: propertyData.description ? propertyData.description.text : '',
          amenities: amenities.length > 0 ? JSON.stringify(amenities) : null,
          status: 'available',
          photo: photo,
          created_at: new Date().toISOString()
        };

        staysData.push(stayRecord);

      } catch (error) {
        console.error(`Error parsing property ${idx}:`, error.message);
      }
    });

  } catch (error) {
    console.error("Error: Invalid JSON structure", error.message);
    return [];
  }

  return staysData;
}

function mapAccommodationType(typeId) {
  const typeMapping = {
    201: 'apartment',
    204: 'hotel',
    208: 'guesthouse',
    218: 'hostel',
    219: 'hostel'
  };
  return typeMapping[typeId] || 'hotel';
}

function generateBookingLink(basicData, propertyData) {
  const baseUrl = 'https://www.booking.com/hotel/';
  const pageName = basicData.pageName || '';
  const propertyId = basicData.id || '';

  const params = new URLSearchParams({
    'aid': '304142',
    'label': 'gen173nr-1FCAEoggI46AdIM1gEaFCIAQGYATG4AQfIAQXYAQHoAQH4AQuIAgGoAgO4ArPQwbgGwAIB0gIkNzljOWJlMzktMzQ4OS00OWM2LTg4ODEtNzJmMTVjZmY5Mzlm2AIG4AIB',
    'sid': 'b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8',
    'dest_id': basicData.ufi || -108649,
    'dest_type': 'city',
    'checkin': getDefaultCheckinDate(),
    'checkout': getDefaultCheckoutDate(),
    'group_adults': '2',
    'group_children': '0',
    'no_rooms': '1',
    'sb_price_type': 'total',
    'type': 'total'
  });

  if (propertyId) {
    params.append('hotel_id', propertyId);
  }

  return `${baseUrl}${pageName}.html?${params.toString()}`;
}

function getDefaultCheckinDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getDefaultCheckoutDate() {
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  return dayAfterTomorrow.toISOString().split('T')[0];
}

module.exports = {
  findStays,
  parseBookingResponseToStays
}