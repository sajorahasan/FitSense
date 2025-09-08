import { Text, View } from "react-native";

/* ----------------------------- form container ----------------------------- */
export function FormContainer({ children }: { children: React.ReactNode }) {
	/**
	 * reason for this FormContainer is to later add keyboard avoiding view
	 * to the form
	 *
	 * i think maybe that would be a good idea??
	 */
	return <View className="flex-1 gap-4 px-6">{children}</View>;
}
/* ------------------------------- form header ------------------------------ */
export default function FormHeader({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<View className="gap-2">
			<Text className="font-extrabold text-4xl text-foreground">{title}</Text>
			<Text className="text-muted-foreground">{description}</Text>
		</View>
	);
}
