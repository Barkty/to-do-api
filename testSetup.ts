import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false);

const { DEV_FOUNDRY_TEST_DATABASE_URL, DEV_FOUNDRY_TEST_DATABASE_NAME } = process.env

/**
 * Disconnect test database during teardowns
 */
const disconnect = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB after testing.");
    }
};

/**
 * Deletes all collections [it is meant for the test databases during teardowns]
 */
const truncate = async () => {
    if (mongoose.connection.readyState !== 0) {
        const { collections } = mongoose.connection;
        const promises = Object.keys(collections).map((collection) =>
            mongoose.connection.collection(collection).deleteMany({})
        );
        await Promise.all(promises);
    }
};

before(async function () {
/**
 * Connect to database
 */
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(DEV_FOUNDRY_TEST_DATABASE_URL!, {
                dbName: DEV_FOUNDRY_TEST_DATABASE_NAME,
                serverSelectionTimeoutMS: 30000
            });
            console.log("Connected to database");
        }
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error; // Ensure Mocha knows about the failure
    }
})

after(async function () {
    await truncate();
    await disconnect();
});
// Initialize google fire-store database
// export const dbFireStore = admin.firestore();