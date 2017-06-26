import { ac } from './audio'
const compressor = ac.createDynamicsCompressor();

compressor.threshold.value = -24;
compressor.knee.value = 0;
compressor.ratio.value = 4;
compressor.reduction.value = -20;
compressor.attack.value = .1;
compressor.release.value = .4;

export default compressor