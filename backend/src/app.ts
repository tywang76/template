import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { middleware as openapi } from 'express-openapi-validator';
import nodeRouter from './adaper/in/node.routes.js';
import spec from '../openapi.json' with { type: 'json' }; // import generated spec

const app = express();
app.use(cors());
app.use(express.json());

// enforce contract at runtime (requests + responses)
app.use(
    openapi({
        apiSpec: spec as any,
        validateRequests: true,
        validateResponses: true,
    })
);

// routes
app.use('/api/node', nodeRouter);

// error handler (validator + app errors)
app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({
        error: err.message,
        details: err.errors,
    });
});

export default app;
