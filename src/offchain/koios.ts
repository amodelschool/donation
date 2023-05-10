import { KoiosProvider } from '@harmoniclabs/koios-pluts';
import { network } from './config';
export const koios = new KoiosProvider(network);
export default koios;