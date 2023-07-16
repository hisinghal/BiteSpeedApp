import { Router } from 'express';
import { dbPromise } from '../index.js';
const router = Router();

router.get('/get',async (req, res) => {
    let result = {
		code: '',
		message: '',
	};

    const db = await dbPromise;
    const messages = await db.all("SELECT * FROM Contact;");
    console.log("get")
    console.log(messages)

    result.code = 200;
    result.message = 'Good Request';
    res.setHeader('content-type', 'text/json');
    res.send(JSON.stringify(result));
});

router.post('/add',async (req, res) => {
    let result = {
		code: '',
		message: '',
	};

    const db = await dbPromise;
    const { email, phoneNumber } = req.body;

    await db.run(
      "INSERT INTO Contact (email, phoneNumber) VALUES (?, ?)",
      email,
      phoneNumber
    );

    result.code = 200;
    result.message = 'Good Request';
    res.setHeader('content-type', 'text/json');
    res.send(JSON.stringify(result));
});

export default router;
