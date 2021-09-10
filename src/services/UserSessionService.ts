import { decode } from "../utils/jwt.utils";
import { FilterQuery, LeanDocument, UpdateQuery } from "mongoose";
import { UserDocument } from "../models/User.model";
import UserSession, { UserSessionDocument } from "../models/UserSession.model";
import { sign } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./UserService";

export const createUserSession = async (userId: string, userAgent: string) => {
    try {
        const session = await UserSession.create({ user: userId, userAgent });
        return session.toJSON();
    } catch (error) {
        throw new Error(error as string);
    }
};

export const createAccessToken = ({
    user,
    session,
}: {
    user:
        | Omit<UserDocument, "password">
        | LeanDocument<Omit<UserDocument, "password">>;
    session:
        | Omit<UserSessionDocument, "password">
        | LeanDocument<Omit<UserSessionDocument, "password">>;
}) => {
    const accessToken = sign(
        { ...user, session: session._id },
        { expiresIn: process.env.ACCESS_TOKEN_TTL }
    );
    return accessToken;
};

export const createRefreshToken = ({
    session,
}: {
    session:
        | Omit<UserSessionDocument, "password">
        | LeanDocument<Omit<UserSessionDocument, "password">>;
}) => {
    const refreshToken = sign(session, {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
    });
    return refreshToken;
};

export const reissueAccessToken = async ({
    refreshToken,
}: {
    refreshToken: string;
}) => {
    //decode the refresh token, grab the session id
    const { decoded } = decode(refreshToken);
    if (!decoded || !get(decoded, "_id")) return false;

    //get the session
    const session = await UserSession.findById(get(decoded, "_id"));

    //check that the user session is still valid
    if (!session || !session?.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = createAccessToken({ user, session });

    return accessToken;
};

export const updateSession = async (
    query: FilterQuery<UserSessionDocument>,
    update: UpdateQuery<UserSessionDocument>
) => {
    return UserSession.updateOne(query, update);
};

export const findSessions = async (query: FilterQuery<UserSessionDocument>) => {
    return UserSession.find(query).lean();
};
