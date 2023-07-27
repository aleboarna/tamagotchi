import express, { Application, NextFunction, Request, Response } from 'express';
import { LogService } from './services/log-service';
import {
  EntryCreateRequestPayload,
  EntryGetResponsePayload,
} from '@tamagotchi/types';
import { PlatformException } from './exceptions/PlatformException';
import { ErrorTypes } from './exceptions';
import helmet from 'helmet';
import cors from 'cors';
import Ajv from 'ajv';

const app: Application = express();
const service: LogService = new LogService();
const ajv = new Ajv();

app.use(helmet());
app.use(cors());
app.use(express.json());

const schema = {
  type: 'object',
  properties: {
    userName: { type: 'string' },
    age: { type: 'string' },
    happiness: { type: 'string' },
    health: { type: 'string' },
    maxLifeCycles: { type: 'integer' },
    retryCount: { type: 'integer' },
  },
  required: [
    'userName',
    'age',
    'happiness',
    'health',
    'maxLifeCycles',
    'retryCount',
  ],
};

const validate = ajv.compile(schema);

app.post(
  `/v1/add`,
  async (
    req: Request<never, never, EntryCreateRequestPayload>,
    res: Response
  ) => {
    if (validate(req.body)) {
      const { userName, age, health, happiness, maxLifeCycles, retryCount } =
        req.body;
      try {
        await service.addEntry({
          userName,
          age,
          health,
          happiness,
          maxLifeCycles,
          retryCount,
        });
        res.status(200).json({});
      } catch (e) {
        const error = <PlatformException>e;
        res
          .status(error.status)
          .json({ message: error.message, code: error.name });
      }
    } else {
      const error = new PlatformException(
        ErrorTypes.APIErrorCodes.INVALID_REQUEST_BODY
      );
      res.status(error.status).json({
        message: validate.errors ? validate.errors[0].message : error.message,
        code: error.name,
      });
    }
  }
);

app.get('/v1/user/:userName', async (req: Request, res: Response, next) => {
  const { userName } = req.params;
  const entry = await service.getEntry(userName);
  if (entry !== undefined) {
    const response: EntryGetResponsePayload = {
      userName: entry.userName,
      age: entry.age,
      happiness: entry.happiness,
      health: entry.health,
      maxLifeCycles: entry.maxLifeCycles,
      retryCount: entry.retryCount,
    };
    res.json(response);
  } else {
    const error = new PlatformException(
      ErrorTypes.APIErrorCodes.INVALID_REQUEST_PATH
    );
    res.status(error.status).json({ message: error.message, code: error.name });
  }
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new PlatformException(ErrorTypes.APIErrorCodes.INVALID_REQUEST_PATH));
});

//=====MIDDLEWARE
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(
  (err: PlatformException, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      res.status(err.status).json({ message: err.message, code: err.name });
    } else {
      next();
    }
  }
);
//=====MIDDLEWARE

export { app };
