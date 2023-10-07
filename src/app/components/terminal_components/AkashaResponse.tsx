import ReconstructingText from './ReconstructingText';

const AkashaResponse: React.FC<AkashaResponseProps> = ({ answer }) => {
  return (
    <div className='answerBubbleOpen'>
      <div className="text-sm text-center textClip overflow-hidden max-w-prose">
        <ReconstructingText targetString={answer} />
        {/* <p className='font-mono textClip'>It is not explicitly stated where Celestia came from. While the origin of Celestia is not directly mentioned, it can be inferred that it is a celestial realm where the gods reside and is closely connected to the earth and its history.</p> */}
      </div>
    </div>
  );
};

export default AkashaResponse;