import { defineConfig } from 'cypress';
import * as util from 'util';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    experimentalWebKitSupport: true,
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log(message);

          return null;
        },

        table(message) {
          console.table(util.inspect(message, { maxArrayLength: null }));

          return null;
        },
      });
    },
  },
});
