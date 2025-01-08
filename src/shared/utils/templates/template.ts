export const signup = (data: any) => `
<tr>
                        <td class="content">
                            <p>Hi ${data.first_name}👌,</p>
                            <p>Welcome to Developer Foundry, your new partner in smart learning and investing! Congratulations! We're thrilled you've joined our community of savvy savers. You've taken the first step towards a fun and rewarding learnings journey.
</p> 
                            <p>Here's what you can do now:</p>
                            <ol>
                                <li>Verify your identity </li>
                                <li>Add a valid debit card </li>
                                <li>Set up your first learnings goal</li>
                                <li>Explore our game features</li>
                                <li>Invite friends and boost your rewards</li>
                            </ol>
                    <p>Enjoy gamified learnings and rewards that make financial growth fun! If you have any questions or need help getting started, we're always here for you.
</p>
                            <p style="font-size: 18px; color: #3A3F4E; font-weight: 400; margin: 24px 0px;">
                                Happy Learning!<br>The Developer Foundry Team</p>
                        </td>
                    </tr>  
                    `;

export const forgot_password = (data: any) => `
<tr>
                        <td class="content">
                            <p>Hello ${data.first_name},</p>
                            <p>You requested to change your password. Kindly use the OTP below.
                            </p>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellspacing="0" cellpadding="0" style="width: 10%;">
                                            <tr>
                                                <td align="center"
                                                    style="border-radius: 8px; background-color: #f5f5f5; color: #0052D5; padding: 5px;">
                                                    <h1 style="letter-spacing: 7px;">${data.otp}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>   
                            <p>The OTP is valid for the next ${data.expireTime} minutes. If you didn't request this, please ignore this email.
</p>
                            <p style="font-size: 18px; color: #3A3F4E; font-weight: 400; margin: 24px 0px;">
                                Happy Learning!<br>The Developer Foundry Team</p>
                        </td>
                    </tr>  
`;

export const resend_otp = (data: any) => `
<tr>
                        <td class="content">
                            <p>Hello ${data.first_name},</p>
                            <p>Kindly complete your email verification using the code below.
                            </p>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellspacing="0" cellpadding="0" style="width: 10%;">
                                            <tr>
                                                <td align="center"
                                                    style="border-radius: 8px; background-color: #f5f5f5; color: #0052D5; padding: 5px;">
                                                    <h1 style="letter-spacing: 7px;">${data.otp}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>   
                            <p>The OTP is valid for the next ${data.expireTime} minutes. If you didn't request this, please ignore this email.
</p>
                            <p style="font-size: 18px; color: #3A3F4E; font-weight: 400; margin: 24px 0px;">
                                Happy Learning!<br>The Developer Foundry Team</p>
                        </td>
                    </tr>  `;

export const password_change = (data: any) => `
<tr>
                        <td class="content">
                            Dear ${data.first_name}👌,</p>
                            <p>Your Developer Foundry account ${data.type} has been successfully changed on ${data.date} at ${data.time}.
                            If you made this change, no further action is needed. If you didn't make this change, please reset your password immediately or contact our support team.
                            <br/>Keeping your account secure is our top priority, and we're always here to help.</p> 

                            <p> If you didn't initiate this request, you can ignore this mail. </p>
                            <p style="font-size: 18px; color: #3A3F4E; font-weight: 400; margin: 24px 0px;">
                                Happy Learning!<br>The Developer Foundry Team</p>
                        </td>
                    </tr>  
`;

export const login = (data: any) => `
    <tr>
                        <td class="content">
                            <p>Hello ${data.first_name}👌,</p>
                            <p>We noticed a new login to your Developer Foundry account on ${data.date} at ${data.time} from ${data.device}, ${data.location}.</p> 

                            <p> Kindly use the OTP below to verify your login. </p>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellspacing="0" cellpadding="0" style="width: 10%;">
                                            <tr>
                                                <td align="center"
                                                    style="border-radius: 8px; background-color: #f5f5f5; color: #0052D5; padding: 5px;">
                                                    <h1 style="letter-spacing: 7px;">${data.otp}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>  
                            <p>The OTP is valid for the next ${data.expireTime} minutes.</p>
                            <p style="font-size: 18px; color: #3A3F4E; font-weight: 400; margin: 24px 0px;">
                                Stay safe and keep learning!
!<br>The Developer Foundry Team</p>
                        </td>
                    </tr> 
`;
