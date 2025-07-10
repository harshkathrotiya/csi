const { google } = require('googleapis');

class GoogleCalendarService {
  constructor() {
    this.calendar = google.calendar({
      version: 'v3',
      auth: new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
    });
  }

  async getAuthUrl() {
    const oauth2Client = this.calendar.context._options.auth;
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async setCredentials(code) {
    const oauth2Client = this.calendar.context._options.auth;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  }

  async createEvent(appointment) {
    try {
      const event = {
        summary: `${appointment.service.name} Appointment`,
        description: `Appointment with ${appointment.staff.name}`,
        start: {
          dateTime: appointment.startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: appointment.endTime,
          timeZone: 'UTC',
        },
        attendees: [
          { email: appointment.user.email },
          { email: appointment.staff.email }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 }
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  async updateEvent(eventId, appointment) {
    try {
      const event = {
        summary: `${appointment.service.name} Appointment`,
        description: `Appointment with ${appointment.staff.name}`,
        start: {
          dateTime: appointment.startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: appointment.endTime,
          timeZone: 'UTC',
        },
        attendees: [
          { email: appointment.user.email },
          { email: appointment.staff.email }
        ],
      };

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw error;
    }
  }
}

module.exports = new GoogleCalendarService();