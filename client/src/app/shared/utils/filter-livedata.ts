import { DataPointLiveData } from 'app/models';

export function filterLiveData(serverOffsetTime) {
  const diff = 60000; // 1 min

  return (liveData: DataPointLiveData) => {
    const nowTime = Date.now() - serverOffsetTime * 1000;

    const ldTime = liveData.timestamp * 1000 - serverOffsetTime * 1000;

    return Math.abs(nowTime - ldTime) < diff;
  };
}
