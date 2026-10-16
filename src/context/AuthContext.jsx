import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  isFirebaseConfigured, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut, 
  fbSendResetEmail,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc
} from '../services/firebase';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'ecommerce_current_user';
const STORAGE_KEY_ALL_USERS = 'ecommerce_registered_users';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (saved) return JSON.parse(saved);
    const defaults = [
      {
        id: 'usr-admin',
        name: 'Administrador Demo',
        email: 'admin@tienda.com',
        password: 'admin123password',
        role: 'Administrador'
      },
      {
        id: 'usr-cliente',
        name: 'Cliente Demo',
        email: 'cliente@tienda.com',
        password: 'cliente123password',
        role: 'Cliente'
      }
    ];
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(defaults));
    return defaults;
  });

  // Listener para sincronización con Firebase Auth en tiempo real
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userRole = 'Cliente';
        let userName = firebaseUser.displayName || firebaseUser.email.split('@')[0];

        // Consultar Firestore si existe documento de perfil para obtener rol
        if (db) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              userRole = data.role || 'Cliente';
              userName = data.name || userName;
            } else {
              // Guardar en Firestore si es nuevo usuario
              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userName,
                role: userRole,
                createdAt: new Date().toISOString()
              });
            }
          } catch (e) {
            console.warn('Error leyendo rol de Firestore:', e);
          }
        }

        const appUser = {
          id: firebaseUser.uid,
          name: userName,
          email: firebaseUser.email,
          role: userRole,
          photoURL: firebaseUser.photoURL
        };

        setCurrentUser(appUser);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  }, [users]);

  // Registro con Email/Password (Firebase o Local Fallback)
  const register = async ({ name, email, password, role = 'Cliente' }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const appUser = {
          id: userCred.user.uid,
          name: name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role
        };

        if (db) {
          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            name: appUser.name,
            email: cleanEmail,
            role,
            createdAt: new Date().toISOString()
          });
        }

        setCurrentUser(appUser);
        return appUser;
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('El correo electrónico ya se encuentra registrado en Firebase.');
        } else if (err.code === 'auth/weak-password') {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        } else {
          throw new Error(err.message || 'Error al registrarse en Firebase.');
        }
      }
    }

    // Modo local
    const exists = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email: cleanEmail,
      password,
      role
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  // Inicio de sesión con Email/Password
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        let userRole = 'Cliente';
        let userName = userCred.user.displayName || cleanEmail.split('@')[0];

        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
            if (userDoc.exists()) {
              userRole = userDoc.data().role || 'Cliente';
              userName = userDoc.data().name || userName;
            }
          } catch (e) {
            console.warn(e);
          }
        }

        const appUser = {
          id: userCred.user.uid,
          name: userName,
          email: cleanEmail,
          role: userRole
        };
        setCurrentUser(appUser);
        return appUser;
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
        }
        throw new Error(err.message || 'Error al iniciar sesión con Firebase.');
      }
    }

    // Modo local
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (!user) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    }
    setCurrentUser(user);
    return user;
  };

  // Inicio de sesión con Google
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase no está completamente configurado en las variables de entorno.');
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      let userRole = 'Cliente';
      let userName = user.displayName || user.email.split('@')[0];

      if (db) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            userRole = snap.data().role || 'Cliente';
            userName = snap.data().name || userName;
          } else {
            await setDoc(userDocRef, {
              uid: user.uid,
              name: userName,
              email: user.email,
              role: 'Cliente',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn(e);
        }
      }

      const appUser = {
        id: user.uid,
        name: userName,
        email: user.email,
        role: userRole,
        photoURL: user.photoURL
      };

      setCurrentUser(appUser);
      return appUser;
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Ventana de acceso con Google cerrada antes de completar.');
      }
      throw new Error(err.message || 'Error al autenticarse con Google.');
    }
  };

  // Cierre de sesión
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn(e);
      }
    }
    setCurrentUser(null);
  };

  // Restablecimiento de contraseña
  const sendPasswordReset = async (email) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        await fbSendResetEmail(auth, cleanEmail);
        return {
          success: true,
          email: cleanEmail,
          message: `Se ha enviado el enlace oficial de restablecimiento a ${cleanEmail} desde Firebase.`
        };
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          throw new Error('No existe una cuenta asociada a este correo electrónico en Firebase.');
        }
        throw new Error(err.message || 'Error al enviar correo de recuperación.');
      }
    }

    // Modo local
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('No existe una cuenta asociada a este correo electrónico.');
    }

    const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    const resetRequests = JSON.parse(localStorage.getItem('ecommerce_reset_requests') || '{}');
    resetRequests[cleanEmail] = { token: resetToken, expires: Date.now() + 15 * 60 * 1000 };
    localStorage.setItem('ecommerce_reset_requests', JSON.stringify(resetRequests));

    return {
      success: true,
      email: cleanEmail,
      token: resetToken,
      message: `Se ha enviado el código (${resetToken}) a ${cleanEmail}.`
    };
  };

  const resetPasswordWithToken = async (email, token, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    const resetRequests = JSON.parse(localStorage.getItem('ecommerce_reset_requests') || '{}');
    const req = resetRequests[cleanEmail];

    if (!req || req.token !== token.trim().toUpperCase()) {
      throw new Error('El código de recuperación es inválido o ha expirado.');
    }

    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u, password: newPassword };
      }
      return u;
    }));

    delete resetRequests[cleanEmail];
    localStorage.setItem('ecommerce_reset_requests', JSON.stringify(resetRequests));
    return true;
  };

  const isAdmin = currentUser?.role === 'Administrador';
  const isClient = currentUser?.role === 'Cliente';
  const isAuthenticated = Boolean(currentUser);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      isClient,
      isAuthenticated,
      register,
      login,
      loginWithGoogle,
      logout,
      sendPasswordReset,
      resetPasswordWithToken,
      isFirebaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
