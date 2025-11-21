const axios = require('axios');
(async () => {
  try {
    const ts = Math.floor(Date.now() / 1000);
    const res = await axios.post('http://localhost:3000/register', {
      user_name: `test_${ts}`,
      user_email: `test_${ts}@example.com`,
      user_password: 'secret123'
    }, { timeout: 5000 });
    console.log('STATUS:', res.status);
    console.log('DATA:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('RESPONSE ERROR', err.response.status, err.response.data);
    } else {
      console.error('REQUEST ERROR', err.message);
    }
    process.exit(1);
  }
})();
