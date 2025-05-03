import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = process.env.N8N_FLOW_WEBHOOK_URL || 'https://n8n.example.com/webhook';
    const token = process.env.N8N_FLOW_AUTHORIZATION_SECRET_KEY;

    // Ensure token is available
    if (!token) {
        return res.status(500).json({ error: 'API token is missing' });
    }

    try {
        const response = await axios.post(
            url,
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to forward request' });
    }
}
