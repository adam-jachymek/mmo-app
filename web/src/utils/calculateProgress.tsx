const calculateProgress = (progress: number, maxProgress: number) => {
  return Math.floor((progress / maxProgress) * 100);
};

export default calculateProgress;
