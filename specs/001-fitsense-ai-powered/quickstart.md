# FitSense Quickstart Guide

**Date**: $(date +%Y-%m-%d) | **Version**: MVP | **Target**: Development Environment

## Overview
This quickstart guide validates the FitSense implementation by testing core user flows. Execute these scenarios to ensure the application meets functional requirements and provides a smooth user experience.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- iOS Simulator (for iOS testing) or Android Emulator (for Android testing)
- Expo CLI installed globally

## Environment Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd fitsense
npm install
```

### 2. Start Development Environment
```bash
# Terminal 1: Start Expo development server
npm start

# Terminal 2: Start Convex backend (if using local development)
npx convex dev
```

### 3. Configure Environment Variables
Create `.env` file in project root:
```env
EXPO_PUBLIC_CONVEX_URL=your-convex-deployment-url
OPENAI_API_KEY=your-openai-api-key
NUTRITIONIX_APP_ID=your-nutritionix-app-id
NUTRITIONIX_APP_KEY=your-nutritionix-app-key
```

## Quickstart Test Scenarios

### Scenario 1: New User Onboarding
**Goal**: Validate user registration and basic profile setup
**Expected Duration**: 3-5 minutes

#### Steps:
1. **Launch App**
   - Open Expo Go app on mobile device
   - Scan QR code from terminal
   - App should load to onboarding screen

2. **User Registration**
   - Click "Get Started" button
   - Select authentication method (Email/Social)
   - Enter valid email and password
   - Verify email confirmation received

3. **Profile Setup**
   - Complete fitness level assessment
   - Set primary goal (weight loss, muscle gain, etc.)
   - Configure privacy preferences
   - Enable/disable notification preferences

4. **Validation Checks**
   - ✅ User profile created in database
   - ✅ Authentication token generated
   - ✅ Default preferences applied
   - ✅ Onboarding completion tracked

### Scenario 2: Basic Workout Logging
**Goal**: Test core workout tracking functionality
**Expected Duration**: 5-7 minutes

#### Steps:
1. **Navigate to Workout Screen**
   - From dashboard, tap "Log Workout" button
   - Verify screen loads with workout type options

2. **Create Cardio Workout**
   - Select "Cardio" workout type
   - Enter workout name: "Morning Run"
   - Set start time to current time
   - Add exercise: "Running" with 30 minutes duration
   - Set mood to "Good"
   - Save workout

3. **Create Strength Workout**
   - Select "Strength" workout type
   - Enter workout name: "Upper Body"
   - Add exercise: "Push-ups" with 3 sets of 10 reps
   - Add exercise: "Bench Press" with 3 sets of 8 reps at 80kg
   - Set perceived effort to 7/10
   - Save workout

4. **Validation Checks**
   - ✅ Workout data saved to local storage
   - ✅ Sync status shows "Syncing..." then "Synced"
   - ✅ Workout appears in dashboard history
   - ✅ Exercise details correctly stored
   - ✅ Performance metrics calculated

### Scenario 3: Meal Logging with Photo
**Goal**: Test nutrition tracking with AI photo recognition
**Expected Duration**: 4-6 minutes

#### Steps:
1. **Access Meal Logging**
   - Navigate to "Log Meal" from dashboard
   - Select meal type: "Breakfast"

2. **Manual Food Entry**
   - Add food item: "Banana"
   - Enter quantity: 1, unit: "medium"
   - Verify nutritional information auto-populated
   - Add food item: "Greek Yogurt" with 200g
   - Save meal entry

3. **Photo-Based Recognition**
   - Tap "Take Photo" button
   - Allow camera permissions
   - Take photo of a simple meal (e.g., apple and sandwich)
   - Verify AI processing indicator appears
   - Confirm food items auto-detected with confidence score

4. **Validation Checks**
   - ✅ Meal data stored with correct timestamp
   - ✅ Nutritional calculations accurate
   - ✅ Photo uploaded and processed
   - ✅ Manual entries merged with photo recognition
   - ✅ Total nutrition summary correct

### Scenario 4: Health Metrics Tracking
**Goal**: Validate vital signs and biometric data collection
**Expected Duration**: 3-4 minutes

#### Steps:
1. **Manual Metric Entry**
   - Navigate to "Health Stats" section
   - Add weight measurement: 75.5 kg
   - Add blood pressure: 120/80 mmHg
   - Add sleep duration: 8 hours

2. **Automated Tracking**
   - Enable step tracking permissions
   - Verify pedometer data collection
   - Add heart rate measurement from wearable

3. **Data Visualization**
   - View metrics dashboard
   - Check trend charts display correctly
   - Verify data points plotted accurately

4. **Validation Checks**
   - ✅ All metric types supported
   - ✅ Data validation prevents invalid entries
   - ✅ Historical data preserved
   - ✅ Charts render without errors

### Scenario 5: AI Insights Generation
**Goal**: Test AI-powered analysis and recommendations
**Expected Duration**: 5-8 minutes

#### Steps:
1. **Accumulate Test Data**
   - Ensure 5+ workout entries exist
   - Add 7+ days of meal data
   - Include variety of health metrics

2. **Request AI Analysis**
   - Navigate to "Insights" tab
   - Tap "Generate Workout Analysis"
   - Wait for processing completion
   - Review generated insights

3. **Test Recommendations**
   - Request "Nutrition Review"
   - Verify personalized meal suggestions
   - Check goal-based recommendations

4. **Validation Checks**
   - ✅ AI processing completes within 30 seconds
   - ✅ Insights based on actual user data
   - ✅ Recommendations are actionable
   - ✅ Confidence scores provided

### Scenario 6: Chat Assistant Interaction
**Goal**: Validate conversational AI functionality
**Expected Duration**: 4-6 minutes

#### Steps:
1. **Initiate Chat**
   - Open chat interface from dashboard
   - Verify welcome message appears

2. **Test Context Awareness**
   - Ask: "How was my workout yesterday?"
   - Verify response references actual workout data
   - Ask: "What's my current weight trend?"
   - Confirm metric data correctly accessed

3. **Test Recommendations**
   - Ask: "Suggest a workout for today"
   - Verify personalized suggestion based on goals
   - Ask: "What's a healthy dinner option?"
   - Check nutrition preferences considered

4. **Validation Checks**
   - ✅ Responses are contextually relevant
   - ✅ User data privacy maintained
   - ✅ Response time under 5 seconds
   - ✅ Follow-up suggestions provided

### Scenario 7: Goal Setting and Tracking
**Goal**: Test objective management and progress tracking
**Expected Duration**: 4-5 minutes

#### Steps:
1. **Create Fitness Goal**
   - Navigate to "Goals" section
   - Create goal: "Lose 5kg in 3 months"
   - Set target date and reminders

2. **Track Progress**
   - Update current weight regularly
   - Verify progress chart updates
   - Check milestone celebrations trigger

3. **Goal Completion**
   - Update progress to meet target
   - Verify completion status changes
   - Confirm achievement notification sent

4. **Validation Checks**
   - ✅ Goal progress accurately calculated
   - ✅ Reminders sent at appropriate times
   - ✅ Achievement celebrations triggered
   - ✅ Historical goal data preserved

### Scenario 8: Offline Functionality
**Goal**: Validate offline-first capabilities
**Expected Duration**: 3-4 minutes

#### Steps:
1. **Enable Airplane Mode**
   - Turn on airplane mode on device
   - Attempt to log workout data
   - Verify local storage works

2. **Offline Data Entry**
   - Add meal entry without internet
   - Record health metrics offline
   - Confirm data saved locally

3. **Sync on Reconnection**
   - Disable airplane mode
   - Verify automatic sync begins
   - Confirm all offline data uploads

4. **Validation Checks**
   - ✅ All features work offline
   - ✅ Local storage encrypted
   - ✅ Sync resolves conflicts correctly
   - ✅ No data loss during connectivity issues

## Performance Benchmarks

### Response Time Targets
- **App Launch**: < 3 seconds
- **Screen Navigation**: < 1 second
- **Data Save**: < 500ms (local), < 2s (sync)
- **AI Response**: < 5 seconds
- **Photo Processing**: < 10 seconds

### Success Criteria
- ✅ All 8 scenarios complete successfully
- ✅ No crashes or error states encountered
- ✅ Data integrity maintained throughout
- ✅ Performance targets met or exceeded
- ✅ User experience smooth and intuitive

## Troubleshooting

### Common Issues
1. **Expo Build Fails**: Clear cache with `expo start -c`
2. **Authentication Errors**: Verify environment variables
3. **Sync Issues**: Check Convex deployment status
4. **AI Not Responding**: Verify OpenAI API key and quota

### Debug Commands
```bash
# View app logs
expo start --logs

# Clear all data
npx expo start --clear

# Debug network requests
# Use React Native Debugger or Flipper
```

## Next Steps
After completing quickstart validation:
1. Run automated test suite
2. Perform cross-platform testing (iOS + Android)
3. Execute performance profiling
4. Begin user acceptance testing

**Quickstart Status**: Ready for execution
**Estimated Total Time**: 30-45 minutes
**Success Rate Target**: 100% scenario completion
