import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { Button, Spinner, TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import FormHeader, { FormContainer } from "@/components/form";
import { useNetwork } from "@/contexts/network-context";
import { SyncManager } from "@/lib/sync-manager";
import { api } from "~/backend/_generated/api";

const mealTypes = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "snack", label: "Snack" },
  { key: "drink", label: "Drink" },
] as const;

const moodOptions = [
  { key: "terrible", label: "Terrible" },
  { key: "poor", label: "Poor" },
  { key: "okay", label: "Okay" },
  { key: "good", label: "Good" },
  { key: "excellent", label: "Excellent" },
] as const;

const sources = [
  { key: "manual", label: "Manual Entry" },
  { key: "photo_recognition", label: "Photo Recognition" },
  { key: "barcode_scan", label: "Barcode Scan" },
] as const;

export default function LogMealScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useNetwork();
  const syncManager = SyncManager.getInstance();

  // Form state
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<string>("");
  const [mealTime] = useState(new Date());
  const [location, setLocation] = useState("");
  const [withOthers, setWithOthers] = useState(false);
  const [mood, setMood] = useState<string>("");
  const [source, setSource] = useState<string>("manual");
  const [notes, setNotes] = useState("");

  // Food items state
  const [foodItems, setFoodItems] = useState<
    Array<{
      id: string;
      name: string;
      brand?: string;
      quantity: number;
      unit: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>
  >([]);

  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodBrand, setNewFoodBrand] = useState("");
  const [newFoodQuantity, setNewFoodQuantity] = useState("");
  const [newFoodUnit, setNewFoodUnit] = useState("");
  const [newFoodCalories, setNewFoodCalories] = useState("");
  const [newFoodProtein, setNewFoodProtein] = useState("");
  const [newFoodCarbs, setNewFoodCarbs] = useState("");
  const [newFoodFat, setNewFoodFat] = useState("");

  const createMeal = useMutation(api.meals.createMeal);

  const addFoodItem = () => {
    if (!newFoodName.trim()) {
      toast.error("Please enter food name");
      return;
    }

    if (!newFoodQuantity.trim() || !newFoodUnit.trim()) {
      toast.error("Please enter quantity and unit");
      return;
    }

    const quantity = Number.parseFloat(newFoodQuantity);
    const calories = Number.parseFloat(newFoodCalories || "0");
    const protein = Number.parseFloat(newFoodProtein || "0");
    const carbs = Number.parseFloat(newFoodCarbs || "0");
    const fat = Number.parseFloat(newFoodFat || "0");

    if (Number.isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: newFoodName.trim(),
      brand: newFoodBrand.trim() || undefined,
      quantity,
      unit: newFoodUnit.trim(),
      calories,
      protein,
      carbs,
      fat,
    };

    setFoodItems([...foodItems, newItem]);

    // Reset form
    setNewFoodName("");
    setNewFoodBrand("");
    setNewFoodQuantity("");
    setNewFoodUnit("");
    setNewFoodCalories("");
    setNewFoodProtein("");
    setNewFoodCarbs("");
    setNewFoodFat("");

    toast.success("Food item added!");
  };

  const removeFoodItem = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const calculateTotalNutrition = () => {
    return foodItems.reduce(
      (total, item) => ({
        calories: total.calories + item.calories,
        protein: total.protein + item.protein,
        carbs: total.carbs + item.carbs,
        fat: total.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  };

  const handleSave = async () => {
    if (!mealName.trim()) {
      toast.error("Please enter a meal name");
      return;
    }

    if (!mealType) {
      toast.error("Please select a meal type");
      return;
    }

    if (foodItems.length === 0) {
      toast.error("Please add at least one food item");
      return;
    }

    if (!mood) {
      toast.error("Please select your mood");
      return;
    }

    setIsLoading(true);
    try {
      const totalNutrition = calculateTotalNutrition();

      const mealData = {
        name: mealName.trim(),
        type: mealType as any,
        mealTime: mealTime.getTime(),
        foods: foodItems.map((item) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          quantity: item.quantity,
          unit: item.unit,
          nutrition: {
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
          },
        })),
        totalNutrition,
        location: location.trim() || undefined,
        withOthers,
        mood: mood as any,
        source: source as any,
        notes: notes.trim() || undefined,
        photoUrls: [], // TODO: Add photo support in future iteration
      };

      if (isOnline) {
        // Try to save online first
        try {
          await createMeal(mealData);
          toast.success("Meal logged successfully!");
        } catch (error) {
          // If online save fails, fall back to offline
          console.warn("Online save failed, saving offline:", error);
          const _offlineId = syncManager.addMealToQueue(mealData, "create");
          toast.success(
            "Meal saved offline. Will sync when connection is restored.",
          );
        }
      } else {
        // Save offline
        const _offlineId = syncManager.addMealToQueue(mealData, "create");
        toast.success(
          "Meal saved offline. Will sync when connection is restored.",
        );
      }

      router.back();
    } catch (error) {
      console.error("Error logging meal:", error);
      toast.error("Failed to log meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <FormContainer>
      <FormHeader
        title="Log Meal"
        description="Record your food intake and nutrition"
        containerClassName="mt-12"
      />

      {/* Basic Information */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          Basic Information
        </Text>

        <TextField isRequired>
          <TextField.Input
            className="rounded-3xl"
            placeholder="e.g., Grilled Chicken Salad"
            value={mealName}
            onChangeText={setMealName}
          >
            <TextField.InputStartContent className="pointer-events-none">
              <Ionicons
                name="restaurant-outline"
                size={16}
                color={colors.mutedForeground}
              />
            </TextField.InputStartContent>
          </TextField.Input>
        </TextField>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Meal Type *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                className={`rounded-lg border px-4 py-2 ${
                  mealType === type.key
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background"
                }`}
                onPress={() => setMealType(type.key)}
              >
                <Text
                  className={`text-sm ${
                    mealType === type.key ? "font-medium" : "text-foreground"
                  }`}
                  style={{
                    color:
                      mealType === type.key ? colors.accent : colors.foreground,
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextField>
          <TextField.Input
            className="rounded-3xl"
            placeholder="Location (optional)"
            value={location}
            onChangeText={setLocation}
          >
            <TextField.InputStartContent className="pointer-events-none">
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.mutedForeground}
              />
            </TextField.InputStartContent>
          </TextField.Input>
        </TextField>

        <View className="flex-row items-center justify-between">
          <Text className="text-foreground">Eating with others?</Text>
          <TouchableOpacity
            className={`rounded-lg border px-4 py-2 ${
              withOthers
                ? "border-accent bg-accent/10"
                : "border-border bg-background"
            }`}
            onPress={() => setWithOthers(!withOthers)}
          >
            <Text
              className={`text-sm ${
                withOthers ? "font-medium" : "text-foreground"
              }`}
              style={{
                color: withOthers ? colors.accent : colors.foreground,
              }}
            >
              {withOthers ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Food Items */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          Food Items
        </Text>

        {/* Add Food Form */}
        <View className="gap-3 rounded-lg border border-border bg-background p-4">
          <Text className="font-medium text-foreground text-sm">
            Add Food Item
          </Text>

          <TextField>
            <TextField.Input
              className="rounded-3xl"
              placeholder="Food name (e.g., Grilled Chicken Breast)"
              value={newFoodName}
              onChangeText={setNewFoodName}
            >
              <TextField.InputStartContent className="pointer-events-none">
                <Ionicons
                  name="nutrition-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
              </TextField.InputStartContent>
            </TextField.Input>
          </TextField>

          <TextField>
            <TextField.Input
              className="rounded-3xl"
              placeholder="Brand (optional)"
              value={newFoodBrand}
              onChangeText={setNewFoodBrand}
            >
              <TextField.InputStartContent className="pointer-events-none">
                <Ionicons
                  name="business-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
              </TextField.InputStartContent>
            </TextField.Input>
          </TextField>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  className="rounded-3xl"
                  placeholder="Quantity"
                  value={newFoodQuantity}
                  onChangeText={setNewFoodQuantity}
                  keyboardType="numeric"
                />
              </TextField>
            </View>
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  className="rounded-3xl"
                  placeholder="Unit (g, ml, cup)"
                  value={newFoodUnit}
                  onChangeText={setNewFoodUnit}
                />
              </TextField>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  className="rounded-3xl"
                  placeholder="Calories"
                  value={newFoodCalories}
                  onChangeText={setNewFoodCalories}
                  keyboardType="numeric"
                />
              </TextField>
            </View>
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  className="rounded-3xl"
                  placeholder="Protein (g)"
                  value={newFoodProtein}
                  onChangeText={setNewFoodProtein}
                  keyboardType="numeric"
                />
              </TextField>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  className="rounded-3xl"
                  placeholder="Carbs (g)"
                  value={newFoodCarbs}
                  onChangeText={setNewFoodCarbs}
                  keyboardType="numeric"
                />
              </TextField>
            </View>
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  className="rounded-3xl"
                  placeholder="Fat (g)"
                  value={newFoodFat}
                  onChangeText={setNewFoodFat}
                  keyboardType="numeric"
                />
              </TextField>
            </View>
          </View>

          <TouchableOpacity
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: colors.accent }}
            onPress={addFoodItem}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons name="add" size={20} color={colors.background} />
              <Text className="font-semibold text-background">
                Add Food Item
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Food Items List */}
        {foodItems.length > 0 && (
          <View className="gap-3">
            <Text className="font-medium text-foreground text-sm">
              Added Items ({foodItems.length})
            </Text>
            {foodItems.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <View className="flex-1">
                  <Text className="font-medium text-foreground">
                    {item.name}
                  </Text>
                  {item.brand && (
                    <Text className="text-muted-foreground text-sm">
                      {item.brand}
                    </Text>
                  )}
                  <Text className="text-muted-foreground text-sm">
                    {item.quantity} {item.unit} • {item.calories} cal
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFoodItem(item.id)}
                  className="rounded-full bg-destructive/10 p-2"
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Total Nutrition */}
        {foodItems.length > 0 && (
          <View
            className="rounded-lg border p-4"
            style={{
              borderColor: colors.accent + "33", // 20% opacity
              backgroundColor: colors.accent + "0D", // 5% opacity
            }}
          >
            <Text
              className="mb-2 text-center font-semibold"
              style={{ color: colors.accent }}
            >
              Total Nutrition
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="font-bold text-foreground text-lg">
                  {totalNutrition.calories.toFixed(0)}
                </Text>
                <Text className="text-muted-foreground text-xs">Calories</Text>
              </View>
              <View className="items-center">
                <Text className="font-bold text-foreground text-lg">
                  {totalNutrition.protein.toFixed(1)}g
                </Text>
                <Text className="text-muted-foreground text-xs">Protein</Text>
              </View>
              <View className="items-center">
                <Text className="font-bold text-foreground text-lg">
                  {totalNutrition.carbs.toFixed(1)}g
                </Text>
                <Text className="text-muted-foreground text-xs">Carbs</Text>
              </View>
              <View className="items-center">
                <Text className="font-bold text-foreground text-lg">
                  {totalNutrition.fat.toFixed(1)}g
                </Text>
                <Text className="text-muted-foreground text-xs">Fat</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* How You Felt */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          How You Felt
        </Text>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">
            Mood After Eating *
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                className={`rounded-lg border px-4 py-2 ${
                  mood === option.key
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background"
                }`}
                onPress={() => setMood(option.key)}
              >
                <Text
                  className={`text-sm ${
                    mood === option.key ? "font-medium" : "text-foreground"
                  }`}
                  style={{
                    color:
                      mood === option.key ? colors.accent : colors.foreground,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="font-medium text-foreground text-sm">Source</Text>
          <View className="flex-row flex-wrap gap-2">
            {sources.map((sourceOption) => (
              <TouchableOpacity
                key={sourceOption.key}
                className={`rounded-lg border px-4 py-2 ${
                  source === sourceOption.key
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background"
                }`}
                onPress={() => setSource(sourceOption.key)}
              >
                <Text
                  className={`text-sm ${
                    source === sourceOption.key
                      ? "font-medium"
                      : "text-foreground"
                  }`}
                  style={{
                    color:
                      source === sourceOption.key
                        ? colors.accent
                        : colors.foreground,
                  }}
                >
                  {sourceOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Notes */}
      <View className="gap-4">
        <Text className="font-semibold text-foreground text-lg">
          Additional Notes
        </Text>

        <TextField>
          <TextField.Input
            className="rounded-3xl"
            placeholder="Any additional thoughts about your meal..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          >
            <TextField.InputStartContent className="pointer-events-none">
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.mutedForeground}
              />
            </TextField.InputStartContent>
          </TextField.Input>
        </TextField>
      </View>

      {/* Action Buttons */}
      <View className="gap-3 pb-6">
        <Button
          onPress={handleSave}
          disabled={isLoading}
          className="rounded-3xl"
        >
          <Button.LabelContent>
            {isLoading ? "Logging Meal..." : "Log Meal"}
          </Button.LabelContent>
          <Button.EndContent>
            {isLoading ? <Spinner color={colors.background} /> : null}
          </Button.EndContent>
        </Button>

        <Button
          variant="ghost"
          onPress={() => router.back()}
          disabled={isLoading}
          className="rounded-3xl"
        >
          <Button.LabelContent>Cancel</Button.LabelContent>
        </Button>
      </View>
    </FormContainer>
  );
}
