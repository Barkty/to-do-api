import getTemplate from './index';

export const commonTemplate = (messageType: string, data: any) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Developer Foundry</title>
    <style>
      @import url("https://fonts.cdnfonts.com/css/product-sans");
      @import url("https://fonts.cdnfonts.com/css/poppins");

      body {
        font-family: "Poppins", sans-serif;
        font-size: 18px;
        line-height: 27px;
        margin: 0;
        padding: 0;
        background-color: #f4ede0;
        color: #000000;
      }

      .container {
        max-width: 640px;
        margin: 0 auto;
        width: 100%;
        background-color: #fff;
        border-radius: 8px;
      }

      .banner {
        padding: 20px;
        text-align: left;
        width: 100%;
        text-align: center;
        /* border-bottom: 1px solid #000; */
      }

      .banner h1 {
        margin: 0;
        font-size: 50px;
        font-weight: bold;
        font-family: "Product Sans", sans-serif;
        color: rgba(0, 82, 213, 1);
      }

      .banner h1 span {
        font-weight: 400;
        color: rgba(0, 82, 213, 0.89);
      }

      .content {
        padding: 20px;
      }

      .social-links {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: 6px;
        margin-top: 16px;
      }

      .social-links a {
        margin: 0 1px;
      }

      .app-links {
        display: flex;
        justify-content: center;
        width: 100%;
        padding-bottom: 20px;
      }

      .app-links a {
        margin: 0 10px;
      }
      .footer {
        background-color: #0052d5;
        border-radius: 4px;
        padding-top: 50px;
      }
      .footer p {
        color: #ffffff;
      }
      .footer h1 {
        font-size: 36px;
        font-weight: bold;
        font-family: "Product Sans", sans-serif;
        color: #ffffff;
      }
      .footerlogo {
        font-size: 36px;
        font-weight: bold;
        font-family: "Product Sans", sans-serif;
        color: #ffffff;
        text-align: center;
      }
      .footerlogo h1 span {
        font-weight: 400;
        color: #ffffff;
      }
    </style>
  </head>

  <body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px; background-color: 'red'">
          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="container"
            style="overflow: hidden"
          >
            <tr>
              <td class="banner">
                <div>
                  <h1>Developer Foundry</h1>
                </div>
              </td>
            </tr>
            <!-- content start -->
            ${getTemplate(messageType, { ...data, ...data.data })}
            <!--  footer -->
            <tr>
              <td
                style="background-color: #f4ede0; height: 10px; padding: 8px"
                align="center"
              ></td>
            </tr>
            <tr>
              <td align="center" class="footer">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        style="width: 10%"
                      >
                        <tr>
                          <td>
                            <div class="footerlogo">
                              <h1>Developer Foundry</h1>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <div class="app-links">
                              <a
                                href="https://apps.apple.com/us/app/stashwise/id123456789"
                                target="_blank"
                                ><img
                                  src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735771257/R3JvdXBfNDI3MzIwNzE2X2JucXFnYQ==/drilldown"
                                  alt="App Store"
                              /></a>
                              <a
                                href="https://play.google.com/store/apps/details?id=com.stashwise"
                                target="_blank"
                                ><img
                                  src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735770668/R3JvdXBfNDI3MzIwNzE1X3VmaXJ1OA==/drilldown"
                                  alt="Google Play"
                              /></a>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <div class="social-links">
                        <a target="_blank"
                          ><img
                            src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735772091/R3JvdXBfNDI3MzIwNzE3X20xOHVvbA==/drilldown"
                            alt="Youtube"
                        /></a>
                        <a target="_blank"
                          ><img
                            src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735772091/R3JvdXBfNDI3MzIwNzIwX3F0bmwzZQ==/drilldown"
                            alt="Tiktok"
                        /></a>
                        <a href="#" target="_blank"
                          ><img
                            src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735772091/R3JvdXBfNDI3MzIwNzIxX3BjYWh6dQ==/drilldown"
                            alt="Instagram"
                        /></a>
                        <a href="#" target="_blank"
                          ><img
                            src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735772146/R3JvdXBfNDI3MzIwNzE5X2F3bmhqNA==/drilldown"
                            alt="Twitter"
                        /></a>
                        <a href="#" target="_blank"
                          ><img
                            src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735772091/R3JvdXBfNDI3MzIwNzIyX3hpczVhbw==/drilldown"
                            alt="Facebook"
                        /></a>
                        <a
                          href="https://www.linkedin.com/company/stashwisehq"
                          target="_blank"
                          ><img
                            src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735772091/R3JvdXBfNDI3MzIwNzE4X2wwZnFwZA==/drilldown"
                            alt="LinkedIn"
                        /></a>
                      </div>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    text-align: center;
                    font-size: 12px;
                    color: #ffffff;
                    font-weight: 400;
                    padding: 0px 50px;
                  "
                >
                  You are receiving this message because you signed up on
                  Developer Foundry. For more information about how we process data,
                  please see our Privacy Policy.
                </p>
                <p
                  style="
                    display: block;
                    text-align: center;
                    font-size: 12px;
                    color: #ffffff;
                    font-weight: 400;
                    padding: 0px 50px;
                  "
                >
                  If you experience any problems kindly contact us at
                  <br />gkotoye@gmail.com or send us a WhatsApp message
                  at<br />+2348122281320
                </p>
                <div style="display: flex; justify-content: space-between">
                  <img
                    src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735774883/aW1hZ2VfNDVfZGZjZ3Rp/drilldown"
                    alt=""
                    width="150px"
                    height="150px"
                  />
                  <p
                    style="
                      text-align: center;
                      font-size: 12px;
                      color: #ffffff;
                      font-weight: 400;
                    "
                  >
                    Copyright ©2025 Developer Foundry Technologies Limited.<br />All
                    rights reserved
                  </p>
                  <img
                    src="https://res-console.cloudinary.com/dtbviqqdh/thumbnails/v1/image/upload/v1735774883/aW1hZ2VfNDZfZGF6bzVi/drilldown"
                    alt=""
                    width="180px"
                    height="150px"
                  />
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
