import nodemailer from "nodemailer"

export const emailSignUp = async(data) => {
  const { email, name, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const info = await transport.sendMail({
    from: '"UpTask - Software project manager" <accounts@uptask.com>',
    to: email,
    subject: "UpTask - Verify email address",
    text: "Verify your email address by the next link",
    html: `
      <p>Hi: ${name}. Verify your UpTask account</p>
      <p>Your account is almost ready. Follow the next link: 
        <a href="${process.env.CLIENT_URL}/confirm-account/${token}">Verify account</a>
      </p>
      <p>If you have not created this account, ignore this message</p>
    `
  })

}

export const emailForgotPassword = async(data) => {
  const { email, name, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const info = await transport.sendMail({
    from: '"UpTask - Software project manager" <accounts@uptask.com>',
    to: email,
    subject: "UpTask - Restore your password",
    text: "Restore your password",
    html: `
      <p>Hi: ${name}. You've asked for restoring your password</p>
      <p>By following you'll be able to restore your password: 
        <a href="${process.env.CLIENT_URL}/forgot-password/${token}">New password</a>
      </p>
      <p>If you have not required this service, ignore this message</p>
    `
  })

}
