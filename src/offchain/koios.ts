import { KoiosProvider } from '@harmoniclabs/koios-pluts';
import { provider } from './config';
export const koios = new KoiosProvider(provider);
export default koios;
