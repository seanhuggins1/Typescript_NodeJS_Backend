import { object, string, ref } from "yup";
export const createUserValidationSchema = object({
    body: object({
        name: string().required("Name is required"),
        passwordConfirmation: string()
            .required("Password confirmation is required")
            .oneOf([ref("password"), null], "Passwords must match"),
        password: string()
            .required("Password is required")
            .min(6, "Password is too short - should be 6 chars minimum.")
            .matches(
                /^[a-zA-Z0-9_.-]*$/,
                "Password can only contain Latin letters."
            ),
        email: string()
            .email("Must be a valid email")
            .required("Email is required"),
    }),
});
