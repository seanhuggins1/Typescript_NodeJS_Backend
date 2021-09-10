import mongoose from "mongoose";
import log from "../logger";

export const connect = async () => {
    const dbUri = process.env.MONGO_URI as string;
    console.log(dbUri);

    const connection = await mongoose
        .connect(dbUri)
        .then(() => log.info("Connected to the database."))
        .catch((error) => {
            log.error("Error connecting to the database");
            log.error(error);
            process.exit(1);
        });

    return connection;
};
