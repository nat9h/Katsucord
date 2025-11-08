import mongoose from "mongoose";
import logger from "./logger";

export async function connectDatabase(): Promise<void> {
	try {
		if (!process.env.MONGODB_URI) {
			logger.warn(
				"No MongoDB URI provided, skipping database connection"
			);
			return;
		}

		mongoose.connection.on("connected", () => {
			logger.info("Mongoose connected to database.");
		});

		mongoose.connection.on("error", (err) => {
			logger.error("Mongoose connection error:", err);
		});

		mongoose.connection.on("disconnected", () => {
			logger.warn("Mongoose disconnected from database.");
		});

		await mongoose.connect(process.env.MONGODB_URI);
	} catch (error) {
		logger.error("Database connection error:", error);
		throw error;
	}
}

export async function disconnectDatabase(): Promise<void> {
	try {
		await mongoose.disconnect();
	} catch (error) {
		logger.error("Database disconnection error:", error);
		throw error;
	}
}
