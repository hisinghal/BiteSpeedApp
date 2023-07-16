import { dbPromise } from './index.js';

const newContactResult = async(email, phoneNumber) => {
	const db = await dbPromise;

	let row = [];
	let query = "";
	if(email != null)
	{
		query = 'select * from contact where email =  ?';
		row = await db.all(query, email);
	} else {
		query = 'select * from contact where phoneNumber = ?';
		row = await db.all(query, phoneNumber);
	}

	let resp = {
	primaryContactId:'',
	emails: [],
	phoneNumbers: [],
	SecondaryContactIds: []
	};

	resp.primaryContactId = row[0].id;

	if(row[0].email != null)
	resp.emails.push( row[0].email);

	if(row[0].phoneNumber != null)
	resp.phoneNumbers.push( row[0].phoneNumber);

		return resp;
	};

	const makeResult = async (primaryContact) => {
		const db = await dbPromise;
		let resp = {
		primaryContactId:'',
		emails: [],
		phoneNumbers: [],
		SecondaryContactIds: []
		};

	try{
	let query = 'select * from contact where linkedid = ? ';
	let row = await db.all(query, primaryContact.id);

	resp.primaryContactId = primaryContact.id;
	let uniqueEmail = new Set();
	let uniquePhoneNumber = new Set();

	if(primaryContact.email != null)
	uniqueEmail.add(primaryContact.email);

	if(primaryContact.phoneNumber != null)
	uniquePhoneNumber.add(primaryContact.phoneNumber);

	for(let i =0; i<row.length; i++) {
		if(row[i].email != null) uniqueEmail.add(row[i].email);
		if(row[i].phoneNumber != null) uniquePhoneNumber.add(row[i].phoneNumber);
		resp.SecondaryContactIds.push(row[i].id);
	}

	resp.emails = Array.from(uniqueEmail);
	resp.phoneNumbers = Array.from(uniquePhoneNumber);

	return resp;
	} catch(error) {
		console.log(error);
		throw error;
	}

	};



	const dataToUpdate = async(res, phoneNumber, email) => {


		let isEmailNew = true;
		let isPhoneNew = true;
		if(phoneNumber == null) isPhoneNew = false;
		if(email == null) isEmailNew = false;
		let toInsert = true;
	let result = {};
	if(res.length == 0) return result;

			res.sort((a,b) => {
				return a.createdAt-b.createdAt;
			});


	let primaryId = res[0].id;
	let contactsToModify = new Set();
	for(let i =0; i<res.length; i++) {
		if(res[i].id != primaryId && res[i].linkedid != primaryId) contactsToModify.add(res[i].id);
	}

	for(let i=0; i<res.length; i++) {
		if(res[i].phoneNumber != null && phoneNumber != null &&  res[i].phoneNumber == phoneNumber) {isPhoneNew = false;}
		if(res[i].email != null && email != null &&  res[i].email == email) {isEmailNew = false;}
	}
	if(!isPhoneNew && !isEmailNew) toInsert = false;
	result.contactToModify = Array.from(contactsToModify);
	result.primaryContact = res[0];
	result.toInsert = toInsert;
	return result;
}

export {
	makeResult,
	dataToUpdate,
	newContactResult

};
