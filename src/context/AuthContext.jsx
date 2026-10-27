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
  fbSendEmailVerification,
  fbUpdateProfile,
  fbUpdatePassword,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
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
        role: 'Administrador',
        shippingAddress: 'Centro de Operaciones 0x1 Tech, CDMX'
      },
      {
        id: 'usr-cliente',
        name: 'Cliente Demo',
        email: 'cliente@tienda.com',
        password: 'cliente123password',
        role: 'Cliente',
        shippingAddress: 'Av. Insurgentes Sur 1450, Benito Juárez, CDMX'
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
        let shippingAddress = '';

        if (db) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              userRole = data.role === 'Administrador' ? 'Administrador' : 'Cliente';
              userName = data.name || userName;
              shippingAddress = data.shippingAddress || '';
            } else {
              // Registro nuevo en Firestore
              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userName,
                role: 'Cliente', // Seguridad: por defecto nadie se autoasigna Admin
                shippingAddress: '',
                createdAt: new Date().toISOString()
              });
            }
          } catch (e) {
            console.warn('Error leyendo perfil de Firestore:', e);
          }
        }

        const appUser = {
          id: firebaseUser.uid,
          name: userName,
          email: firebaseUser.email,
          role: userRole,
          shippingAddress,
          emailVerified: firebaseUser.emailVerified,
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

  // Registro de clientes con validación de nombre y apellido obligatorio [BUG-AUTH-02] y rol cliente forzado [BUG-AUTH-01]
  const register = async ({ name, email, password, role = 'Cliente' }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validación: al menos dos palabras separadas por espacio (Nombre y Apellido)
    const nameWords = cleanName.split(/\s+/).filter(Boolean);
    if (nameWords.length < 2) {
      throw new Error('Por favor ingresa tu nombre y al menos un apellido (ej. Juan Pérez).');
    }

    // Seguridad: en registro público el rol siempre es 'Cliente' para evitar escalación de privilegios
    const assignedRole = 'Cliente';

    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        
        // Actualizar displayName en Firebase Auth
        try {
          await fbUpdateProfile(userCred.user, { displayName: cleanName });
        } catch (_) {}

        // Enviar verificación de correo [BUG-AUTH-03]
        try {
          await fbSendEmailVerification(userCred.user);
        } catch (verifErr) {
          console.warn('No se pudo despachar correo de verificación automático:', verifErr);
        }

        const appUser = {
          id: userCred.user.uid,
          name: cleanName,
          email: cleanEmail,
          role: assignedRole,
          shippingAddress: '',
          emailVerified: false
        };

        if (db) {
          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            name: cleanName,
            email: cleanEmail,
            role: assignedRole,
            shippingAddress: '',
            createdAt: new Date().toISOString()
          });
        }

        setCurrentUser(appUser);
        return appUser;
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('El correo electrónico ya se encuentra registrado.');
        } else if (err.code === 'auth/weak-password') {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        } else {
          throw new Error(err.message || 'Error al registrarse en el sistema.');
        }
      }
    }

    // Modo local / Fallback
    const exists = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password,
      role: assignedRole,
      shippingAddress: ''
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
        let shippingAddress = '';

        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              userRole = data.role === 'Administrador' ? 'Administrador' : 'Cliente';
              userName = data.name || userName;
              shippingAddress = data.shippingAddress || '';
            }
          } catch (e) {
            console.warn(e);
          }
        }

        const appUser = {
          id: userCred.user.uid,
          name: userName,
          email: cleanEmail,
          role: userRole,
          shippingAddress,
          emailVerified: userCred.user.emailVerified
        };
        setCurrentUser(appUser);
        return appUser;
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
        }
        if (err.code === 'auth/too-many-requests') {
          throw new Error('Demasiados intentos fallidos. Por tu seguridad, espera unos minutos e inténtalo de nuevo.');
        }
        throw new Error(err.message || 'Error al iniciar sesión.');
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
      let shippingAddress = '';

      if (db) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            userRole = data.role === 'Administrador' ? 'Administrador' : 'Cliente';
            userName = data.name || userName;
            shippingAddress = data.shippingAddress || '';
          } else {
            await setDoc(userDocRef, {
              uid: user.uid,
              name: userName,
              email: user.email,
              role: 'Cliente',
              shippingAddress: '',
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
        shippingAddress,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      };

      setCurrentUser(appUser);
      return appUser;
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Ventana de acceso con Google cancelada por el usuario.');
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

  // Restablecimiento de contraseña con captura de [BUG-AUTH-04] Rate Limiting
  const sendPasswordReset = async (email) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        await fbSendResetEmail(auth, cleanEmail);
        return {
          success: true,
          email: cleanEmail,
          message: `Se ha enviado el enlace oficial de restablecimiento a ${cleanEmail}. Revisa tu bandeja de entrada o spam.`
        };
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          throw new Error('No existe una cuenta asociada a este correo electrónico.');
        }
        if (err.code === 'auth/too-many-requests') {
          throw new Error('Has solicitado el restablecimiento demasiadas veces recientemente. Por favor espera unos minutos antes de intentar de nuevo.');
        }
        throw new Error(err.message || 'Error al enviar el correo de recuperación.');
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

  // [GAP-01] Actualizar Perfil (Nombre, Dirección y Contraseña)
  const updateProfile = async ({ name, shippingAddress, newPassword }) => {
    if (!currentUser) throw new Error('No hay usuario autenticado.');
    const cleanName = (name || '').trim();
    const cleanAddress = (shippingAddress || '').trim();

    if (cleanName) {
      const words = cleanName.split(/\s+/).filter(Boolean);
      if (words.length < 2) {
        throw new Error('Ingresa al menos un nombre y un apellido.');
      }
    }

    if (isFirebaseConfigured && auth && auth.currentUser) {
      if (cleanName && cleanName !== currentUser.name) {
        await fbUpdateProfile(auth.currentUser, { displayName: cleanName });
      }
      if (newPassword && newPassword.length >= 6) {
        await fbUpdatePassword(auth.currentUser, newPassword);
      }
      if (db) {
        await updateDoc(doc(db, 'users', currentUser.id), {
          name: cleanName || currentUser.name,
          shippingAddress: cleanAddress
        });
      }
    }

    // Actualizar estado local
    const updatedUser = {
      ...currentUser,
      name: cleanName || currentUser.name,
      shippingAddress: cleanAddress
    };

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedUser, ...(newPassword ? { password: newPassword } : {}) } : u));
    setCurrentUser(updatedUser);
    return updatedUser;
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
      updateProfile,
      isFirebaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
