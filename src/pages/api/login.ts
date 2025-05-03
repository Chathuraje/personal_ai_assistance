import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { generateJwtToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = process.env.N8n_FLOW_LOGIN_URL || 'https://n8n.example.com/webhook';

    try {
        const token = await generateJwtToken();
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
