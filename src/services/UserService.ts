import { DocumentDefinition, FilterQuery } from "mongoose";
import User, { UserDocument } from "../models/User.model";
import log from "../logger";
import { omit } from "lodash";

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
    try {
        return await User.create(input);
    } catch (error) {
        throw new Error(error as string);
    }
};

export const findUser = async (query: FilterQuery<UserDocument>) => {
    return User.findOne(query).lean();
};

export const validateUserPassword = async ({
    email,
    password,
}: {
    email: UserDocument["email"];
    password: string;
}) => {
    //find the user
    const user = await User.findOne({ email });

    if (!user) return false; //can't find the user

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) return false; //incorrect password

    return omit(user.toJSON(), "password");
};
