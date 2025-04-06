import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, updateDoc, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAoyid-IeEEJriJbvHjtF1ptWUmcDH0gmQ",
    authDomain: "crdt-03.firebaseapp.com",
    projectId: "crdt-03",
    storageBucket: "crdt-03.firebasestorage.app",
    messagingSenderId: "4718582918",
    appId: "1:4718582918:web:3da3b38e77baf6c1630507",
    measurementId: "G-VRDD11VLEB"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getFirestore(app);
const firestoreDB = getFirestore(app);

// WebRTC configuration (same as original)
const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Firestore wrapper to maintain a similar API to the older version
const firestore = {
  collection: (collectionPath) => {
    return {
      doc: (docId) => {
        const docRef = docId ? doc(firestoreDB, collectionPath, docId) : doc(collection(firestoreDB, collectionPath));
        
        return {
          id: docRef.id,
          collection: (subCollectionPath) => {
            return {
              add: (data) => addDoc(collection(firestoreDB, collectionPath, docRef.id, subCollectionPath), data),
              get: async () => {
                const querySnapshot = await getDocs(collection(firestoreDB, collectionPath, docRef.id, subCollectionPath));
                return {
                  forEach: (callback) => querySnapshot.forEach((doc) => callback({ ref: { delete: () => deleteDoc(doc.ref) }, data: () => doc.data() })),
                };
              },
              onSnapshot: (callback) => {
                return onSnapshot(collection(firestoreDB, collectionPath, docRef.id, subCollectionPath), (snapshot) => {
                  callback({
                    docChanges: () => snapshot.docChanges().map(change => ({
                      type: change.type,
                      doc: {
                        data: () => change.doc.data()
                      }
                    }))
                  });
                });
              }
            };
          },
          set: (data) => setDoc(docRef, data),
          update: (data) => updateDoc(docRef, data),
          get: async () => {
            const docSnap = await getDoc(docRef);
            return {
              exists: docSnap.exists(),
              data: () => docSnap.data()
            };
          },
          onSnapshot: (callback) => {
            return onSnapshot(docRef, (doc) => {
              callback({
                data: () => doc.data()
              });
            });
          },
          delete: () => deleteDoc(docRef)
        };
      },
      add: (data) => addDoc(collection(firestoreDB, collectionPath), data)
    };
  }
};


export const saveCodeToFirestore = async (roomId, code) => {
  try {
    await setDoc(doc(db, "rooms", roomId), { code }, { merge: true });
    console.log("Code saved to Firestore",roomId);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
};

export const loadCodeFromFirestore = async (roomId) => {
  try {
    const docSnap = await getDoc(doc(db, "rooms", roomId));
    if (docSnap.exists()) {
      console.log("Loaded from Firestore:", docSnap.data().code);
      return docSnap.data().code;
    } else {
      console.log("No code found in Firestore");
      return "";
    }
  } catch (error) {
    console.error("Error loading from Firestore:", error);
    return "";
  }
};

export { firestore, servers };



