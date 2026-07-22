import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const { t } = useTranslation();
  useEffect(() => { if (token) navigate('/'); }, [token, navigate]);
  const submit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = mode === 'signup' ? '/api/user/register' : '/api/user/login';
      const response = await axios.post(`${backendUrl}${endpoint}`, mode === 'signup' ? { name, email, password } : { email, password });
      if (!response.data.success) throw new Error(response.data.message);
      if (mode === 'signup') { toast.success(t('authentication.registrationSuccess')); setMode('login'); return; }
      localStorage.setItem('token', response.data.token); setToken(response.data.token); toast.success(t('authentication.loginSuccess'));
    } catch (error) { console.error(error); toast.error(error.message || t('common.error')); }
  };
  const signup = mode === 'signup';
  return <main className="page-container page-content"><section className="auth-wrap premium-card"><span className="eyebrow">Black & White</span><h1>{t(signup ? 'authentication.signup' : 'authentication.login')}</h1><p className="muted">{signup ? t('authentication.newHere') : t('authentication.alreadyMember')}</p><form onSubmit={submit}>{signup && <input className="glass-input" value={name} onChange={(event) => setName(event.target.value)} placeholder={t('authentication.name')} required />}<input className="glass-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('authentication.email')} required /><input className="glass-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t('authentication.password')} required /><button className="premium-button" type="submit">{t(signup ? 'authentication.createAccount' : 'authentication.signIn')}</button></form><p className="auth-switch">{signup ? t('authentication.alreadyMember') : t('authentication.newHere')} <button className="text-link" onClick={() => setMode(signup ? 'login' : 'signup')}>{t(signup ? 'authentication.loginHere' : 'authentication.createAccount')}</button></p></section></main>;
};

export default Login;
