import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const sign = (object: Object, options?: jwt.SignOptions | undefined) => {
    return jwt.sign(object, process.env.JWT_SECRET as Secret, options);
};

export const decode = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        return { valid: true, expired: false, decoded: decoded }; //jwt verification successful, access token is valid
    } catch (error) {
        //token is invalid
        console.log({ error });
        return {
            valid: false,
            //@ts-ignore
            expired: error.message === "jwt expired",
            decoded: null,
        };
    }
};
