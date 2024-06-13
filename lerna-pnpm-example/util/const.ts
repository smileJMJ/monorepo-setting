export const NETWORK = {
  SB: 'sb',
  RC: 'rc',
  STAGE: 'stage',
  LIVE: 'live',
};

export const getNetwork = () => {
  alert(`현재 접속한 망은 ${NETWORK.LIVE} 입니다.`);
};
