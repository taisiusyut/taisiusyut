import TNCContent from '@/guide/tnc.md';
import classes from './TNC.module.scss';

export function TNC() {
  return (
    <div className={classes['tnc']}>
      <TNCContent />
    </div>
  );
}
