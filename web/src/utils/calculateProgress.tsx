const calculateProgress = (progress: number, maxProgress: number) => {
  return (progress / maxProgress) * 100;
};

export default calculateProgress;
