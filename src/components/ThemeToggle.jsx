import { useDispatch, useSelector } from 'react-redux';
import { FiMoon, FiSun } from 'react-icons/fi';
import { setTheme } from '../store/actions';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme);
  const dark = theme === 'dark';
  return (
    <button className="icon-btn" onClick={() => dispatch(setTheme(dark ? 'light' : 'dark'))} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
      <span key={theme} className="animate-pop">{dark ? <FiSun /> : <FiMoon />}</span>
    </button>
  );
}
