import { createConfirmDialog } from '@/components/ConfirmDialog';
import { createOpenOverlay } from '@/utils/openOverlay';
import { MixedOverlay, MixedOverlayProps } from './MixedOverlay';
import classes from './MixedOverlay.module.scss';

function _MixedConfirmOverlay(props: MixedOverlayProps) {
  return <MixedOverlay {...props} className={classes['confirm']} />;
}

export const MixedConfirmOverlay = createConfirmDialog(_MixedConfirmOverlay);
export const openMixedConfirmOverlay = createOpenOverlay(MixedConfirmOverlay);
