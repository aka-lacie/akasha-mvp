import React, { useEffect, useState } from 'react';
// import * as d3 from 'd3';

interface DataWordCloudProps {
  data: Array<string>;
}

const DataWordCloud: React.FC<DataWordCloudProps> = ({ data }) => {
  return (
    <div style={{ color: "blue" }}>
      {data.length === 0 ? (
        <p>Word Cloud goes here.</p>
      ) : (
        <ul>
          {data.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      )}
    </div>
  );
  // const [response, setResponse] = useState('');

  // useEffect(() => {
  //   if (response) {
  //     const DatawordCloud = new d3.WordCloud()
  //       .width(800)
  //       .height(600)
  //       .words(response.split(' '))
  //       .background('#fff')
  //       .fontSize(20);

  //     d3.select('.word-cloud')
  //       .append('svg')
  //       .attr('width', 800)
  //       .attr('height', 600)
  //       .append('g')
  //       .attr('transform', `translate(${wordCloud.x}, ${wordCloud.y})`)
  //       .call(wordCloud);
  //   }
  // }, [response]);

  // return (
  //   <div className="word-cloud">
  //     <svg />
  //   </div>
  // );
};

export default DataWordCloud;