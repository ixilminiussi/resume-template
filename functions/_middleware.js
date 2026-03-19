const AUTH_COOKIE = 'resume-auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function loginPage(error) {
	return new Response(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Resume Editor</title>
<style>
* { margin: 0; box-sizing: border-box; }
html, body { height: 100%; }
body {
	background: #2a2a2a;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	color: #ccc;
}
.login {
	text-align: center;
}
.login h2 {
	font-size: 18px;
	font-weight: 600;
	color: #eee;
	margin-bottom: 16px;
}
.login form {
	display: flex;
	gap: 8px;
	justify-content: center;
}
.login input[type="password"] {
	background: #1e1e1e;
	border: 1px solid #555;
	border-radius: 6px;
	color: #ccc;
	font-size: 14px;
	padding: 8px 14px;
	outline: none;
	width: 200px;
}
.login input[type="password"]:focus {
	border-color: #888;
}
.login button {
	background: #444;
	border: 1px solid #555;
	border-radius: 6px;
	color: #eee;
	font-size: 14px;
	padding: 8px 18px;
	cursor: pointer;
}
.login button:hover {
	background: #555;
}
.error {
	color: #e55;
	font-size: 13px;
	margin-top: 12px;
}
</style>
</head>
<body>
<div class="login">
	<h2>Password Required</h2>
	<form method="POST">
		<input type="password" name="password" placeholder="Password..." autofocus>
		<button type="submit">Enter</button>
	</form>
	${error ? '<div class="error">Wrong password</div>' : ''}
</div>
</body>
</html>`, {
		status: error ? 403 : 401,
		headers: { 'Content-Type': 'text/html;charset=utf-8' }
	});
}

async function hashPassword(password) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(request, name) {
	const cookie = request.headers.get('Cookie') || '';
	const match = cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
	return match ? match[1] : null;
}

export async function onRequest(context) {
	const { request, env, next } = context;
	const sitePassword = env.SITE_PASSWORD;

	// No password set — allow through
	if (!sitePassword) return next();

	const expectedHash = await hashPassword(sitePassword);

	// Check auth cookie
	const token = getCookie(request, AUTH_COOKIE);
	if (token === expectedHash) return next();

	// Handle login form submission
	if (request.method === 'POST') {
		const formData = await request.formData();
		const password = formData.get('password') || '';

		if (password === sitePassword) {
			// Set cookie and redirect to same URL
			const response = new Response(null, {
				status: 302,
				headers: { 'Location': new URL(request.url).pathname }
			});
			response.headers.set('Set-Cookie',
				`${AUTH_COOKIE}=${expectedHash}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`
			);
			return response;
		}

		return loginPage(true);
	}

	return loginPage(false);
}
