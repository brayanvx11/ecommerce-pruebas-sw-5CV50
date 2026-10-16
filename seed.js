import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initialProducts } from './src/data/initialProducts.js';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log("Iniciando conexión con Firebase para el proyecto:", firebaseConfig.projectId);

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Error: No se encontraron las credenciales VITE_FIREBASE_* en el archivo .env");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log(`Subiendo ${initialProducts.length} productos a la colección 'products' en Firestore...`);
  
  for (const product of initialProducts) {
    try {
      await setDoc(doc(db, 'products', product.id), product);
      console.log(`✓ Producto guardado: [${product.id}] ${product.name}`);
    } catch (err) {
      console.error(`✗ Error al guardar ${product.id}:`, err.message);
    }
  }

  console.log("\n¡Carga de productos completada exitosamente!");
  process.exit(0);
}

seed();
