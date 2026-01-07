import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import crypto from "crypto";
import sendEmail from "../../../../../lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Generate a new verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Update user with new token
    await prisma.user.update({
      where: { email },
      data: {
        verifyToken,
      },
    });

    const verifyUrl = `http://localhost:3000/verify?token=${verifyToken}`;

    // Send email
    await sendEmail({
      to: email,
      subject: "NORI Email Verification",
      html: `
      <div style="background: linear-gradient(to bottom, #ffe4e6, #fed7aa); padding: 60px 0;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="text-align: center;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" style="
                background: white;
                border-radius: 16px;
                padding: 40px 32px;
                max-width: 440px;
                width: 100%;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                font-family: 'Outfit', 'Figtree', sans-serif;
              ">
                <tr>
                  <td>
                    <h2 style="
                      font-size: 24px;
                      font-weight: bold;
                      color: #F27D88;
                      margin-bottom: 20px;
                    ">
                      Verify your email to join NORI
                    </h2>
                    <p style="font-size: 15px; color: #444;">
                      Click the button below to complete your sign up and start learning Japanese with NORI 🍥
                    </p>
                    <div style="margin: 30px 0;">
                      <a href="${verifyUrl}" style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #F27D88;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        font-size: 16px;
                      ">
                        Verify Email
                      </a>
                    </div>
                    <p style="font-size: 13px; color: #888;">
                      If you didn’t request this, just ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    });

    return NextResponse.json({ message: "Verification email resent." });
  } catch (err) {
    console.error("❌ Resend Verification API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
