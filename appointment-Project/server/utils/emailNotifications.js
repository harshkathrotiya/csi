const nodemailer = require('nodemailer');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const emailTemplates = {
  appointmentConfirmation: (appointment, user, staff, service) => ({
    subject: 'Appointment Confirmation',
    html: `
      <h2>Appointment Confirmed</h2>
      <p>Dear ${user.name},</p>
      <p>Your appointment has been confirmed with the following details:</p>
      <ul>
        <li>Service: ${service.name}</li>
        <li>Staff: ${staff.name}</li>
        <li>Date: ${new Date(appointment.startTime).toLocaleDateString()}</li>
        <li>Time: ${new Date(appointment.startTime).toLocaleTimeString()} - ${new Date(appointment.endTime).toLocaleTimeString()}</li>
      </ul>
      <p>Thank you for choosing our service!</p>
    `
  }),

  appointmentReminder: (appointment, user, staff, service) => ({
    subject: 'Appointment Reminder',
    html: `
      <h2>Appointment Reminder</h2>
      <p>Dear ${user.name},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li>Service: ${service.name}</li>
        <li>Staff: ${staff.name}</li>
        <li>Date: ${new Date(appointment.startTime).toLocaleDateString()}</li>
        <li>Time: ${new Date(appointment.startTime).toLocaleTimeString()}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `
  }),

  appointmentCancellation: (appointment, user, service) => ({
    subject: 'Appointment Cancellation',
    html: `
      <h2>Appointment Cancelled</h2>
      <p>Dear ${user.name},</p>
      <p>Your appointment has been cancelled:</p>
      <ul>
        <li>Service: ${service.name}</li>
        <li>Date: ${new Date(appointment.startTime).toLocaleDateString()}</li>
        <li>Time: ${new Date(appointment.startTime).toLocaleTimeString()}</li>
      </ul>
      <p>If you did not request this cancellation, please contact us immediately.</p>
    `
  }),

  paymentConfirmation: (appointment, user, service, payment) => ({
    subject: 'Payment Confirmation',
    html: `
      <h2>Payment Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>We have received your payment for the following appointment:</p>
      <ul>
        <li>Service: ${service.name}</li>
        <li>Amount: ₹${payment.amount}</li>
        <li>Transaction ID: ${payment.razorpayPaymentId}</li>
        <li>Date: ${new Date(appointment.startTime).toLocaleDateString()}</li>
      </ul>
      <p>Thank you for your payment!</p>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const { subject, html } = emailTemplates[template](data.appointment, data.user, data.staff, data.service);

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Schedule reminder emails
const scheduleReminderEmail = async (appointment) => {
  try {
    const reminderTime = new Date(appointment.startTime);
    reminderTime.setHours(reminderTime.getHours() - 24); // 24 hours before appointment

    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(async () => {
        const populatedAppointment = await appointment
          .populate('user')
          .populate('staff')
          .populate('service');

        await sendEmail(
          populatedAppointment.user.email,
          'appointmentReminder',
          {
            appointment: populatedAppointment,
            user: populatedAppointment.user,
            staff: populatedAppointment.staff,
            service: populatedAppointment.service
          }
        );
      }, delay);
    }
  } catch (error) {
    console.error('Failed to schedule reminder email:', error);
  }
};

module.exports = {
  sendEmail,
  scheduleReminderEmail
};