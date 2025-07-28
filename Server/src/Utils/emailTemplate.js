export const getVerificationEmailTemplate = (name, verificationCode) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background-color: #1677ff; color: white; padding: 40px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 40px; text-align: center; color: #333; }
            .content p { font-size: 16px; line-height: 1.6; }
            .code { font-size: 48px; font-weight: bold; letter-spacing: 10px; margin: 30px 0; color: #1677ff; background-color: #f0f8ff; padding: 15px 20px; border-radius: 8px; display: inline-block; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                <p>Thank you for registering with our platform. Please use the verification code below to complete your registration.</p>
                <div class="code">${verificationCode}</div>
                <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your College App. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};