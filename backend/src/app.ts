import express from 'express';
import cors from 'cors';
import reportRouter from './adaper/in/report.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api', reportRouter);

// error handler (validator + app errors)
app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({
        error: err.message,
        details: err.errors,
    });
});

export default app;
