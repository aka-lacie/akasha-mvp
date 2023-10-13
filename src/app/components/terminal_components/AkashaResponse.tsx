import ReconstructingText from './ReconstructingText';

const AkashaResponse: React.FC<AkashaResponseProps> = ({ answer }) => {
  return (
    <div className='answerBubbleOpen min-w-[12rem]'>
      <div className="text-sm text-center textClip overflow-hidden min-w-full max-w-prose">
        <ReconstructingText targetString={answer} />
      </div>
    </div>
  );
};

export default AkashaResponse;