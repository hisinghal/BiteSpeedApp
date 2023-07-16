import { Router } from 'express';
import { dbPromise } from '../index.js';
import {dataToUpdate, newContactResult, makeResult} from '../utils.js';
const router = Router();


router.post('/identify',async (req, res) => {
	const db = await dbPromise;

	let result = {
		code: '',
		message: '',
	};

	let insertQuery = 'insert into contact (phoneNumber,email,linkPrecedence, linkedid) values (?,?,?,?) ';
	let updateQuery = 'UPDATE contact SET linkPrecedence = ? , linkedid = ? , updatedAt = ? where id in (';


	if(req.body.email == null && req.body.phoneNumber == null) {
		result.code = 400;
		result.message = 'Bad Request';
		res.setHeader('content-type', 'text/json');
		res.send(JSON.stringify(result));
	}

	else {
		try {
			let email = req.body.email;
			let phoneNumber = req.body.phoneNumber;
			let row = [];
			let query = 'select * from contact where email = ? OR phoneNumber = ?';
			if(email != null && phoneNumber != null)
			row = await db.all(query, [req.body.email, req.body.phoneNumber]);

			if(phoneNumber == null)
			{
				query = 'select * from contact where email = ?';
			row = await db.all(query, req.body.email);
		}


		if(email == null)	{
			query = 'select * from contact where phoneNumber = ?';
			row = await db.all(query, req.body.phoneNumber);
	}
			let primaryKeys = new Set();




			if( 0 == row.length) { // it is new entry;
				await db.run(insertQuery, [phoneNumber, email,"Primary",null]);
				result.contact = await newContactResult(email, phoneNumber);
			}

			else {
				let completeData = [];


				row.forEach(contact => {

					if(contact.linkPrecedence == "Primary") {primaryKeys.add(contact.id);}
					else if (contact.linkPrecedence == "Secondary") {primaryKeys.add(contact.linkedid);}
				});

			

				primaryKeys = Array.from(primaryKeys).join(",");
				let primaryKeyQuery = `select * from contact where (id IN ( ` + primaryKeys + `) AND linkPrecedence = "Primary") ` +
				`OR (linkedid IN ( `+ primaryKeys +`) AND linkPrecedence = "Secondary")`;




				completeData = await db.all(primaryKeyQuery);


				let toUpdate = await dataToUpdate(completeData, phoneNumber, email);


					if(toUpdate.contactToModify.length != 0) {
						let idString = toUpdate.contactToModify.join(","); 
						updateQuery += idString + `)`;
						let date = new Date();
						date.toISOString().replace(/([^T]+)T([^\.]+).*/g, '$1 $2');
						console.log(date);

					await db.run(updateQuery,["Secondary", toUpdate.primaryContact.id, date]);
				}

				let primaryContact = toUpdate.primaryContact;
				if(toUpdate.toInsert)
				await db.run(insertQuery, [phoneNumber, email,"Secondary",primaryContact.id]);
				result.contact = await makeResult(primaryContact);

			}
		result.code = 200;
		result.message = 'Query successful';
		res.setHeader('content-type', 'text/json');
		res.send(JSON.stringify(result));

	} catch(error) {
	console.log(error);


		result.code = 500;
	result.message = 'Server Error';
	res.setHeader('content-type', 'text/json');
	res.send(JSON.stringify(result));
				}
		}
});

export default router;
