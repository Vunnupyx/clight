import { DataPointLiveData } from 'app/models';

export function filterLiveData(serverOffsetTime) {
  const diff = 5 * 60 * 1000; // 5 min

  return (liveData: DataPointLiveData) => {
    const nowTime = Date.now();

    const ldTime = liveData.timestamp * 1000 + serverOffsetTime * 1000;

    return Math.abs(nowTime - ldTime) < diff;
  };
}
