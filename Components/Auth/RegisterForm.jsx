import { useState } from 'react';
import styles from './AuthForms.module.css';
import { useAuth } from '../../contexts/AuthContext';

function RegisterForm({ onClose, switchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.passwordConfirm) {
      return setError('Les mots de passe ne correspondent pas');
    }
    
    if (formData.password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères');
    }
    
    setLoading(true);
    
    try {
      await register(formData);
      switchToLogin(); 
    } catch (err) {
      setError(err.message || 'Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    switchToLogin();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Créer un compte</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Votre pseudo"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="votre@email.com"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="register-password">Mot de passe</label>
        <input
          id="register-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="6 caractères minimum"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="passwordConfirm">Confirmer le mot de passe</label>
        <input
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Confirmer votre mot de passe"
        />
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
      </button>
      
      <div className={styles.switchForm}>
        Déjà un compte? 
        <button 
          onClick={handleSwitchToLogin}
          className={styles.linkButton}
        >
          Se connecter
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;