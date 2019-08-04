import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const snapshot = await admin.database().ref('/messages').push({original});

    res.redirect(303, snapshot.ref.toString());
});

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original').onCreate((snapshot, context) => {
    const original = snapshot.val();
    console.log('Uppercasing ', context.params.pushId, original);

    const uppercase = original.toUpperCase();
    if (snapshot.ref.parent === null) {
        return null;
    }
    return snapshot.ref.parent.child('uppercase').set(uppercase);
});
