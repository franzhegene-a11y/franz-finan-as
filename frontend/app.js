function login() {
  const username = document.querySelector('input[type=text]').value;
  const password = document.querySelector('input[type=password]').value;

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      localStorage.setItem('logado', 'sim');
      window.location.href = 'dashboard.html';
    })
    .catch(() => alert('Usuário ou senha inválidos'));
}
