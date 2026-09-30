export async function onRequestPost(context) {
    try {
        const { request, env } = context;

        if (!env.GROQ_KEY) {
            return Response.json(
                { error: 'GROQ_KEY is missing in Cloudflare settings.' },
                { status: 500 }
            );
        }

        const body = await request.json();

        if (!body || !Array.isArray(body.messages)) {
            return Response.json(
                { error: 'The messages field must be an array.' },
                { status: 400 }
            );
        }

        const trimmedMessages = body.messages.slice(-20).map((message) => ({
            role: message.role || 'user',
            content: typeof message.content === 'string' ? message.content.slice(0, 4000) : ''
        }));

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.GROQ_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                messages: trimmedMessages
            }),
            signal: AbortSignal.timeout(20000)
        });

        const data = await response.json();

        if (!response.ok) {
            return Response.json(
                {
                    error: 'Groq API error',
                    details: data
                },
                { status: response.status }
            );
        }

        return Response.json(data);
    } catch (error) {
        return Response.json(
            {
                error: 'Cloudflare function failed',
                details: error?.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}

