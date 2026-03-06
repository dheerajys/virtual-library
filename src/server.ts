import { Model, createServer } from 'miragejs';

const makeMockServer = ({ environment }) => {
  return createServer({
    environment,
    models: {
      emails: Model,
    },
    routes() {
      // Set namespace to empty to avoid prefixing
      this.namespace = '';

      // Only intercept specific email routes on the same domain
      this.get('/api/email-list', (schema) => schema.all('emails'));

      this.post('/api/add-email', (schema, request) => {
        const newEmail = JSON.parse(request.requestBody);
        return schema.create('emails', newEmail);
      });

      this.delete('/api/delete-email', (schema, request) => {
        const { id } = JSON.parse(request.requestBody);
        schema.find('emails', id).destroy();
        return null;
      });

      // CRITICAL: Passthrough ALL other requests
      // This allows external API calls to http://localhost:56357 to pass through
      this.passthrough();
      this.passthrough('http://localhost:56357/**');
      this.passthrough((request) => {
        // Log passthrough for debugging
        // eslint-disable-next-line no-console
        console.log('Mirage passthrough:', request.url);
        return true;
      });
    },
  });
};

export default makeMockServer;
