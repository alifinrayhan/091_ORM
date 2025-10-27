const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});

db.sequelize.sync()
.then((result) => {
    app.listen(port, () => {
        console.log(`App running at http://localhost:${port}`);
    });
}
).catch((err) => {
    console.log(err);
});
