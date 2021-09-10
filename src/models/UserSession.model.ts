import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument } from "./User.model";

//typescript interface for mongodb document
export interface UserSessionDocument extends mongoose.Document {
    user: UserDocument["_id"];
    valid: boolean;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

//mongoose model
const UserSessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        valid: { type: Boolean, default: true },
        userAgent: { type: String },
    },
    { timestamps: true }
);

const UserSession = mongoose.model<UserSessionDocument>(
    "UserSession",
    UserSessionSchema
);
export default UserSession;
