export async function onRequest(context) {
	const { request, env } = context;
	const url = new URL(request.url);
	const method = request.method;

	const headers = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	};

	if (method === 'OPTIONS') {
		return new Response(null, {
			headers: { ...headers, 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS' },
		});
	}

	if (method === 'GET') {
		const owner = url.searchParams.get('owner');
		if (!owner) return new Response(JSON.stringify({ error: 'owner required' }), { status: 400, headers });
		const { results } = await env.DB.prepare(
			'SELECT id, label, state_json, created_at FROM templates WHERE owner = ? ORDER BY created_at ASC'
		).bind(owner).all();
		return new Response(JSON.stringify({ templates: results }), { headers });
	}

	if (method === 'POST') {
		const body = await request.json();
		const { owner, id, label, state_json } = body;
		if (!owner || !id || !label) {
			return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400, headers });
		}
		await env.DB.prepare(
			`INSERT INTO templates (id, owner, label, state_json, created_at)
			 VALUES (?, ?, ?, ?, unixepoch())
			 ON CONFLICT(id) DO UPDATE SET label = excluded.label, state_json = excluded.state_json`
		).bind(id, owner, label, state_json || '{}').run();
		return new Response(JSON.stringify({ ok: true }), { headers });
	}

	if (method === 'PATCH') {
		const id = url.searchParams.get('id');
		if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers });
		const { label } = await request.json();
		await env.DB.prepare('UPDATE templates SET label = ? WHERE id = ?').bind(label, id).run();
		return new Response(JSON.stringify({ ok: true }), { headers });
	}

	if (method === 'DELETE') {
		const id = url.searchParams.get('id');
		if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers });
		await env.DB.prepare('DELETE FROM templates WHERE id = ?').bind(id).run();
		return new Response(JSON.stringify({ ok: true }), { headers });
	}

	return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405, headers });
}
