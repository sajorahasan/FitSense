// Contract Tests for FitSense API
// These tests MUST fail initially - implement endpoints to make them pass
// Run with: npm test -- --testPathPattern=contract-tests

const axios = require("axios");
const { expect } = require("@jest/globals");

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3210/v1";

// Test data factories
const _createTestUser = () => ({
  email: `test-${Date.now()}@fitsense.com`,
  displayName: "Test User",
  fitnessLevel: "beginner",
  primaryGoal: "weight_loss",
  privacyLevel: "private",
  deviceId: "test-device-123",
  timezone: "UTC",
});

const createTestWorkout = (_userId) => ({
  name: "Test Workout",
  type: "cardio",
  startTime: new Date().toISOString(),
  exercises: [
    {
      name: "Running",
      duration: 30,
      distance: 5,
    },
  ],
  mood: "good",
});

const createTestMeal = (_userId) => ({
  type: "breakfast",
  mealTime: new Date().toISOString(),
  foods: [
    {
      name: "Banana",
      quantity: 1,
      unit: "medium",
      nutrition: {
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
      },
    },
  ],
});

const createTestHealthMetric = (_userId) => ({
  type: "weight",
  value: 75.5,
  unit: "kg",
  timestamp: new Date().toISOString(),
});

const createTestGoal = (_userId) => ({
  title: "Lose 5kg",
  category: "weight",
  targetValue: 70,
  targetUnit: "kg",
  targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
});

// Authentication helper
const getAuthToken = async () => {
  // This will fail until authentication is implemented
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email: "test@fitsense.com",
    password: "testpass123",
  });
  return response.data.token;
};

// Test suites
describe("FitSense API Contract Tests", () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // This test will fail until authentication is implemented
    try {
      authToken = await getAuthToken();
    } catch (_error) {
      // Expected to fail initially
      console.log("Authentication not implemented yet - expected failure");
    }
  });

  describe("User Profile Management", () => {
    test("GET /users/profile - should retrieve user profile", async () => {
      // This test MUST fail initially
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("id");
      expect(response.data).toHaveProperty("email");
      expect(response.data.fitnessLevel).toBeDefined();
    });

    test("PUT /users/profile - should update user profile", async () => {
      // This test MUST fail initially
      const updates = {
        displayName: "Updated Test User",
        fitnessLevel: "intermediate",
      };

      const response = await axios.put(`${API_BASE_URL}/users/profile`, updates, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data.displayName).toBe("Updated Test User");
      expect(response.data.fitnessLevel).toBe("intermediate");
    });
  });

  describe("Workout Management", () => {
    test("POST /workouts - should create workout session", async () => {
      // This test MUST fail initially
      const workoutData = createTestWorkout(testUserId);

      const response = await axios.post(`${API_BASE_URL}/workouts`, workoutData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("id");
      expect(response.data.name).toBe("Test Workout");
      expect(response.data.type).toBe("cardio");
      expect(response.data.exercises).toHaveLength(1);

      testWorkoutId = response.data.id;
    });

    test("GET /workouts - should list workout sessions", async () => {
      // This test MUST fail initially
      const response = await axios.get(`${API_BASE_URL}/workouts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("workouts");
      expect(Array.isArray(response.data.workouts)).toBe(true);
    });

    test("GET /workouts/{workoutId} - should retrieve specific workout", async () => {
      // This test MUST fail initially
      const response = await axios.get(`${API_BASE_URL}/workouts/${testWorkoutId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testWorkoutId);
      expect(response.data.name).toBe("Test Workout");
    });

    test("PUT /workouts/{workoutId} - should update workout session", async () => {
      // This test MUST fail initially
      const updates = {
        name: "Updated Test Workout",
        mood: "excellent",
      };

      const response = await axios.put(`${API_BASE_URL}/workouts/${testWorkoutId}`, updates, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data.name).toBe("Updated Test Workout");
      expect(response.data.mood).toBe("excellent");
    });

    test("DELETE /workouts/{workoutId} - should delete workout session", async () => {
      // This test MUST fail initially
      const response = await axios.delete(`${API_BASE_URL}/workouts/${testWorkoutId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(204);
    });
  });

  describe("Meal Management", () => {
    test("POST /meals - should create meal entry", async () => {
      // This test MUST fail initially
      const mealData = createTestMeal(testUserId);

      const response = await axios.post(`${API_BASE_URL}/meals`, mealData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("id");
      expect(response.data.type).toBe("breakfast");
      expect(response.data.foods).toHaveLength(1);
      expect(response.data.totalNutrition).toBeDefined();

      _testMealId = response.data.id;
    });

    test("GET /meals - should list meal entries", async () => {
      // This test MUST fail initially
      const response = await axios.get(`${API_BASE_URL}/meals`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("meals");
      expect(Array.isArray(response.data.meals)).toBe(true);
    });
  });

  describe("AI Insights", () => {
    test("GET /insights - should retrieve AI insights", async () => {
      // This test MUST fail initially
      const response = await axios.get(`${API_BASE_URL}/insights`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("insights");
      expect(Array.isArray(response.data.insights)).toBe(true);
    });

    test("POST /insights/generate - should generate AI insight", async () => {
      // This test MUST fail initially
      const requestData = {
        type: "workout_analysis",
        date_range: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          end: new Date().toISOString().split("T")[0],
        },
      };

      const response = await axios.post(`${API_BASE_URL}/insights/generate`, requestData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(202);
      expect(response.data).toHaveProperty("insight_id");
      expect(response.data.status).toBe("processing");
    });
  });

  describe("Chat Assistant", () => {
    test("POST /chat/messages - should send chat message", async () => {
      // This test MUST fail initially
      const messageData = {
        message: "What workout should I do today?",
        context: {
          current_view: "dashboard",
        },
      };

      const response = await axios.post(`${API_BASE_URL}/chat/messages`, messageData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("response");
      expect(response.data).toHaveProperty("suggestions");
      expect(typeof response.data.response).toBe("string");
    });
  });

  describe("Goals Management", () => {
    test("POST /goals - should create goal", async () => {
      // This test MUST fail initially
      const goalData = createTestGoal(testUserId);

      const response = await axios.post(`${API_BASE_URL}/goals`, goalData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("id");
      expect(response.data.title).toBe("Lose 5kg");
      expect(response.data.status).toBe("active");

      testGoalId = response.data.id;
    });

    test("GET /goals - should list goals", async () => {
      // This test MUST fail initially
      const response = await axios.get(`${API_BASE_URL}/goals`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("goals");
      expect(Array.isArray(response.data.goals)).toBe(true);
    });

    test("POST /goals/{goalId}/progress - should update goal progress", async () => {
      // This test MUST fail initially
      const progressData = {
        current_value: 74.5,
        notes: "Good progress this week!",
      };

      const response = await axios.post(`${API_BASE_URL}/goals/${testGoalId}/progress`, progressData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data.currentValue).toBe(74.5);
      expect(response.data.status).toBe("active");
    });
  });

  describe("Health Metrics", () => {
    test("POST /metrics - should record health metric", async () => {
      // This test MUST fail initially
      const metricData = createTestHealthMetric(testUserId);

      const response = await axios.post(`${API_BASE_URL}/metrics`, metricData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("id");
      expect(response.data.type).toBe("weight");
      expect(response.data.value).toBe(75.5);

      _testMetricId = response.data.id;
    });

    test("GET /metrics - should list health metrics", async () => {
      // This test MUST fail initially
      const response = await axios.get(`${API_BASE_URL}/metrics`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("metrics");
      expect(Array.isArray(response.data.metrics)).toBe(true);
    });
  });

  describe("Error Handling", () => {
    test("should return 401 for invalid authentication", async () => {
      // This test MUST fail initially
      try {
        await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: "Bearer invalid-token" },
        });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe("unauthorized");
      }
    });

    test("should return 404 for non-existent resource", async () => {
      // This test MUST fail initially
      try {
        await axios.get(`${API_BASE_URL}/workouts/non-existent-id`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.error).toBe("not_found");
      }
    });

    test("should return 400 for invalid request data", async () => {
      // This test MUST fail initially
      try {
        await axios.post(
          `${API_BASE_URL}/workouts`,
          {
            invalid_field: "invalid_value",
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBeDefined();
      }
    });
  });
});

// Global test variables
let testWorkoutId;
let _testMealId;
let testGoalId;
let _testMetricId;
