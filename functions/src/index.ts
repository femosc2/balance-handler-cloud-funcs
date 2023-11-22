import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

interface EventData {
  adjustment: number;
  customerId: string;
  id: string;
  time: number;
  type: string;
}

exports.addEvent = functions.https.onCall(
  async (data: EventData, context: functions.https.CallableContext) => {
    // Verifying that all necessary fields are present
    if (
      !data.adjustment ||
      !data.customerId ||
      !data.id ||
      !data.time ||
      !data.type
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing one or more required fields"
      );
    }

    // Verify the data types of each field
    if (
      typeof data.adjustment !== "number" ||
      typeof data.customerId !== "string" ||
      typeof data.id !== "string" ||
      typeof data.time !== "number" ||
      typeof data.type !== "string"
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid data type for one or more fields"
      );
    }

    const databaseRef = admin.database().ref("events");

    // Adding the new event
    try {
      await databaseRef.push(data);
      return { result: `Event with ID ${data.id} added successfully.` };
    } catch (error) {
      throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while adding the event",
        error
      );
    }
  }
);
