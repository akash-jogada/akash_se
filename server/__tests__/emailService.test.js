const nodemailer = require("nodemailer");
const sendEmail = require("../utils/emailService");

jest.mock("nodemailer");

describe("sendEmail utility", () => {
  beforeEach(() => {
    process.env.EMAIL_USER = "user@test.com";
    process.env.EMAIL_PASSWORD = "pass";
    process.env.EMAIL_HOST = "smtp.test";
    process.env.EMAIL_PORT = "587";
    process.env.EMAIL_FROM_NAME = "TestSender";

    // Reset mock implementations
    nodemailer.createTransport = jest.fn();
  });

  it("creates transporter and sends mail with expected fields", async () => {
    const sendMailMock = jest.fn().mockResolvedValue(true);
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const options = { to: "to@test.com", subject: "Hello", html: "<p>hi</p>" };
    await sendEmail(options);

    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith({
      from: expect.stringContaining("TestSender"),
      to: "to@test.com",
      subject: "Hello",
      html: "<p>hi</p>",
    });
  });
});
