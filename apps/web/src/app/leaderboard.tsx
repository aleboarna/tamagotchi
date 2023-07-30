import { EntryGetResponsePayload } from '@tamagotchi/types';
//get leaderboard from local storage
export const getLocalLeaderboard = (): EntryGetResponsePayload[] => {
  const entries: EntryGetResponsePayload[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.endsWith('-happiness')) {
      const userName = key.split('-')[0];
      const retryCount =
        Number(localStorage.getItem(`${userName}-retryCount`)) || 1;
      const recordLifeCycles =
        Number(localStorage.getItem(`${userName}-recordLifeCycles`)) || 1;
      entries.push({ userName, retryCount, recordLifeCycles });
    }
  }
  return entries
    .sort((a, b) => {
      if (a.recordLifeCycles > b.recordLifeCycles) {
        return -1;
      } else if (a.recordLifeCycles < b.recordLifeCycles) {
        return 1;
      } else {
        if (a.retryCount > b.retryCount) {
          return -1;
        } else if (a.retryCount < b.retryCount) {
          return 1;
        } else {
          return 0;
        }
      }
    })
    .slice(0, 9);
};

export const Leaderboard = (props: { entries: EntryGetResponsePayload[] }) => {
  return (
    <div className="w-4/5 sm:w-1/3 flex flex-col order-3 sm:order-1 sm:px-4">
      <div className="flex justify-between font-bold text-l mb-4">
        <div className="w-1/3">Name</div>
        <div className="w-1/3">Total Tries</div>
        <div className="w-1/3">Max Lifecycles</div>
      </div>
      {props.entries.map((item, index) => (
        <div
          key={index}
          className={`flex justify-between py-2 ${
            index % 2 === 0 ? 'bg-gray-100' : ''
          }`}
        >
          <div className="w-1/3">{item.userName}</div>
          <div className="w-1/3">{item.retryCount}</div>
          <div className="w-1/3">{item.recordLifeCycles}</div>
        </div>
      ))}
    </div>
  );
};
