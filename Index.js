const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log('Server started on port 3000');
})

db.sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch((err) => {
        console.log('Error syncing database:', err);
    });

app.post('/komiks', async (req, res) => {
    const data = req.body;
    try {
        const komik = await db.Komik.create(data);
        res.send(komik);
    } catch (error) {
        res.send(err);

    }
});
app.get('/komiks', async (req, res) => {
    try {
        const komiks = await db.Komik.findAll();
        res.send(komiks);
    } catch (error) {
        res.send(err);
    }   
});
app.put('/komiks/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ error: 'Komik tidak ditemukan' });
        }
        await komik.update(data);
        res.send(komik);
    } catch (error) {
        res.send(err);
    }
});
app.delete('/komiks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ error: 'Komik tidak ditemukan' });
        }
        await komik.destroy();
        res.send({ message: 'Komik berhasil dihapus' });
    } catch (error) {
        res.send(err);
    }
});
