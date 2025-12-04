// import nodemailer from "nodemailer";
// import config from "../config";

// // Create a test account or replace with real credentials.
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port:  config.node_env ==="development"? 465: 587,
//   secure: config.node_env ==="development", // true for 465, false for other ports
//   auth: {
//     user: config.nodemailer.APP_USER,
//     pass: config.nodemailer.APP_PASS,
//   },
// });

// interface ISendEmail {
//   subject: string;
//   text?: string;
//   html?: string;
//   email: string;
//   otp?: string;
// }

// export const sendMail = async (payload: ISendEmail) => {
//   const { email, subject, text, html, otp } = payload;

//   if (!email || !subject) {
//     throw new Error("Email and Subject are required");
//   }

//   console.log("email sending start....");

//   const info = await transporter.sendMail({
//     from: '"Travelynk Security" <no-reply@travelynk.com>',
//     to: email,
//     subject,

//     text:
//       text ??
//       (otp
//         ? `Your OTP Code is ${otp}. This code will expire in 5 minutes.`
//         : undefined),

//     html:
//       html ??
//       (otp
//         ? `
//         <div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
//           <table width="100%" cellpadding="0" cellspacing="0">
//             <tr>
//               <td align="center" style="padding:40px 0;">
//                 <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 6px 18px rgba(0,0,0,0.08);">

//                   <tr>
//                     <td align="center" style="font-size:26px;font-weight:700;color:#1e293b;">
//                       Verify Your Identity
//                     </td>
//                   </tr>

//                   <tr>
//                     <td align="center" style="padding:14px 0 22px;font-size:15px;color:#64748b;line-height:1.6;">
//                       Use the verification code below to complete your authentication.  
//                       This code will expire in <b>5 minutes</b>.
//                     </td>
//                   </tr>

//                   <tr>
//                     <td align="center">
//                       <div style="
//                         display:inline-block;
//                         letter-spacing:10px;
//                         font-size:32px;
//                         font-weight:700;
//                         color:#0f172a;
//                         background:#f1f5f9;
//                         padding:14px 24px;
//                         border-radius:10px;
//                         border:1px dashed #cbd5f5;
//                       ">
//                         ${otp}
//                       </div>
//                     </td>
//                   </tr>

//                   <tr>
//                     <td align="center" style="padding-top:26px;font-size:14px;color:#64748b;">
//                       If you didn’t request this, you can safely ignore this email.
//                     </td>
//                   </tr>

//                   <tr>
//                     <td align="center" style="padding-top:34px;font-size:12px;color:#94a3b8;">
//                       © ${new Date().getFullYear()} Travelynk. All rights reserved.
//                     </td>
//                   </tr>

//                 </table>
//               </td>
//             </tr>
//           </table>
//         </div>
//         `
//         : undefined),
//   });

//   console.log("Message send: ", info);

//   return {
//     messageId: info.messageId,
//     accepted: info.accepted,
//     rejected: info.rejected,
//   };
// };
