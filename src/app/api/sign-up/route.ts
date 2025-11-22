import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const trimmedUsername = username.trim();
        const normalizedUsername = trimmedUsername.toLowerCase();

        // Check if username is already taken (verified accounts only)
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: normalizedUsername,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                { success: false, message: "Username already taken." },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    { success: false, message: "Email already registered." },
                    { status: 500 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                existingUserByEmail.username = normalizedUsername; // lowercase
                existingUserByEmail.displayName = trimmedUsername;  // original case
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new UserModel({
                username: normalizedUsername,     // lowercase for backend
                displayName: trimmedUsername,     // original case for UI
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 3600000),
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            trimmedUsername, // send original cased name
            email,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email."
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json(
            {
                success: false,
                message: "Error registering User, Internal server error."
            },
            { status: 500 }
        );
    }
}
