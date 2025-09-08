export const requireEnv = (name: string) => {
	const value = process.env[name];
	if (value === undefined) {
		throw new Error(`Missing environment variable \`${name}\``);
	}
	return value;
};

export const getEnvironment = () => {
	return process.env.CONVEX_ENV || "development";
};
export const isDevelopment = () => getEnvironment() === "development";
export const isProduction = () => getEnvironment() === "production";
