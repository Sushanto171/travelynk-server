
export const generateEmailHtml = (title: string, bodyContent: string, otp?: string) => `
  <div style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px 0;">
          <table width="100%" style="max-width:500px;background:#ffffff;border-radius:8px;padding:24px;box-shadow:0 3px 12px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="font-size:22px;font-weight:600;color:#1a202c;padding-bottom:12px;">
                ${title}
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="font-size:14px;color:#4a5568;line-height:1.5;text-align:center;padding-bottom:20px;">
                ${bodyContent}
              </td>
            </tr>

            ${otp ? `
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <div style="
                  display:inline-block;
                  letter-spacing:8px;
                  font-size:28px;
                  font-weight:700;
                  color:#1a202c;
                  background:#edf2f7;
                  padding:12px 20px;
                  border-radius:6px;
                  border:1px dashed #cbd5e0;
                ">
                  ${otp}
                </div>
              </td>
            </tr>` : ''}

            <!-- Footer -->
            <tr>
              <td align="center" style="font-size:12px;color:#a0aec0;">
                © ${new Date().getFullYear()} Travelynk. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`;
