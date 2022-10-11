const path = require('path');

const express = require('express');
const app = express();
const cors = require('cors');
const got = require('got');
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
})

app.post('/album_id', async (req, res) => {
    if (!req.body) {
        return res.sendStatus(404);
    }

    const album_id = req.body.album_id;

    const headers = {
        Authorization: `Client-ID ${process.env.CLIENT_ID}`,
    }

    let response;
    try {
        response = await got.get(`https://api.imgur.com/3/album/${album_id}`, {
            headers,
            resolveBodyOnly: true,
            responseType: 'json',
        })
    } catch (error) {
        return res.sendStatus(404);
    }

    const imgs_tag = response.data.images.map(img => `<img src="${img.link}">`);

    res.json({
        imgs_tag
    });
})

app.listen(process.env.PORT || 3001, () => {
    console.log('Server is running...');
});
