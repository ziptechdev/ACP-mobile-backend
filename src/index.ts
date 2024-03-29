import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { httpLogger } from './middlewares/logger';
import router from './routes';
import { appEnv, port } from './config/vars';
import logger from './config/logger';
import {
  errorHandler,
  errorConverter,
  noEndpointError,
} from './middlewares/errors';
import { corsOptions } from './config/cors';

import User from './models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user: Partial<User>;
    token: string;
  }
}

// Create a new express application instance
const app = express();

// registered middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(httpLogger);
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

// main router middleware
app.use('/', router);

// swagger docs
if (appEnv !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// page not found handler
app.use(noEndpointError);

// error converter
app.use(errorConverter);

// error handler
app.use(errorHandler);

// serve app here
const server = app.listen(port, function () {
  logger.info(`acp-mobile-backend is listening on port ${port}`);
});

export { server, app };
