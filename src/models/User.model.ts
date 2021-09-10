import mongoose from "mongoose";
import bcrypt from "bcrypt";

//typescript interface for mongodb document
export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

//mongoose model
const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next: any) {
    //I don't understand this line of code
    let user = this as UserDocument;
    if (!user.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    return next();
});

//used for logging in
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    //I don't understand this line of code
    const user = this as UserDocument;

    return bcrypt
        .compare(candidatePassword, user.password)
        .catch((error) => false);
};

const User = mongoose.model<UserDocument>("User", UserSchema);
export default User;
