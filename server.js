const express = require('express');
const app = express();
const const PORT = process.env.PORT || 3000;;

// فایل‌های استاتیک (html, css, js) رو سرو کن
app.use(express.static(__dirname));

// یک مسیر API ساده برای تست
app.get('/api/hello', (req, res) => {
  res.json({ message: 'سلام از بک‌اند!' });
});

app.listen(PORT, () => {
  console.log(`سرور روی http://localhost:${PORT} در حال اجراست`);
});
