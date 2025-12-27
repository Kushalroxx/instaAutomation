import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'InstaAutomation API Server',
        version: '1.0.0',
        status: 'running'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Instagram agent endpoints (placeholders for now)
app.get('/api/agents', (req, res) => {
    res.json({
        agents: [
            {
                id: 1,
                name: 'Customer Support Agent',
                status: 'active',
                messagesHandled: 1247,
                responseTime: '2.3s'
            },
            {
                id: 2,
                name: 'Sales Agent',
                status: 'active',
                messagesHandled: 856,
                responseTime: '1.8s'
            }
        ]
    });
});

app.post('/api/agents', (req, res) => {
    const { name, type } = req.body;
    res.status(201).json({
        id: Date.now(),
        name,
        type,
        status: 'created',
        message: 'Agent created successfully'
    });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
    res.json({
        totalMessages: 2847,
        responseRate: 98.5,
        avgResponseTime: '2.1s',
        activeCampaigns: 12
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.url} not found`
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 InstaAutomation Backend Server is running!`);
    console.log(`📡 API Server: http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health\n`);
});
